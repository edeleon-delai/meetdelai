/**
 * GET /api/leads — read side for the admin's Leads tab.
 *
 * `GET /delai/leads` on the DELAI API requires the admin secret. That secret
 * cannot live in the browser bundle, which is public, so this function holds it
 * and proxies the call.
 *
 * The proxy itself is gated on ADMIN_PASSWORD, sent as x-admin-password. Note
 * what that buys: unlike the sign-in screen — which compares a value compiled
 * into the public bundle and is therefore obscurity only — this check happens
 * on the server against an env var that never ships to the client. Leads are
 * the first thing in the admin with a real access boundary. If ADMIN_PASSWORD
 * is unset the endpoint refuses everything rather than defaulting open.
 */
import type { IncomingMessage, ServerResponse } from 'node:http';

type Req = IncomingMessage & { method?: string; headers: Record<string, string | string[] | undefined> };

const API_BASE = process.env.VITE_API_URL || 'https://api.thefoundai.app';
const ADMIN_SECRET = process.env.DELAI_ADMIN_SECRET || '';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';

export default async function handler(req: Req, res: ServerResponse) {
  if (req.method !== 'GET') return send(res, 405, { error: 'Method not allowed' });

  if (!ADMIN_PASSWORD || !ADMIN_SECRET) {
    return send(res, 503, {
      error: 'Leads are not configured for this deployment. Set ADMIN_PASSWORD and DELAI_ADMIN_SECRET.',
    });
  }

  const supplied = header(req, 'x-admin-password');
  if (!supplied || !timingSafeEqual(supplied, ADMIN_PASSWORD)) {
    return send(res, 401, { error: 'Unauthorized' });
  }

  const upstream = await fetch(`${API_BASE}/delai/leads`, {
    headers: { 'x-admin-secret': ADMIN_SECRET },
  }).catch(() => null);

  if (!upstream) return send(res, 502, { error: 'Could not reach the DELAI API.' });
  if (!upstream.status || upstream.status >= 400) {
    const detail = await upstream.text().catch(() => '');
    console.error('[api/leads] upstream', upstream.status, detail);
    // Don't leak upstream auth detail to the client.
    return send(res, upstream.status === 401 ? 502 : upstream.status, {
      error: upstream.status === 401 ? 'DELAI_ADMIN_SECRET is not accepted by the API.' : 'Upstream error.',
    });
  }

  const data = await upstream.json().catch(() => null);
  return send(res, 200, data ?? { leads: [] });
}

function header(req: Req, name: string): string {
  const v = req.headers[name];
  return Array.isArray(v) ? (v[0] ?? '') : (v ?? '');
}

/** Constant-time compare so the endpoint can't be probed a character at a time. */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function send(res: ServerResponse, status: number, body: unknown) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(body));
}
