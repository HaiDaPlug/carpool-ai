import { Routes, Route, Link } from 'react-router-dom';
import Waitlist from './pages/Waitlist';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-white">
      <header className="sticky top-0 z-10 border-b border-white/10">
        <nav className="mx-auto flex max-w-5xl items-center justify-between p-4">
          <Link to="/" className="font-semibold">Carpool AI</Link>
          {/* Nav links hidden until launch */}
        </nav>
      </header>
      <main className="mx-auto max-w-5xl p-4">
        <Routes>
          {/* Waitlist is the only available page */}
          <Route path="/" element={<Waitlist />} />
          <Route path="/waitlist" element={<Waitlist />} />
          <Route path="*" element={<Waitlist />} />
          {/* All other routes temporarily removed */}
        </Routes>
      </main>
    </div>
  );
}
