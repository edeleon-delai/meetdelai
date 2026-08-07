/**
 * POST /api/lead — the "Find Your First Automation" form handler.
 *
 * Does two things the browser cannot do on its own:
 *   1. stores the lead on the DELAI API (`POST /delai/leads`), which is what
 *      the admin's Leads tab and the admin MCP's `list_leads` both read;
 *   2. emails the notification address, so a lead is not something you have to
 *      remember to go and look for.
 *
 * Storage is the part that must not fail. If the email provider is unset or
 * errors, the lead is still saved and the response is still a success — losing
 * a lead because a mail API had a bad minute would be the worse outcome. The
 * `emailed` flag in the response says which happened.
 */
import type { IncomingMessage, ServerResponse } from 'node:http';

type Req = IncomingMessage & { method?: string; body?: unknown };

const API_BASE = process.env.VITE_API_URL || 'https://api.thefoundai.app';
const NOTIFY_TO = process.env.LEAD_NOTIFY_EMAIL || 'edeleon@meetdelai.com';
/**
 * MUST be on a domain verified with Resend, or every send 403s.
 *
 * `meetdelai.com` is NOT verified on the DELAI Resend account — verified
 * sending domains are thefoundai.app, longestash.com, mycloudmenu.com,
 * myfluxe.com, mymcm.app and simplelenses.com. Defaulting to a meetdelai.com
 * sender looks obviously right and fails 100% of the time, so the default is
 * the verified DELAI domain instead.
 *
 * This address only ever appears on an internal notification to the team, and
 * reply_to is set to the lead's own address, so replying still works. Change
 * this default only after verifying the domain at https://resend.com/domains.
 */
const NOTIFY_FROM = process.env.LEAD_FROM_EMAIL || 'DELAI <leads@thefoundai.app>';
const RESEND_KEY = process.env.RESEND_API_KEY || '';

interface LeadBody {
  contact_name?: string;
  email?: string;
  business_name?: string;
  goal?: string;
  where?: string;
  source?: string;
  referrer?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  /** Honeypot — a real person never fills this in. */
  company_website?: string;
}

export default async function handler(req: Req, res: ServerResponse) {
  if (req.method !== 'POST') {
    return send(res, 405, { error: 'Method not allowed' });
  }

  let body: LeadBody;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : ((req.body ?? {}) as LeadBody);
  } catch {
    return send(res, 400, { error: 'Invalid JSON' });
  }

  // Bots fill every field they can see. Accept-and-drop rather than reject, so
  // a scraper gets no signal about why it failed.
  if (body.company_website) return send(res, 201, { ok: true, emailed: false });

  const contact_name = String(body.contact_name ?? '').trim();
  const email = String(body.email ?? '').trim();
  if (!contact_name || !email) {
    return send(res, 400, { error: 'contact_name + email required' });
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return send(res, 400, { error: 'That email address does not look valid.' });
  }

  const where = String(body.where ?? '').trim();
  const process_ = String(body.goal ?? '').trim();
  // The DELAI lead schema has no "where" column, so it rides along in the goal
  // text rather than being dropped on the floor.
  const goal = where ? `[${where}]\n\n${process_}` : process_;

  const stored = await fetch(`${API_BASE}/delai/leads`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contact_name,
      email,
      business_name: body.business_name || undefined,
      goal,
      source: body.source || 'find-your-first-automation',
      referrer: body.referrer || undefined,
      utm_source: body.utm_source || undefined,
      utm_medium: body.utm_medium || undefined,
      utm_campaign: body.utm_campaign || undefined,
      utm_term: body.utm_term || undefined,
    }),
  }).catch(() => null);

  if (!stored || !stored.ok) {
    const detail = stored ? await stored.text().catch(() => '') : 'network error';
    console.error('[api/lead] store failed', stored?.status, detail);
    return send(res, 502, { error: 'Could not save that. Email hello@meetdelai.com directly.' });
  }

  const emailed = await notify({ contact_name, email, business_name: body.business_name, where, process: process_ });
  return send(res, 201, { ok: true, emailed });
}

async function notify(lead: {
  contact_name: string;
  email: string;
  business_name?: string;
  where: string;
  process: string;
}): Promise<boolean> {
  if (!RESEND_KEY) return false;
  try {
    const rows: Array<[string, string]> = [
      ['Name', lead.contact_name],
      ['Email', lead.email],
      ['Company', lead.business_name || '—'],
      ['Where', lead.where || '—'],
    ];
    const html = `<div style="font:15px/1.5 -apple-system,system-ui,sans-serif;color:#101210">
<p style="font:600 11px/1 ui-monospace,monospace;letter-spacing:.14em;text-transform:uppercase;color:#ff5227;margin:0 0 14px">New lead · Find Your First Automation</p>
<table cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:0 0 18px">
${rows.map(([k, v]) => `<tr><td style="padding:5px 18px 5px 0;color:#7a7d74">${esc(k)}</td><td style="padding:5px 0;font-weight:600">${esc(v)}</td></tr>`).join('')}
</table>
<p style="margin:0 0 6px;color:#7a7d74">The process they'd automate first</p>
<p style="margin:0;white-space:pre-wrap;border-left:2px solid #ff5227;padding-left:14px">${esc(lead.process)}</p>
</div>`;

    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${RESEND_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: NOTIFY_FROM,
        to: [NOTIFY_TO],
        reply_to: lead.email,
        subject: `New lead — ${lead.business_name || lead.contact_name}`,
        html,
      }),
    });
    if (!r.ok) {
      console.error('[api/lead] resend failed', r.status, await r.text().catch(() => ''));
      return false;
    }
    return true;
  } catch (err) {
    console.error('[api/lead] resend threw', err);
    return false;
  }
}

function esc(s: string): string {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function send(res: ServerResponse, status: number, body: unknown) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(body));
}
