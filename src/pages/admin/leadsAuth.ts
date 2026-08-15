/**
 * The read path for /api/leads, kept out of the component so it can be tested
 * without a DOM.
 *
 * Why this module exists at all: the admin has two passwords doing two
 * different jobs, and an earlier version conflated them.
 *
 *   VITE_ADMIN_PASSWORD  client-side, compiled into a PUBLIC bundle. Hides the
 *                        /admin UI from a casual visitor. Not a secret — it can
 *                        be read out of the deployed JS in seconds.
 *   ADMIN_PASSWORD       server-side only, checked by api/leads.ts. The only
 *                        thing standing between the open internet and the lead
 *                        table, which holds names, emails and business detail.
 *
 * The sign-in screen used to stash whatever you typed and reuse it as the
 * leads password, which forced the two env vars to hold the same value. That
 * made the server-side secret equal to a string published in the bundle:
 * anyone could extract it and curl the leads. So the leads password is
 * collected here, separately, and the sign-in password never reaches the
 * network. `ADMIN_PASSWORD` must NOT equal `VITE_ADMIN_PASSWORD`.
 *
 * This is still a shared password, not real auth — replacing it with a real
 * server-side session is on the admin's Launch checklist.
 */
import type { Lead } from './adminTabs';

export type LeadsResult =
  | { ok: true; leads: Lead[] }
  | { ok: false; unauthorized: boolean; error: string };

type FetchLike = (input: string, init?: { headers?: Record<string, string> }) => Promise<Response>;

/**
 * Never sends an empty password: with ADMIN_PASSWORD unset the function answers
 * 503 for everyone, and firing the request anyway would report that as a
 * password problem.
 */
export async function loadLeads(password: string, fetchImpl: FetchLike): Promise<LeadsResult> {
  if (!password) {
    return { ok: false, unauthorized: true, error: 'Enter the leads password.' };
  }

  let res: Response;
  try {
    res = await fetchImpl('/api/leads', { headers: { 'x-admin-password': password } });
  } catch {
    return { ok: false, unauthorized: false, error: 'Could not reach /api/leads.' };
  }

  const data = (await res.json().catch(() => null)) as { leads?: Lead[]; error?: string } | null;

  if (res.status === 401) {
    return {
      ok: false,
      unauthorized: true,
      error: 'That password was rejected. It is ADMIN_PASSWORD on the deployment, not the sign-in password.',
    };
  }

  if (!res.ok) {
    return { ok: false, unauthorized: false, error: data?.error || `Request failed (${res.status})` };
  }

  // A 200 that isn't the expected JSON means the function did not answer — under
  // `vite dev` the SPA fallback returns index.html with status 200. Falling
  // through to `[]` there would render "No leads yet" over a request that never
  // reached the API, which is the worst outcome: a silent lie about an empty
  // pipeline.
  if (!data || !Array.isArray(data.leads)) {
    return {
      ok: false,
      unauthorized: false,
      error: '/api/leads did not return lead data. Is the function deployed?',
    };
  }

  return { ok: true, leads: data.leads };
}
