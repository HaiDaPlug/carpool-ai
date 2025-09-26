import { Outlet, Link } from 'react-router-dom';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-white">
      <header className="sticky top-0 z-10 border-b border-white/10">
        <nav className="mx-auto flex max-w-5xl items-center justify-between p-4">
          <Link to="/" className="font-semibold">Carpool AI</Link>
          <div className="flex items-center gap-4 text-sm">
            <Link to="/chat" className="opacity-90 hover:opacity-100">Chat</Link>
            <Link to="/account" className="opacity-90 hover:opacity-100">Account</Link>
          </div>
        </nav>
      </header>
      <main className="mx-auto max-w-5xl p-4">
        <Outlet />
      </main>
    </div>
  );
}
