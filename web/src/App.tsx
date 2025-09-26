import { Route, Routes, Link } from 'react-router-dom';
import Landing from '@/pages/Landing';
import Chat from '@/pages/Chat';
import Account from '@/pages/Account';

export default function App() {
  return (
    <div className="min-h-dvh bg-black text-white">
      <header className="sticky top-0 z-10 border-b border-white/10 backdrop-blur">
        <nav className="mx-auto flex max-w-5xl items-center gap-4 px-4 py-3 text-sm">
          <Link to="/" className="font-semibold">Carpool AI</Link>
          <div className="ml-auto flex items-center gap-3">
            <Link to="/chat">Chat</Link>
            <Link to="/account">Account</Link>
          </div>
        </nav>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/account" element={<Account />} />
        </Routes>
      </main>
    </div>
  );
}
