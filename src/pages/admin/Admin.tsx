import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Project } from '../../content';
import {
  blankProject,
  publishedOnly,
  slugify,
  today,
  usePortfolio,
  type QueueItem,
} from '../../lib/portfolio';
import { SiteSeo } from '../../components/site/SiteSeo';
import {
  ApiTab,
  ChecklistTab,
  LeadsTab,
  MediaTab,
  OverviewTab,
  ProjectEditor,
  ProjectsTab,
  QueueTab,
  type ActivityRow,
} from './adminTabs';

type Tab = 'overview' | 'projects' | 'queue' | 'leads' | 'media' | 'api' | 'settings';

/**
 * Prototype gate. The comp shipped a literal password in the source; this repo
 * is public, so the value has to come from the environment instead — and if it
 * is unset there is no password to guess, so the gate stays shut.
 *
 * This is still a client-side check: the bundle is public, so anyone can read
 * the compared value out of it. It keeps the admin out of casual reach, and
 * nothing behind it touches a server. Replacing it with a real session is on
 * the launch checklist and must land before this manages anything real.
 *
 * The optional chain is not defensive padding: scripts/prerender.tsx loads this
 * module under tsx/node, where `import.meta.env` is undefined and a plain
 * property read throws during the build.
 */
const ADMIN_PASSWORD: string = import.meta.env?.VITE_ADMIN_PASSWORD ?? '';

