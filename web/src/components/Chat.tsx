import { useState } from 'react';
import { useLedger } from '@/hooks/useLedger';
import FuelMeter from '@/components/FuelMeter';

export default function Chat() {
  const { ledger, spend } = useLedger();
  const [messages, setMessages] = useState<{ role:'user'|'assistant'; content:string }[]>([]);
  const [input, setInput] = useState('');
  const estimateTokens = (t:string) => Math.ceil(t.length * 3); // mock

  const onSend = async () => {
    const est = estimateTokens(input);
    spend(est);
    setMessages(m => [...m, { role:'user', content: input }, { role:'assistant', content: '(stub) Streaming reply…' }]);
    setInput('');
  };

  return (
    <div className="mx-auto max-w-3xl p-4 space-y-4">
      <FuelMeter personal={ledger.personal} reserve={ledger.reserve} poolBonus={ledger.poolBonus} />
      <div className="rounded-2xl border border-white/10 p-4 min-h-[40vh]">
        {messages.map((m,i)=>(
          <div key={i} className={m.role==='user'?'text-right':'text-left'}>
            <div className="inline-block px-3 py-2 my-1 rounded-xl bg-white/5">{m.content}</div>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input className="flex-1 rounded-xl bg-white/5 px-3 py-2 outline-none"
               placeholder="Say hi to GPT-5…" value={input} onChange={e=>setInput(e.target.value)} />
        <button className="rounded-xl px-4 py-2 bg-white text-black" onClick={onSend} disabled={!input.trim()}>
          Send
        </button>
      </div>
      <p className="text-xs opacity-60">Est. spend: ~{estimateTokens(input)} tokens (mock).</p>
    </div>
  );
}
