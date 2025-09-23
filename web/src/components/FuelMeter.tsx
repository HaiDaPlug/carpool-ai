import type { FC } from 'react'

type Props = {
  personal: number
  reserve: number
  community: number
}

const pct = (n: number, max: number) => Math.max(0, Math.min(100, Math.round((n / max) * 100)))

export const FuelMeter: FC<Props> = ({ personal, reserve, community }) => {
  const max = Math.max(1, personal + reserve + community)
  const bars = [
    { label: 'Personal', value: personal },
    { label: 'Reserve', value: reserve },
    { label: 'Community', value: community },
  ]

  return (
    <div className="grid gap-3">
      {bars.map((b) => (
        <div key={b.label} className="grid gap-1">
          <div className="text-sm font-medium">{b.label}</div>
          <div className="h-3 bg-white rounded-xl shadow-soft overflow-hidden">
            <div className="h-full rounded-xl" style={{ width: pct(b.value, max) + '%' }} />
          </div>
          <div className="text-xs text-neutral-500">{b.value.toLocaleString()} tokens</div>
        </div>
      ))}
    </div>
  )
}
