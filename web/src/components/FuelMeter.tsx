import type { FC } from 'react';
import { MONTHLY_PERSONAL, RESERVE_CAP, pct, clampReserve, formatTokens, type Tier } from '../../shared/tokens';

type Props = {
  personal: number;
  reserve: number;
  tier?: Tier;
};

export const FuelMeter: FC<Props> = ({ personal, reserve, tier = 'power' }) => {
  const personalMax = MONTHLY_PERSONAL[tier];
  const reserveMax  = RESERVE_CAP[tier];

  const personalPct = pct(personal, personalMax);
  const reserveSafe = clampReserve(tier, reserve);
  const reservePct  = pct(reserveSafe, reserveMax);

  const bars = [
    {
      label: 'Personal',
      value: `${formatTokens(personal)} / ${formatTokens(personalMax)}`,
      pct: personalPct,
      track: 'bg-neutral-800',
      fill: 'bg-neutral-100',
    },
    {
      label: 'Reserve',
      value: `${formatTokens(reserveSafe)} / ${formatTokens(reserveMax)}`,
      pct: reservePct,
      track: 'bg-neutral-800',
      fill: 'bg-neutral-300',
    }
  ];

  return (
    <div className="rounded-2xl border border-white/10 p-4 bg-black/40">
      <div className="mb-2 text-sm font-medium">Fuel</div>
      <div className="grid gap-3">
        {bars.map((b) => (
          <div key={b.label}>
            <div className="mb-1 flex justify-between text-xs opacity-80">
              <span>{b.label}</span>
              <span>{b.value}</span>
            </div>
            <div className={`h-2 rounded-full ${b.track}`}>
              <div className={`h-2 rounded-full ${b.fill}`} style={{ width: `${b.pct}%` }} />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-2 border-t border-white/5 pt-2 text-[11px] opacity-60">
        Reserve auto-spends after Personal. Caps prevent runaway hoarding.
      </div>
    </div>
  );
};

export default FuelMeter;
