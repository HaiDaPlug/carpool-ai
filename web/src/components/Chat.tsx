import { useState } from 'react'
import { FuelMeter } from './FuelMeter'

export default function Chat() {
  const [msg, setMsg] = useState('')
  const [log, setLog] = useState<string[]>([])
  const [fuel, setFuel] = useState({ personal: 1_500_000, reserve: 2_000_000, community: 500_000 })

  async function send() {
    if (!msg.trim()) return
    setLog((l) => [...l, 'You: ' + msg])
    setMsg('')

    // Fake token calc: 500 tokens
    const tokens = 500
    const r = await fetch('/api/use-tokens', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: 'demo', tokens }),
    })

    if (r.ok) {
      setLog((l) => [...l, 'Bot: (demo) reply'])
      // Demo only; real values will come from DB
      setFuel((f) => ({ ...f, personal: Math.max(0, f.personal - tokens) }))
    } else {
      setLog((l) => [...l, 'Bot: Out of tokens.'])
    }
  }

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-8 p-4 bg-white rounded-2xl shadow-soft min-h-[60vh] grid grid-rows-[1fr_auto]">
        <div className="space-y-2 overflow-auto">
          {log.map((m, i) => (
            <div key={i} className="text-sm">
              {m}
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            className="flex-1 border rounded-xl px-3 py-2"
            placeholder="Say hi..."
          />
          <button onClick={send} className="px-4 py-2 rounded-xl bg-black text-white">
            Send
          </button>
        </div>
      </div>
      <div className="col-span-4">
        <div className="p-4 bg-white rounded-2xl shadow-soft grid gap-4">
          <div className="text-lg font-semibold">Fuel</div>
          <FuelMeter personal={fuel.personal} reserve={fuel.reserve} community={fuel.community} />
        </div>
      </div>
    </div>
  )
}
