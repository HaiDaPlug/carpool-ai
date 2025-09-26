import { useNavigate } from 'react-router-dom';
import { TierCard } from '../components/TierCard';

export default function Landing() {
  const nav = useNavigate();
  const goAccount = () => nav('/account');

  return (
    <main className="max-w-6xl mx-auto px-4 py-16 grid gap-10">
      <header className="text-center grid gap-3">
        <h1 className="text-3xl font-semibold">GPT-5 for less. No compromises.</h1>
        <p className="opacity-80">Transparent tokens. Fair pool. Simple pricing.</p>
      </header>

      <section className="grid gap-4 sm:grid-cols-3">
        <TierCard
          name="Cruiser"
          priceId="disabled"
          cta={goAccount}
          bullets={['≈178k personal tokens/mo', 'Reserve cap ≈890k', 'Spending: personal → reserve']}
        />
        <TierCard
          name="Power"
          priceId="disabled"
          cta={goAccount}
          bullets={['≈356k personal tokens/mo', 'Reserve cap ≈1.78M', 'Spending: personal → reserve']}
        />
        <TierCard
          name="Pro"
          priceId="disabled"
          cta={goAccount}
          bullets={['≈711k personal tokens/mo', 'Reserve cap ≈3.56M', 'Spending: personal → reserve']}
        />
      </section>
    </main>
  );
}
