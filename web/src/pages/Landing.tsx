import TierCard from '@/components/TierCard';

export default function Landing() {
  return (
    <div className="py-16">
      {/* Hero */}
      <div className="mx-auto max-w-3xl text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
          Carpool into GPT-5 for less
        </h1>
        <p className="text-base md:text-lg opacity-70">
          Personal + Reserve tokens with a monthly pool bonus.
          A clean chat experience, fair pricing, simple billing.
        </p>
      </div>

      {/* Tiers */}
      <div className="mx-auto mt-10 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <TierCard name="Cruiser"      price="€5.99"  note="For light use"  disabled />
        <TierCard name="Power Driver" price="€7.99"  note="Best value"     disabled />
        <TierCard name="Pro Driver"   price="€14.99" note="For heavy use"  disabled />
      </div>

      {/* Footnote */}
      <p className="mx-auto mt-4 max-w-3xl text-center text-xs opacity-60">
        Checkout is temporarily disabled while we wire up Stripe. Fuel logic is active in-app.
      </p>
    </div>
  );
}
