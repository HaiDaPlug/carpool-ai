import { TierCard } from '../components/TierCard'

export default function Landing() {
  const checkout = async (priceId: string) => {
    const r = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ priceId }),
    })
    const { url } = await r.json()
    window.location.href = url
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-16 grid gap-10">
      <header className="text-center grid gap-3">
        <h1 className="text-4xl font-bold">Carpool into GPT-5 for less</h1>
        <p className="text-neutral-600">Clean, affordable access. Shared pool bonus every month.</p>
      </header>
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <TierCard
          name="Cruiser"
          priceId={import.meta.env.VITE_PRICE_CRUISER as string}
          cta={checkout}
          bullets={['$1 personal tokens', '$0.50 community buffer', 'Reserve cap $5']}
        />
        <TierCard
          name="Power"
          priceId={import.meta.env.VITE_PRICE_POWER as string}
          cta={checkout}
          bullets={['$2 personal tokens', '$1 community buffer', 'Reserve cap $10']}
        />
        <TierCard
          name="Pro"
          priceId={import.meta.env.VITE_PRICE_PRO as string}
          cta={checkout}
          bullets={['$4 personal tokens', '$2 community buffer', 'Reserve cap $20']}
        />
      </section>
    </main>
  )
}
