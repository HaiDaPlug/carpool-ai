import type { FC } from 'react'

type Props = {
  name: string
  priceId: string
  cta: (priceId: string) => void
  bullets: string[]
}

export const TierCard: FC<Props> = ({ name, priceId, cta, bullets }) => (
  <div className="p-6 bg-white rounded-2xl shadow-soft grid gap-4">
    <div className="text-xl font-semibold text-black">{name}</div>
    <ul className="text-sm text-neutral-700 grid gap-1 list-disc ml-5">
      {bullets.map((b, i) => (
        <li key={i}>{b}</li>
      ))}
    </ul>
    <button onClick={() => cta(priceId)} className="px-4 py-2 rounded-xl bg-black text-white">
      Get {name}
    </button>
  </div>
)
