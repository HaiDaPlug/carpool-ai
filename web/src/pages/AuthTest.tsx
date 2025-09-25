import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function AuthTest() {
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [msg, setMsg] = useState('');

  async function signUp() {
    const { data, error } = await supabase.auth.signUp({ email, password: pw });
    setMsg(error ? error.message : `Signed up: ${data.user?.email}`);
  }

  async function signIn() {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password: pw });
    setMsg(error ? error.message : `Signed in: ${data.user?.email}`);
  }

  async function whoami() {
    const { data: { user } } = await supabase.auth.getUser();
    setMsg(user ? `User: ${user.email}` : 'No user');
  }

  return (
    <div style={{ maxWidth: 360, margin: '40px auto', display: 'grid', gap: 8 }}>
      <input placeholder="email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input placeholder="password" type="password" value={pw} onChange={e=>setPw(e.target.value)} />
      <button onClick={signUp}>Sign up</button>
      <button onClick={signIn}>Sign in</button>
      <button onClick={whoami}>Who am I?</button>
      <pre>{msg}</pre>
    </div>
  );
}
