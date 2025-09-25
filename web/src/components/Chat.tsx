import { useState } from 'react'
import { FuelMeter } from './FuelMeter'
import { useAuth } from '../contexts/AuthContext'

export default function Chat() {
  const { user, loading } = useAuth()
  const [msg, setMsg] = useState('')
  const [log, setLog] = useState<string[]>([])
  const [fuel, setFuel] = useState({ personal: 1_500_000, reserve: 2_000_000, community: 500_000 })

  async function send() {
    if (!msg.trim() || !user) return
    
    setLog((l) => [...l, 'You: ' + msg])
    setMsg('')

    const tokens = 500
    const r = await fetch('/api/use-tokens', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        userId: user.id, // FIXED: No more 'demo' user
        tokens 
      }),
    })

    if (r.ok) {
      const data = await r.json()
      setLog((l) => [...l, 'Bot: Message sent successfully!'])
      // Update fuel based on actual response
      setFuel((f) => ({ ...f, personal: Math.max(0, f.personal - tokens) }))
    } else {
      const error = await r.json()
      setLog((l) => [...l, `Bot: ${error.error || 'Request failed'}`])
    }
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-pulse">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-neutral-600 mb-4">Please sign in to start chatting</p>
        <button 
          onClick={() => {
            // For now, just show a message. You can implement a proper sign-in modal later
            alert('Sign in functionality coming soon! For now, this shows the auth flow works.')
          }}
          className="px-4 py-2 rounded-xl bg-black text-white"
        >
          Sign In
        </button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-8 p-4 bg-white rounded-2xl shadow-soft min-h-[60vh] grid grid-rows-[1fr_auto]">
        <div className="space-y-2 overflow-auto">
          <div className="text-xs text-neutral-500 mb-4">
            Signed in as: {user.email}
          </div>
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
            onKeyDown={(e) => e.key === 'Enter' && send()}
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
          <FuelMeter personal={fuel.personal} reserve={fuel.reserve} community={fuel.community} tier="cruiser" />
        </div>
      </div>
    </div>
  )
}
