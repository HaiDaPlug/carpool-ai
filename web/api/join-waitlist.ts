import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

export const config = { runtime: 'nodejs' };

// ---- Supabase (server-side only: uses SERVICE ROLE) ----
const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE as string,
  { auth: { persistSession: false, autoRefreshToken: false } }
);

// ---- Utils ----
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

function setCors(res: VercelResponse, origin?: string) {
  const allowedRaw = process.env.ALLOWED_ORIGIN ?? '';
  const allowList = allowedRaw
    .split(',')
    .map(s => s.trim().toLowerCase())
    .filter(Boolean);

  let allow = '';
  if (origin) {
    const o = origin.toLowerCase();
    // 1) exact match (localhost, your domain(s))
    if (allowList.includes(o)) allow = origin;
    // 2) always allow Vercel preview domains
    else if (o.endsWith('.vercel.app')) allow = origin;
  }
  if (allow) res.setHeader('Access-Control-Allow-Origin', allow);
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res, req.headers.origin as string | undefined);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body ?? {});
    const { email, source, trap } = body as {
      email?: string;
      source?: string;
      trap?: string;
    };

    // Honeypot (silently accept bots)
    if (trap && String(trap).trim() !== '') {
      return res.status(200).json({ ok: true });
    }

    if (!email || !EMAIL_REGEX.test(String(email))) {
      return res.status(400).json({ error: 'Invalid email' });
    }

    const normalized = String(email).trim().toLowerCase();

    const { error } = await supabase
      .from('waitlist_emails')
      .insert({
        email: normalized,
        source: (source ?? '').slice(0, 64),
        ip: (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ?? null,
        ua: req.headers['user-agent'] ?? null
      })
      .select()
      .single();

    // Gracefully ignore duplicates
    if (error && !String(error.message).toLowerCase().includes('duplicate')) {
      console.error('DB insert error:', error);
      return res.status(500).json({ error: 'Database error' });
    }

    return res.status(201).json({ ok: true });
  } catch (e: any) {
    console.error('Server error:', e?.message || e);
    return res.status(500).json({ error: 'Server error' });
  }
}