export function Admin() {
  const { projects, queue, saveProjects, saveQueue, resetDemo } = usePortfolio();

  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState('');
  // Held in memory only (never persisted) so the Leads tab can authenticate to
  // /api/leads, which checks it server-side.
  const [sessionPw, setSessionPw] = useState('');
  const [authError, setAuthError] = useState('');
  const [tab, setTab] = useState<Tab>('overview');
  const [editing, setEditing] = useState<Project | null>(null);
  const [toast, setToast] = useState('');

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(''), 2600);
    return () => window.clearTimeout(t);
  }, [toast]);

  const published = publishedOnly(projects);

  const activity = useMemo<ActivityRow[]>(() => {
    const rows: Array<ActivityRow & { sort: string }> = [];
    for (const q of queue) {
      rows.push({
        actor: 'Hermes',
        text: `Drafted an update for ${q.payload.title} — awaiting approval`,
        when: String(q.created ?? '').slice(0, 10),
        sort: String(q.created ?? ''),
      });
    }
    for (const p of [...projects].sort((a, b) => String(b.updated).localeCompare(String(a.updated)))) {
      rows.push({
        actor: p.source === 'hermes' ? 'Hermes' : 'Human',
        text:
          p.status === 'published'
            ? `${p.title} is live at /work/${p.slug}`
            : `${p.title} saved as ${p.status === 'in_review' ? 'in review' : 'draft'}`,
        when: p.updated,
        sort: p.updated,
      });
    }
    return rows.sort((a, b) => String(b.sort).localeCompare(String(a.sort))).slice(0, 6);
  }, [projects, queue]);

  function go(next: Tab) {
    setTab(next);
    setEditing(null);
  }

  /* ------------------------------------------------------------ actions */

  function toggleStatus(p: Project) {
    saveProjects(
      projects.map((x) =>
        x.id === p.id
          ? { ...x, status: x.status === 'published' ? ('draft' as const) : ('published' as const), updated: today() }
          : x,
      ),
    );
    setToast(p.status === 'published' ? `Unpublished ${p.title}` : `Published ${p.title} to the live site`);
  }

  function remove(p: Project) {
    if (!window.confirm(`Delete ${p.title}?`)) return;
    saveProjects(projects.filter((x) => x.id !== p.id));
    setToast(`Deleted ${p.title}`);
  }

  function save() {
    if (!editing) return;
    const draft: Project = { ...editing, updated: today() };
    if (!draft.slug) draft.slug = slugify(draft.title);
    const exists = projects.some((p) => p.id === draft.id);
    saveProjects(exists ? projects.map((p) => (p.id === draft.id ? draft : p)) : [draft, ...projects]);
    setEditing(null);
    setToast(`Saved — ${draft.title}`);
  }

  /** Merge a queued draft into the portfolio at the given status. */
  function applyQueued(q: QueueItem, status: 'published' | 'in_review') {
    const exists = projects.find((x) => x.slug === q.payload.slug);
    const next = exists
      ? projects.map((x) =>
          x.slug === q.payload.slug ? { ...x, ...q.payload, status, source: 'hermes' as const, updated: today() } : x,
        )
      : [
          {
            ...blankProject(),
            ...q.payload,
            status,
            source: 'hermes' as const,
            slug: q.payload.slug || slugify(q.payload.title),
          },
          ...projects,
        ];
    saveProjects(next);
    saveQueue(queue.filter((x) => x.id !== q.id));
    setToast(status === 'published' ? `Approved and published — ${q.payload.title}` : 'Kept as draft — not live');
  }

  function setCover(p: Project, cover: string) {
    try {
      saveProjects(projects.map((x) => (x.id === p.id ? { ...x, cover, updated: today() } : x)));
      setToast(`Cover set — ${p.title}`);
    } catch {
      setToast('Could not save that cover — storage is full.');
    }
  }

  function simulateHermes() {
    const pool = projects.length > 0 ? projects : [];
    const pick = pool[Math.floor(Math.random() * pool.length)] ?? {
      slug: 'new-system',
      title: 'New System',
      category: 'AI Workflow Automation',
      summary: '',
    };
    saveQueue([
      {
        id: `h-${Date.now()}`,
        created: new Date().toISOString(),
        source: `GitHub · delai/${pick.slug || 'repo'} · activity since last sync`,
        confidence: 0.72 + Math.random() * 0.2,
        note: 'Hermes drafted an update from approved project notes and recent repository activity. Awaiting human approval.',
        payload: {
          slug: pick.slug,
          title: pick.title,
          category: pick.category,
          summary: pick.summary || 'Draft summary generated from project notes.',
          result: 'Draft outcome paragraph generated by Hermes. Review before publishing.',
        },
      },
      ...queue,
    ]);
    setTab('queue');
    setToast('Hermes submitted a draft for review');
  }

  /* ------------------------------------------------------------- render */

  if (!authed) {
    return (
      <>
        <SiteSeo route={{ name: 'admin' }} />
        <main className="dl-admin">
          <div style={{ width: 'min(440px,calc(100% - 40px))', margin: '0 auto', padding: 'clamp(56px,10vw,120px) 0' }}>
            <div className="dl-mono dl-mono-flame">DELAI admin</div>
            <h1 style={{ margin: '16px 0 0', fontSize: '2.2rem', letterSpacing: '-.04em', fontWeight: 600, lineHeight: 1.05 }}>
              Sign in to manage the portfolio.
            </h1>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!ADMIN_PASSWORD) {
                  setAuthError('No admin password is configured for this deployment.');
                  return;
                }
                if (pw === ADMIN_PASSWORD) {
                  setAuthed(true);
                  setAuthError('');
                  setSessionPw(pw);
                  setPw('');
                  setTab('overview');
                } else {
                  setAuthError('Incorrect password.');
                }
              }}
              style={{
                marginTop: 28,
                display: 'grid',
                gap: 14,
                background: 'var(--dl-panel)',
                border: '1px solid var(--dl-line)',
                borderRadius: 6,
                padding: 26,
              }}
            >
              <div className="dl-field">
                <label htmlFor="a-pw" className="dl-label">
                  Password
                </label>
                <input
                  id="a-pw"
                  type="password"
                  autoComplete="current-password"
                  value={pw}
                  onChange={(e) => setPw(e.target.value)}
                  className="dl-input"
                />
              </div>
              {authError ? <div style={{ color: '#c2400f', fontSize: 14.5 }}>{authError}</div> : null}
              <button type="submit" className="dl-btn dl-btn-primary" style={{ justifyContent: 'center', padding: '15px 22px' }}>
                Sign in
              </button>
              <p style={{ margin: 0, fontSize: 13, color: 'var(--dl-faint)', lineHeight: 1.5 }}>
                Authorized DELAI staff only.
              </p>
            </form>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <SiteSeo route={{ name: 'admin' }} />
      <main className="dl-admin">
        <div className="dl-wrap" style={{ padding: '36px 0 clamp(56px,7vw,96px)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
            <div>
              <div className="dl-mono dl-mono-flame">DELAI admin</div>
              <h1 style={{ margin: '10px 0 0', fontSize: '2rem', letterSpacing: '-.04em', fontWeight: 600 }}>Portfolio</h1>
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button type="button" onClick={simulateHermes} className="dl-admin-btn dl-admin-btn-outline">
                Simulate a Hermes draft
              </button>
              <button
                type="button"
                onClick={() => {
                  resetDemo();
                  setToast('Demo content reset');
                }}
                className="dl-admin-btn"
              >
                Reset demo data
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthed(false);
                  setSessionPw('');
                  setTab('overview');
                  setEditing(null);
                }}
                className="dl-admin-btn"
              >
                Sign out
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'clamp(20px,3vw,34px)', marginTop: 30, alignItems: 'flex-start' }}>
            <aside style={{ flex: '1 1 210px', maxWidth: 280, display: 'grid', gap: 22 }}>
              <nav style={{ display: 'grid', gap: 3 }}>
                <NavBtn active={tab === 'overview'} onClick={() => go('overview')} label="Overview" />
                <NavBtn active={tab === 'projects'} onClick={() => go('projects')} label="Projects" count={projects.length} />
                <NavBtn active={tab === 'queue'} onClick={() => go('queue')} label="Review queue" count={queue.length} />
                <NavBtn active={tab === 'leads'} onClick={() => go('leads')} label="Leads" />
                <NavBtn active={tab === 'media'} onClick={() => go('media')} label="Media" />
                <NavBtn active={tab === 'api'} onClick={() => go('api')} label="Hermes integration" />
                <NavBtn active={tab === 'settings'} onClick={() => go('settings')} label="Launch checklist" />
              </nav>
              <div className="dl-admin-box">
                <div className="dl-mono-sm">Live site</div>
                <Link to="/work" style={{ display: 'block', marginTop: 8, fontWeight: 600, fontSize: 15 }}>
                  View portfolio ↗
                </Link>
                <div style={{ marginTop: 12, fontSize: 13.5, color: 'var(--dl-faint)', lineHeight: 1.45 }}>
                  {published.length} of {projects.length} projects are visible to the public.
                </div>
              </div>
            </aside>

            <div style={{ flex: '999 1 420px', minWidth: 0 }}>
              {tab === 'overview' && (
                <OverviewTab
                  publishedCount={published.length}
                  draftCount={projects.length - published.length}
                  queueCount={queue.length}
                  activity={activity}
                  onGoQueue={() => go('queue')}
                />
              )}

              {tab === 'projects' && (
                <>
                  {editing && (
                    <ProjectEditor
                      draft={editing}
                      isNew={!projects.some((p) => p.id === editing.id)}
                      onChange={(patch) => setEditing((cur) => (cur ? { ...cur, ...patch } : cur))}
                      onSave={save}
                      onCancel={() => setEditing(null)}
                    />
                  )}
                  <ProjectsTab
                    projects={projects}
                    onNew={() => setEditing(blankProject())}
                    onEdit={(p) => setEditing({ ...p })}
                    onToggle={toggleStatus}
                    onDelete={remove}
                  />
                </>
              )}

              {tab === 'queue' && (
                <QueueTab
                  queue={queue}
                  onApprove={(q) => applyQueued(q, 'published')}
                  onSaveDraft={(q) => applyQueued(q, 'in_review')}
                  onReject={(q) => {
                    saveQueue(queue.filter((x) => x.id !== q.id));
                    setToast('Rejected');
                  }}
                />
              )}

              {tab === 'media' && (
                <MediaTab
                  projects={projects}
                  onSetCover={setCover}
                  onClearCover={(p) => {
                    saveProjects(projects.map((x) => (x.id === p.id ? { ...x, cover: '', updated: today() } : x)));
                    setToast(`Cover cleared — ${p.title}`);
                  }}
                  onError={(m) => setToast(m)}
                />
              )}

              {tab === 'leads' && <LeadsTab password={sessionPw} />}

              {tab === 'api' && <ApiTab />}
              {tab === 'settings' && <ChecklistTab />}
            </div>
          </div>

          {toast ? <div className="dl-toast">{toast}</div> : null}
        </div>
      </main>
    </>
  );
}

function NavBtn({
  active,
  onClick,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count?: number;
}) {
  return (
    <button type="button" onClick={onClick} className="dl-admin-nav-btn" aria-current={active}>
      {label}
      {count !== undefined ? (
        <span className="dl-mono dl-mono-plain" style={{ fontSize: 11, opacity: .6 }}>
          {count}
        </span>
      ) : null}
    </button>
  );
}
