import type { FC } from 'react'
import { TOKEN_FORMULA_V2_1 } from '../../shared/tokens'

type Props = {
  personal: number
  reserve: number
  community: number
  tier?: 'cruiser' | 'power' | 'pro'
}

const pct = (current: number, max: number) => 
  Math.max(0, Math.min(100, Math.round((current / max) * 100)))

const formatTokens = (tokens: number) => {
  if (tokens >= 1000000) {
    return (tokens / 1000000).toFixed(1) + 'M'
  }
  if (tokens >= 1000) {
    return (tokens / 1000).toFixed(0) + 'K'
  }
  return tokens.toString()
}

export const FuelMeter: FC<Props> = ({ personal, reserve, community, tier = 'cruiser' }) => {
  const caps = TOKEN_FORMULA_V2_1[tier]
  
  // Each bar shows current/max for that specific bucket
  const bars = [
    { 
      label: 'Personal', 
      value: personal, 
      max: caps.personal, 
      color: 'bg-blue-500',
      description: 'Your monthly allocation'
    },
    { 
      label: 'Reserve', 
      value: reserve, 
      max: caps.reserveCap, 
      color: 'bg-green-500',
      description: 'Rolled over from previous months'
    },
    { 
      label: 'Community Bonus', 
      value: community, 
      max: Math.max(community, 100000), // Dynamic max, at least 100K for display
      color: 'bg-purple-500',
      description: 'Shared from the community pool'
    },
  ]

  const totalTokens = personal + reserve + community

  return (
    <div className="grid gap-4">
      {/* Total summary */}
      <div className="flex justify-between items-center">
        <div className="text-lg font-semibold">Total Fuel</div>
        <div className="text-lg font-mono">{formatTokens(totalTokens)} tokens</div>
      </div>
      
      {/* Individual bars */}
      <div className="grid gap-3">
        {bars.map((bar) => (
          <div key={bar.label} className="grid gap-1">
            <div className="flex justify-between items-center">
              <div className="text-sm font-medium">{bar.label}</div>
              <div className="text-xs text-neutral-500">
                {formatTokens(bar.value)} / {formatTokens(bar.max)}
              </div>
            </div>
            
            <div className="h-3 bg-neutral-200 rounded-xl overflow-hidden">
              <div 
                className={`h-full ${bar.color} transition-all duration-300 ease-out`}
                style={{ width: `${pct(bar.value, bar.max)}%` }}
              />
            </div>
            
            <div className="text-xs text-neutral-400">
              {bar.description}
            </div>
          </div>
        ))}
      </div>
      
      {/* Tier info */}
      <div className="text-xs text-neutral-500 pt-2 border-t">
        {tier.charAt(0).toUpperCase() + tier.slice(1)} tier • Next refill on 1st
      </div>
    </div>
  )
}