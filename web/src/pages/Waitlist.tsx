import { useState, useMemo } from 'react';
import { Check } from 'lucide-react';

export default function Waitlist() {
  const [email, setEmail] = useState('');
  const [source, setSource] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');
  const [trap, setTrap] = useState(''); // honeypot

  const isValid = useMemo(() => {
    if (!email) return false;
    // simple email check (server validates again)
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(email.trim());
  }, [email]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === 'loading') return;
    setStatus('loading');
    setError('');

    try {
      const resp = await fetch('/api/join-waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), source, trap })
      });

      const ct = resp.headers.get('content-type') || '';
      let payload: any = null;

      if (ct.includes('application/json')) {
        try { payload = await resp.json(); } catch { payload = null; }
      } else {
        try { payload = await resp.text(); } catch { payload = ''; }
      }

      if (!resp.ok || (payload && typeof payload === 'object' && payload.ok === false)) {
        console.error('Join failed:', resp.status, payload);
        const msg =
          (payload && typeof payload === 'object' && payload.error) ? payload.error :
          (typeof payload === 'string' && payload.length ? payload :
          `Failed (${resp.status})`);
        throw new Error(msg);
      }

      setStatus('success');
      setEmail('');
      setSource('');
    } catch (err: any) {
      console.error('Submit error:', err);
      setStatus('error');
      setError(err?.message ?? 'Server error');
    }
  }

  return (
    <div className="relative min-h-[100svh] overflow-hidden bg-black text-white">
      {/* Background Glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[700px] w-[700px] -translate-x-1/2 rounded-full blur-3xl"
        style={{
          background:
            'radial-gradient(50% 50% at 50% 50%, rgba(255,115,115,0.25) 0%, rgba(255,115,115,0) 60%)'
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-48 -left-28 h-[520px] w-[520px] rounded-full blur-3xl opacity-70"
        style={{
          background:
            'radial-gradient(50% 50% at 50% 50%, rgba(255,184,108,0.18) 0%, rgba(255,184,108,0) 60%)'
        }}
      />


      {/* Main */}
      <main className="relative z-10">
        <section className="mx-auto max-w-5xl px-4 pt-8 pb-16 md:pt-16">
          {/* Hero */}
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
              Founding riders get bonus fuel
            </div>
            <h1 className="text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
              Carpool into <span className="bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">GPT-5</span> for less
            </h1>
            <p className="mt-4 text-balance text-white/70 md:text-lg">
              Split the ride, keep the full experience. Join the waitlist for early access,
              bonus fuel, and launch updates.
            </p>
          </div>

          {/* Form Card */}
<div className="mx-auto mt-8 max-w-xl rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur md:p-6 relative z-20 pointer-events-auto">
  {status === 'success' ? (
    <SuccessCard />
  ) : (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* Honeypot */}
      <input
        aria-hidden
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        value={trap}
        onChange={(e) => setTrap(e.target.value)}
        placeholder="Leave this empty"
      />

      <div className="grid gap-3 md:grid-cols-[1fr,160px]">
        <div>
          <label className="mb-1 block text-sm text-white/70">Email</label>
          <input
            className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-white outline-none ring-0 transition focus:border-white/20"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="you@domain.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-white/70">How did you find us? (optional)</label>
          <input
            className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-white outline-none ring-0 transition focus:border-white/20"
            type="text"
            placeholder="Threads / X / Reddit / Friend"
            value={source}
            onChange={(e) => setSource(e.target.value)}
          />
        </div>
      </div>

      {status === 'error' && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {error}
        </div>
      )}

      {/* Always clickable; we validate on submit */}
      <button
        type="submit"
        aria-disabled={status === 'loading'}
        className="group relative inline-flex w-full items-center justify-center overflow-hidden rounded-xl bg-white px-4 py-3 font-medium text-black transition hover:opacity-90"
      >
        <span className="relative z-10">
          {status === 'loading' ? 'Joining…' : 'Join the Waitlist'}
        </span>
        <div
          aria-hidden
          className="absolute inset-0 -z-0 opacity-0 transition group-hover:opacity-100"
          style={{
            background:
              'radial-gradient(60% 60% at 50% 50%, rgba(255,115,115,0.35) 0%, rgba(255,115,115,0) 60%)'
          }}
        />
      </button>

      <p className="text-center text-xs text-white/60">
        No spam. We’ll email you about launch and bonuses only.
      </p>
    </form>
  )}
</div>

          {/* Mini features */}
          <ul className="mx-auto mt-10 grid max-w-3xl grid-cols-1 gap-3 text-sm text-white/70 md:grid-cols-3">
            <FeatureItem title="Lower monthly cost." />
            <FeatureItem title="Fuel meter transparency." />
            <FeatureItem title="Founding rider perks." />
          </ul>

          {/* Trust row */}
          <div className="mx-auto mt-10 flex max-w-3xl flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-white/50">
            <span className="inline-flex items-center gap-2">
              <Dot /> Built on Vercel + Supabase
            </span>
            <span className="inline-flex items-center gap-2">
              <Dot /> Privacy-first, no spam
            </span>
            <span className="inline-flex items-center gap-2">
              <Dot /> Cancel anytime after launch
            </span>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-6 text-xs text-white/50">
          <span>© {new Date().getFullYear()} Carpool AI</span>
          <span>Launching soon...</span>
        </div>
      </footer>
    </div>
  );
}

/* ——— UI bits ——— */

function FeatureItem({ title }: { title: string }) {
  return (
    <li className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur">
      <div className="flex items-center gap-2">
        <Check className="h-4 w-4 text-white/80" aria-hidden />
        <span>{title}</span>
      </div>
    </li>
  );
}

function Dot() {
  return <span className="inline-block h-1.5 w-1.5 rounded-full bg-white/40" aria-hidden />;
}

function SuccessCard() {
  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
        <div className="flex items-center gap-2 text-emerald-300">
          <Check className="h-5 w-5" aria-hidden />
          <p className="font-medium">You’re in! 🚗⛽</p>
        </div>
        <p className="mt-1 text-sm text-emerald-200/80">
          We’ll email you when the beta opens and send your founding-rider bonus fuel.
        </p>
      </div>
      <p className="text-center text-sm text-white/60">
        Want to help? Share this page with a friend who uses GPT a lot.
      </p>
    </div>
  );
}
