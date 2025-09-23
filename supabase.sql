-- ============================================================
-- Carpool GPT Database Schema + Token Functions
-- Version: v2.1 (Ghost ledger, reserve caps, pool redistribution)
-- ============================================================

-- === User profile (mirror minimal data from Supabase auth) ===
create table if not exists user_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  created_at timestamptz default now()
);

-- === Subscription state ===
create type if not exists tier as enum ('rider','power','pro');

create table if not exists subscriptions (
  user_id uuid primary key references auth.users(id) on delete cascade,
  tier tier not null,
  status text not null,                        -- "active", "past_due", "canceled"
  current_period_start date not null,
  current_period_end date not null,
  stripe_customer_id text not null,
  stripe_subscription_id text not null,
  updated_at timestamptz default now()
);

-- === Ghost ledger (no pre-funding). Tracks balances in tokens. ===
create table if not exists token_ledger (
  user_id uuid primary key references auth.users(id) on delete cascade,
  personal bigint not null default 0,
  reserve bigint not null default 0,
  community_bonus bigint not null default 0,
  updated_at timestamptz default now()
);

-- === Usage journal (deducts from balances in order: personal -> reserve -> community_bonus) ===
create table if not exists usage_events (
  id bigserial primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  tokens_used bigint not null,
  source text not null,                        -- e.g. "chat:completion", "vision:image"
  created_at timestamptz default now()
);

-- === Monthly community pool (cap = 3x inflow; overflow → margin) ===
create table if not exists community_pool (
  id smallint primary key default 1,
  balance bigint not null default 0,
  cap bigint not null default 0,               -- recomputed monthly
  updated_at timestamptz default now()
);

insert into community_pool (id, balance, cap)
  values (1, 0, 0)
  on conflict (id) do nothing;

-- ============================================================
-- FUNCTIONS
-- ============================================================

-- 1. Monthly allocation (called from Stripe webhook on renewal)
create or replace function apply_monthly_allocation(
  p_user_id uuid,
  p_personal bigint,
  p_pool_contrib bigint
) returns void language plpgsql as $$
begin
  insert into token_ledger (user_id, personal, reserve, community_bonus)
  values (p_user_id, p_personal, 0, 0)
  on conflict (user_id) do update
    set personal = token_ledger.personal + p_personal,
        updated_at = now();

  update community_pool
  set balance = balance + p_pool_contrib,
      updated_at = now()
  where id = 1;
end;
$$;

-- 2. Spend tokens in order: personal → reserve → community_bonus
create or replace function spend_tokens(
  p_user_id uuid,
  p_amount bigint
) returns json language plpgsql as $$
declare
  led record;
  remain bigint := p_amount;
  spend_personal bigint := 0;
  spend_reserve bigint := 0;
  spend_bonus bigint := 0;
begin
  select * into led from token_ledger where user_id = p_user_id for update;
  if not found then
    raise exception 'ledger not found';
  end if;

  -- deduct from personal
  if led.personal >= remain then
    spend_personal := remain; remain := 0;
  else
    spend_personal := led.personal; remain := remain - led.personal;
  end if;

  -- deduct from reserve
  if remain > 0 then
    if led.reserve >= remain then
      spend_reserve := remain; remain := 0;
    else
      spend_reserve := led.reserve; remain := remain - led.reserve;
    end if;
  end if;

  -- deduct from community bonus
  if remain > 0 then
    if led.community_bonus >= remain then
      spend_bonus := remain; remain := 0;
    else
      spend_bonus := led.community_bonus; remain := remain - led.community_bonus;
    end if;
  end if;

  -- insufficient funds
  if remain > 0 then
    return json_build_object('ok', false, 'remaining', remain);
  end if;

  -- apply updates
  update token_ledger
  set personal = personal - spend_personal,
      reserve = reserve - spend_reserve,
      community_bonus = community_bonus - spend_bonus,
      updated_at = now()
  where user_id = p_user_id;

  insert into usage_events (user_id, tokens_used, source)
  values (p_user_id, p_amount, 'chat:completion');

  return json_build_object(
    'ok', true,
    'personal', spend_personal,
    'reserve', spend_reserve,
    'community_bonus', spend_bonus
  );
end;
$$;

-- 3. Monthly rollover (called on the 1st of each month)
create or replace function monthly_rollover()
returns void language plpgsql as $$
declare
  pool record;
  user_count bigint := 0;
  per_user bigint := 0;
begin
  -- lock pool
  select * into pool from community_pool where id = 1 for update;

  -- redistribute pool evenly to active users
  select count(*) into user_count from subscriptions where status = 'active';
  if user_count > 0 and pool.balance > 0 then
    per_user := pool.balance / user_count;

    update token_ledger t
    set community_bonus = community_bonus + per_user,
        updated_at = now()
    from subscriptions s
    where t.user_id = s.user_id
      and s.status = 'active';

    update community_pool
    set balance = balance - (per_user * user_count),
        updated_at = now()
    where id = 1;
  end if;

  -- move unused personal into reserve up to cap
  update token_ledger t
  set reserve = least(
        reserve + personal,
        case s.tier
          when 'rider' then 5000000   -- 5M token cap
          when 'power' then 10000000  -- 10M token cap
          when 'pro'   then 20000000  -- 20M token cap
        end
      ),
      personal = 0,
      updated_at = now()
  from subscriptions s
  where t.user_id = s.user_id
    and s.status = 'active';
end;
$$;
