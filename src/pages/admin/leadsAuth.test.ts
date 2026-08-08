/**
 * The invariant under test: the leads password is a server-side secret and is
 * never the one compiled into the public bundle.
 *
 * The bug this locks down — the sign-in screen stashed whatever you typed and
 * reused it as the leads password, which forced ADMIN_PASSWORD to equal
 * VITE_ADMIN_PASSWORD. That value ships to every visitor inside the JS bundle,
 * so matching them would have let anyone extract it and read the lead table.
 */
import { describe, expect, it, vi } from 'vitest';
import { loadLeads } from './leadsAuth';

function response(status: number, body: unknown, json = true): Response {
  return {
    status,
    ok: status >= 200 && status < 300,
    json: async () => {
      if (!json) throw new Error('not json');
      return body;
    },
  } as unknown as Response;
}

describe('loadLeads', () => {
  it('returns the leads on success', async () => {
    const fetchImpl = vi.fn(async () => response(200, { leads: [{ id: '1', contact_name: 'Ada' }] }));
    const r = await loadLeads('server-side-secret', fetchImpl);

    expect(r).toEqual({ ok: true, leads: [{ id: '1', contact_name: 'Ada' }] });
    expect(fetchImpl).toHaveBeenCalledWith('/api/leads', {
      headers: { 'x-admin-password': 'server-side-secret' },
    });
  });

  it('treats a 401 as a password problem the user can retry', async () => {
    const fetchImpl = vi.fn(async () => response(401, { error: 'Unauthorized' }));
    const r = await loadLeads('wrong', fetchImpl);

    expect(r.ok).toBe(false);
    expect(r).toMatchObject({ unauthorized: true });
  });

  it('does not call the API at all without a password', async () => {
    const fetchImpl = vi.fn(async () => response(200, { leads: [] }));
    const r = await loadLeads('', fetchImpl);

    // ADMIN_PASSWORD unset makes the function 503 for everyone; firing anyway
    // would misreport a deployment problem as a bad password.
    expect(fetchImpl).not.toHaveBeenCalled();
    expect(r).toMatchObject({ ok: false, unauthorized: true });
  });

  it('refuses a 200 that is not lead JSON rather than claiming zero leads', async () => {
    // `vite dev` serves no functions: the SPA fallback answers 200 with HTML.
    const fetchImpl = vi.fn(async () => response(200, null, false));
    const r = await loadLeads('server-side-secret', fetchImpl);

    expect(r).toMatchObject({ ok: false, unauthorized: false });
    expect(r.ok === false && r.error).toMatch(/did not return lead data/);
  });

  it('surfaces a 503 as a deployment problem, not a password problem', async () => {
    const fetchImpl = vi.fn(async () =>
      response(503, { error: 'Leads are not configured for this deployment.' }),
    );
    const r = await loadLeads('server-side-secret', fetchImpl);

    expect(r).toMatchObject({ ok: false, unauthorized: false });
  });

  it('reports an unreachable endpoint instead of throwing', async () => {
    const fetchImpl = vi.fn(async () => {
      throw new Error('network down');
    });
    const r = await loadLeads('server-side-secret', fetchImpl);

    expect(r).toMatchObject({ ok: false, unauthorized: false });
  });
});

describe('the sign-in password never reaches the network', () => {
  it('LeadsTab takes no password prop, so Admin cannot pass the bundled one in', async () => {
    const [tabs, admin] = await Promise.all([
      import('node:fs/promises').then((fs) => fs.readFile(new URL('./adminTabs.tsx', import.meta.url), 'utf8')),
      import('node:fs/promises').then((fs) => fs.readFile(new URL('./Admin.tsx', import.meta.url), 'utf8')),
    ]);

    expect(tabs).toContain('export function LeadsTab()');
    expect(admin).toContain('<LeadsTab />');
    // The parent must not hold the typed password after sign-in.
    expect(admin).not.toContain('sessionPw');
  });
});
