/**
 * Tab bodies for /admin. Presentational, with one exception: LeadsTab owns its
 * own fetch, because leads are the only thing here that lives on a server.
 */
import { useEffect, useRef, useState } from 'react';
import type { Project, ProjectStatus } from '../../content';
import type { QueueItem } from '../../lib/portfolio';
import { fileToCoverDataUrl } from '../../lib/image';

/* ------------------------------------------------------------- overview */

export interface ActivityRow {
  actor: 'Hermes' | 'Human';
  text: string;
  when: string;
}

export function OverviewTab({
  publishedCount,
  draftCount,
  queueCount,
  activity,
  onGoQueue,
}: {
  publishedCount: number;
  draftCount: number;
  queueCount: number;
  activity: ActivityRow[];
  onGoQueue: () => void;
}) {
  return (
    <>
      <div className="dl-tiles dl-tiles-150">
        <Stat label="Live" value={publishedCount} note="published projects" />
        <Stat label="Drafts" value={draftCount} note="not visible publicly" />
        <Stat label="Needs you" value={queueCount} note="Hermes drafts awaiting approval" alarm />
        <div className="dl-admin-card">
          <div className="dl-mono-sm">Agent</div>
          <div
            style={{
              marginTop: 10,
              fontSize: '1.05rem',
              fontWeight: 600,
              letterSpacing: '-.02em',
              lineHeight: 1.2,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <span className="dl-dot" style={{ width: 8, height: 8, background: '#3fa34d' }} />
            Hermes connected
          </div>
          <div style={{ marginTop: 6, fontSize: 13.5, color: 'var(--dl-faint)' }}>scope: draft:write</div>
        </div>
      </div>

      {queueCount > 0 && (
        <div
          className="dl-notice"
          style={{
            marginTop: 22,
            padding: '22px 24px',
            display: 'flex',
            justifyContent: 'space-between',
            gap: 18,
            flexWrap: 'wrap',
            alignItems: 'center',
          }}
        >
          <div>
            <div style={{ fontWeight: 600, fontSize: 17 }}>
              {queueCount} draft{queueCount === 1 ? '' : 's'} waiting on a human
            </div>
            <div style={{ marginTop: 5, fontSize: 14.5, color: '#8a5238', lineHeight: 1.45 }}>
              Hermes cannot publish. Nothing reaches the live site until you approve it.
            </div>
          </div>
          <button type="button" onClick={onGoQueue} className="dl-btn dl-btn-primary" style={{ padding: '13px 20px', fontSize: 14.5 }}>
            Review now →
          </button>
        </div>
      )}

      <div
        style={{ marginTop: 26, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 16, flexWrap: 'wrap' }}
      >
        <h2 style={{ margin: 0, fontSize: '1.2rem', letterSpacing: '-.03em', fontWeight: 600 }}>Recent activity</h2>
        <span className="dl-mono" style={{ fontSize: 11, letterSpacing: '.1em' }}>
          Newest first
        </span>
      </div>
      <div style={{ marginTop: 14, display: 'grid', gap: 1 }}>
        {activity.map((a, i) => (
          <div
            key={`${a.text}-${i}`}
            className="dl-admin-card"
            style={{
              padding: '16px 20px',
              display: 'flex',
              justifyContent: 'space-between',
              gap: 16,
              flexWrap: 'wrap',
              alignItems: 'center',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span className="dl-badge" style={{ border: '1px solid var(--dl-line)', color: 'var(--dl-faint)' }}>
                {a.actor}
              </span>
              <span style={{ fontSize: 15.5 }}>{a.text}</span>
            </div>
            <span className="dl-mono dl-mono-plain" style={{ fontSize: 11.5 }}>
              {a.when}
            </span>
          </div>
        ))}
      </div>
    </>
  );
}

function Stat({ label, value, note, alarm = false }: { label: string; value: number; note: string; alarm?: boolean }) {
  return (
    <div className="dl-admin-card">
      <div className="dl-mono-sm" style={alarm ? { color: '#c2400f' } : undefined}>
        {label}
      </div>
      <div
        style={{
          marginTop: 10,
          fontSize: '2.2rem',
          fontWeight: 600,
          letterSpacing: '-.04em',
          lineHeight: 1,
          color: alarm ? '#c2400f' : undefined,
        }}
      >
        {value}
      </div>
      <div style={{ fontSize: 13.5, color: 'var(--dl-faint)' }}>{note}</div>
    </div>
  );
}

/* ------------------------------------------------------------- projects */

const STATUS_STYLE: Record<ProjectStatus, { label: string; bg: string; fg: string }> = {
  published: { label: 'Published', bg: '#dff3dc', fg: '#1e5b29' },
  in_review: { label: 'In review', bg: '#ffe7ce', fg: '#8a4b10' },
  draft: { label: 'Draft', bg: '#e7e4db', fg: '#5a5d54' },
};

export function ProjectsTab({
  projects,
  onNew,
  onEdit,
  onToggle,
  onDelete,
}: {
  projects: Project[];
  onNew: () => void;
  onEdit: (p: Project) => void;
  onToggle: (p: Project) => void;
  onDelete: (p: Project) => void;
}) {
  return (
    <>
      <div
        style={{ marginTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}
      >
        <p className="dl-measure-60" style={{ margin: 0, fontSize: 15, color: 'var(--dl-muted)' }}>
          Only projects with status <strong>Published</strong> appear on the public site. Drafts and items in review stay
          here.
        </p>
        <button type="button" onClick={onNew} className="dl-btn dl-btn-dark" style={{ padding: '12px 18px', fontSize: 14.5 }}>
          + New project
        </button>
      </div>

      <div className="dl-stack" style={{ marginTop: 18 }}>
        {projects.map((p) => {
          const s = STATUS_STYLE[p.status];
          return (
            <div
              key={p.id}
              style={{
                background: 'var(--dl-panel)',
                padding: '20px 22px',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit,minmax(min(240px,100%),1fr))',
                gap: 16,
                alignItems: 'center',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 600, fontSize: 17 }}>{p.title}</span>
                  <span className="dl-badge" style={{ background: s.bg, color: s.fg }}>
                    {s.label}
                  </span>
                  <span className="dl-badge" style={{ border: '1px solid var(--dl-line)', color: 'var(--dl-faint)' }}>
                    {p.source === 'hermes' ? 'Hermes' : 'Human'}
                  </span>
                </div>
                <div className="dl-mono dl-mono-plain" style={{ marginTop: 6, fontSize: 11.5 }}>
                  /work/{p.slug} · {p.category} · updated {p.updated}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                <button type="button" className="dl-row-btn" onClick={() => onEdit(p)}>
                  Edit
                </button>
                <button type="button" className="dl-row-btn dl-row-btn-solid" onClick={() => onToggle(p)}>
                  {p.status === 'published' ? 'Unpublish' : 'Publish'}
                </button>
                <button type="button" className="dl-row-btn dl-row-btn-danger" onClick={() => onDelete(p)}>
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

const CATEGORIES = [
  'AI Workflow Automation',
  'Business Process Automation',
  'AI Systems & Frameworks',
  'Internal AI Tool',
  'Customer-Facing AI Application',
  'Connected Operational Systems',
  'AI Application',
  'Digital Product',
];

export function ProjectEditor({
  draft,
  isNew,
  onChange,
  onSave,
  onCancel,
}: {
  draft: Project;
  isNew: boolean;
  onChange: (patch: Partial<Project>) => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave();
      }}
      style={{
        marginTop: 28,
        background: 'var(--dl-panel)',
        border: '1px solid var(--dl-line)',
        borderRadius: 6,
        padding: 'clamp(22px,3vw,32px)',
        display: 'grid',
        gap: 18,
      }}
    >
      <h2 style={{ margin: 0, fontSize: '1.4rem', letterSpacing: '-.03em', fontWeight: 600 }}>
        {isNew ? 'New project' : 'Edit project'}
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(220px,100%),1fr))', gap: 16 }}>
        <Text label="Title" value={draft.title} onChange={(v) => onChange({ title: v })} required />
        <Text label="URL slug" value={draft.slug} onChange={(v) => onChange({ slug: v })} placeholder="auto from title" />
        <Text label="Client" value={draft.client} onChange={(v) => onChange({ client: v })} />
        <Text label="Year" value={draft.year} onChange={(v) => onChange({ year: v })} />
        <Select label="Category" value={draft.category} onChange={(v) => onChange({ category: v })} options={CATEGORIES} />
        <Select
          label="Status"
          value={draft.status}
          onChange={(v) => onChange({ status: v as ProjectStatus })}
          options={[
            { value: 'draft', label: 'Draft' },
            { value: 'in_review', label: 'In review' },
            { value: 'published', label: 'Published (live)' },
          ]}
        />
        <Text label="External link" value={draft.link} onChange={(v) => onChange({ link: v })} placeholder="https://" />
        <Text label="Tags (comma separated)" value={draft.tags} onChange={(v) => onChange({ tags: v })} />
        <Text
          label="Cover image URL"
          value={draft.cover}
          onChange={(v) => onChange({ cover: v })}
          placeholder="Set from the Media tab, or paste a URL"
        />
      </div>

      <Area
        label="Summary (one or two sentences — used on cards and in metadata)"
        rows={2}
        value={draft.summary}
        onChange={(v) => onChange({ summary: v })}
      />
      <Area label="The problem" rows={4} value={draft.challenge} onChange={(v) => onChange({ challenge: v })} />
      <Area
        label="What we built (one bullet per line)"
        rows={4}
        value={draft.approach}
        onChange={(v) => onChange({ approach: v })}
      />
      <Area label="The outcome" rows={4} value={draft.result} onChange={(v) => onChange({ result: v })} />

      <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 15, fontWeight: 500 }}>
        <input
          type="checkbox"
          checked={draft.featured}
          onChange={(e) => onChange({ featured: e.target.checked })}
          style={{ width: 17, height: 17 }}
        />
        Feature on the homepage
      </label>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <button type="submit" className="dl-btn dl-btn-primary" style={{ padding: '14px 22px', fontSize: 15 }}>
          Save project
        </button>
        <button type="button" onClick={onCancel} className="dl-row-btn" style={{ padding: '14px 22px', fontSize: 15 }}>
          Cancel
        </button>
      </div>
    </form>
  );
}

function Text({
  label,
  value,
  onChange,
  placeholder,
  required = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div className="dl-field">
      <span className="dl-label">{label}</span>
      <input
        className="dl-input dl-input-sm"
        value={value}
        placeholder={placeholder}
        required={required}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function Area({
  label,
  value,
  rows,
  onChange,
}: {
  label: string;
  value: string;
  rows: number;
  onChange: (v: string) => void;
}) {
  return (
    <div className="dl-field">
      <span className="dl-label">{label}</span>
      <textarea
        className="dl-input dl-input-sm dl-textarea"
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: Array<string | { value: string; label: string }>;
}) {
  return (
    <div className="dl-field">
      <span className="dl-label">{label}</span>
      <select className="dl-input dl-input-sm" value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => {
          const v = typeof o === 'string' ? o : o.value;
          const l = typeof o === 'string' ? o : o.label;
          return (
            <option key={v} value={v}>
              {l}
            </option>
          );
        })}
      </select>
    </div>
  );
}

/* ---------------------------------------------------------------- queue */

export function QueueTab({
  queue,
  onApprove,
  onSaveDraft,
  onReject,
}: {
  queue: QueueItem[];
  onApprove: (q: QueueItem) => void;
  onSaveDraft: (q: QueueItem) => void;
  onReject: (q: QueueItem) => void;
}) {
  return (
    <div style={{ marginTop: 26 }}>
      <p className="dl-measure-70" style={{ margin: '0 0 18px', fontSize: 15, color: 'var(--dl-muted)' }}>
        Drafts submitted by <strong>Hermes</strong> from approved project notes and repository activity. Hermes can
        create and update drafts; it cannot publish. Nothing here is on the live site until a person approves it.
      </p>

      {queue.length === 0 && (
        <div
          style={{
            border: '1px dashed #c9c4b7',
            borderRadius: 4,
            padding: 44,
            textAlign: 'center',
            color: 'var(--dl-faint)',
            fontSize: 15.5,
          }}
        >
          Queue is empty. Nothing waiting for review.
        </div>
      )}

      <div style={{ display: 'grid', gap: 16 }}>
        {queue.map((q) => (
          <div
            key={q.id}
            style={{ background: 'var(--dl-panel)', border: '1px solid var(--dl-line)', borderRadius: 6, padding: 24 }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
              <span
                className="dl-badge"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: 10.5,
                  letterSpacing: '.12em',
                  color: '#8a4b10',
                  background: '#ffe7ce',
                  padding: '5px 9px',
                }}
              >
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#e08a2c', display: 'block' }} />
                Awaiting human approval
              </span>
              <span className="dl-mono dl-mono-plain" style={{ fontSize: 11.5 }}>
                {Math.round((q.confidence || 0) * 100)}% confidence
              </span>
            </div>

            <h3 style={{ margin: '18px 0 0', fontSize: '1.35rem', letterSpacing: '-.03em', fontWeight: 600 }}>
              {q.payload.title}
            </h3>
            <div className="dl-mono dl-mono-plain" style={{ marginTop: 6, fontSize: 11.5 }}>
              Source: {q.source}
            </div>
            <p className="dl-body-m" style={{ margin: '16px 0 0' }}>
              {q.note}
            </p>

            <div style={{ marginTop: 18, borderLeft: '2px solid var(--dl-flame)', paddingLeft: 16, display: 'grid', gap: 10 }}>
              <div>
                <div className="dl-mono-sm">Proposed summary</div>
                <p style={{ margin: '6px 0 0', fontSize: 16, lineHeight: 1.5 }}>{q.payload.summary}</p>
              </div>
              <div>
                <div className="dl-mono-sm">Proposed outcome</div>
                <p style={{ margin: '6px 0 0', fontSize: 16, lineHeight: 1.5 }}>{q.payload.result}</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 22 }}>
              <button
                type="button"
                onClick={() => onApprove(q)}
                className="dl-btn dl-btn-primary"
                style={{ padding: '13px 20px', fontSize: 14.5 }}
              >
                Approve &amp; publish
              </button>
              <button
                type="button"
                onClick={() => onSaveDraft(q)}
                className="dl-admin-btn dl-admin-btn-outline"
                style={{ padding: '12px 19px', fontSize: 14.5 }}
              >
                Keep as draft
              </button>
              <button
                type="button"
                onClick={() => onReject(q)}
                className="dl-row-btn dl-row-btn-danger"
                style={{ padding: '12px 19px', fontSize: 14.5 }}
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- media */

export function MediaTab({
  projects,
  onSetCover,
  onClearCover,
  onError,
}: {
  projects: Project[];
  onSetCover: (project: Project, dataUrl: string) => void;
  onClearCover: (project: Project) => void;
  onError: (message: string) => void;
}) {
  return (
    <>
      <h2 style={{ margin: 0, fontSize: '1.3rem', letterSpacing: '-.03em', fontWeight: 600 }}>Media</h2>
      <p className="dl-measure-66" style={{ margin: '10px 0 22px', fontSize: 15, color: 'var(--dl-muted)' }}>
        One slot per project cover. Drop an image on a slot or click to pick one — it becomes that project&rsquo;s cover
        immediately, on the work cards and the case study page. Public pages never show an empty slot; a project simply
        has no cover until one is set.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(210px,100%),1fr))', gap: 16 }}>
        {projects.map((p) => (
          <MediaSlot
            key={p.id}
            project={p}
            onSetCover={onSetCover}
            onClearCover={onClearCover}
            onError={onError}
          />
        ))}
      </div>
    </>
  );
}

function MediaSlot({
  project,
  onSetCover,
  onClearCover,
  onError,
}: {
  project: Project;
  onSetCover: (project: Project, dataUrl: string) => void;
  onClearCover: (project: Project) => void;
  onError: (message: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);
  const [busy, setBusy] = useState(false);

  async function accept(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    try {
      onSetCover(project, await fileToCoverDataUrl(file));
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Could not use that image.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setOver(false);
          void accept(e.dataTransfer.files?.[0]);
        }}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        aria-label={`${project.title} cover`}
        style={{
          border: `1px ${over ? 'solid var(--dl-flame)' : 'solid var(--dl-line)'}`,
          borderRadius: 4,
          overflow: 'hidden',
          background: 'var(--dl-line-2)',
          height: 150,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundImage: project.cover ? `url("${project.cover}")` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {!project.cover && (
          <span className="dl-mono-sm" style={{ textAlign: 'center', padding: 12 }}>
            {busy ? 'Reading…' : `${project.title} cover`}
          </span>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          void accept(e.target.files?.[0]);
          e.target.value = '';
        }}
      />

      <div
        style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}
      >
        <span className="dl-mono dl-mono-plain" style={{ fontSize: 11 }}>
          {project.title}
        </span>
        <span
          className="dl-badge"
          style={
            project.cover
              ? { background: '#dff3dc', color: '#1e5b29' }
              : { background: '#e7e4db', color: '#5a5d54' }
          }
        >
          {project.cover ? 'Live cover set' : 'No cover'}
        </span>
      </div>

      <button
        type="button"
        onClick={() => (project.cover ? onClearCover(project) : inputRef.current?.click())}
        className="dl-row-btn"
        style={{ marginTop: 8, width: '100%' }}
      >
        {project.cover ? 'Clear cover' : 'Choose an image'}
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ api */

export function ApiTab() {
  return (
    <div
      style={{ marginTop: 26, display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(320px,100%),1fr))', gap: 24, alignItems: 'start' }}
    >
      <div>
        <h2 style={{ margin: 0, fontSize: '1.4rem', letterSpacing: '-.03em', fontWeight: 600 }}>
          How Hermes publishes — without publishing
        </h2>
        <ol style={{ margin: '18px 0 0', paddingLeft: 20, display: 'grid', gap: 12, fontSize: 16, lineHeight: 1.5, color: 'var(--dl-ink-2)' }}>
          <li>Hermes reads approved project notes and repository activity for a project.</li>
          <li>It drafts a portfolio update or case study from that material.</li>
          <li>
            It POSTs the draft to the admin API with <code className="dl-code">status: "in_review"</code>. Any other
            status is rejected by the server.
          </li>
          <li>A human reviews it in the queue and approves, edits, or rejects.</li>
          <li>
            Only a human session can set <code className="dl-code">status: "published"</code>. That is the only action
            that changes the live site.
          </li>
        </ol>
        <div className="dl-notice" style={{ marginTop: 24, padding: '18px 20px', fontSize: 15, lineHeight: 1.5 }}>
          The agent token is scoped to <strong>draft:write</strong> only. Publishing requires a human session token.
          Enforce this server-side, not in the client.
        </div>
      </div>

      <div style={{ background: 'var(--dl-pine)', borderRadius: 6, padding: 24, overflow: 'auto' }}>
        <div className="dl-mono-sm" style={{ color: 'var(--dl-green)' }}>
          Agent endpoint
        </div>
        <pre className="dl-pre">{`POST /api/portfolio/drafts
Authorization: Bearer <HERMES_AGENT_TOKEN>
Content-Type: application/json

{
  "slug": "eyegoal",
  "title": "EyeGoal",
  "category": "Internal AI Tool",
  "summary": "…",
  "challenge": "…",
  "approach": ["…", "…"],
  "result": "…",
  "tags": ["internal tool"],
  "images": ["https://…"],
  "link": "https://…",
  "status": "in_review",
  "provenance": {
    "source": "github:delai/eyegoal",
    "commits": ["a91f2c4", "7bd0e11"],
    "notes_reviewed": ["note-2026-07-21"],
    "confidence": 0.81
  }
}

201 → { "id": "draft_…", "status": "in_review" }
403 → status "published" not permitted for agent tokens`}</pre>

        <div className="dl-mono-sm" style={{ color: 'var(--dl-green)', marginTop: 26 }}>
          Human approval
        </div>
        <pre className="dl-pre">{`POST /api/portfolio/drafts/:id/approve
Authorization: Bearer <HUMAN_SESSION>

200 → { "status": "published", "approved_by": "…" }`}</pre>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- leads */

export interface Lead {
  id: string;
  contact_name?: string;
  email?: string;
  business_name?: string;
  goal?: string;
  source?: string;
  status?: string;
  created_at?: string;
}

/**
 * Reads through the same-origin /api/leads function, which holds the DELAI
 * admin secret server-side. The browser never sees it — the only thing sent
 * from here is the admin password, which that function checks against an env
 * var rather than against anything compiled into this bundle.
 */
export function LeadsTab({ password }: { password: string }) {
  const [leads, setLeads] = useState<Lead[] | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    setError('');
    setLeads(null);
    fetch('/api/leads', { headers: { 'x-admin-password': password } })
      .then(async (r) => {
        const data = (await r.json().catch(() => null)) as { leads?: Lead[]; error?: string } | null;
        if (!r.ok) throw new Error(data?.error || `Request failed (${r.status})`);
        // A 200 that isn't the expected JSON means the function did not answer
        // — under `vite dev` the SPA fallback returns index.html with status
        // 200. Falling through to `[]` there would render "No leads yet" over
        // a request that never reached the API, which is the worst outcome:
        // a silent lie about an empty pipeline.
        if (!data || !Array.isArray(data.leads)) {
          throw new Error('/api/leads did not return lead data. Is the function deployed?');
        }
        if (!cancelled) setLeads(data.leads);
      })
      .catch((e: unknown) => {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Could not load leads.');
      });
    return () => {
      cancelled = true;
    };
  }, [password]);

  return (
    <>
      <h2 style={{ margin: 0, fontSize: '1.3rem', letterSpacing: '-.03em', fontWeight: 600 }}>Leads</h2>
      <p className="dl-measure-70" style={{ margin: '10px 0 22px', fontSize: 15, color: 'var(--dl-muted)' }}>
        Everyone who submitted <strong>Find Your First Automation</strong>. Each one also emails the notification
        address the moment it arrives, so this page is the record, not the alert.
      </p>

      {error ? (
        <div className="dl-notice" style={{ padding: '18px 20px', fontSize: 15, lineHeight: 1.5 }}>
          {error}
          <div style={{ marginTop: 8, fontSize: 14 }}>
            This tab needs <code className="dl-code">ADMIN_PASSWORD</code> and{' '}
            <code className="dl-code">DELAI_ADMIN_SECRET</code> set on the deployment. It does not work against{' '}
            <code className="dl-code">vite dev</code>, which serves no functions — use{' '}
            <code className="dl-code">vercel dev</code> or a preview deployment.
          </div>
        </div>
      ) : leads === null ? (
        <div style={{ padding: 30, color: 'var(--dl-faint)', fontSize: 15.5 }}>Loading leads…</div>
      ) : leads.length === 0 ? (
        <div
          style={{
            border: '1px dashed #c9c4b7',
            borderRadius: 4,
            padding: 44,
            textAlign: 'center',
            color: 'var(--dl-faint)',
            fontSize: 15.5,
          }}
        >
          No leads yet.
        </div>
      ) : (
        <div className="dl-stack">
          {leads.map((l) => (
            <div key={l.id} style={{ background: 'var(--dl-panel)', padding: '20px 22px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 600, fontSize: 17 }}>{l.contact_name || 'Unnamed'}</span>
                  {l.business_name ? (
                    <span className="dl-badge" style={{ border: '1px solid var(--dl-line)', color: 'var(--dl-faint)' }}>
                      {l.business_name}
                    </span>
                  ) : null}
                  {l.status ? (
                    <span className="dl-badge" style={{ background: '#e7e4db', color: '#5a5d54' }}>
                      {l.status}
                    </span>
                  ) : null}
                </div>
                <span className="dl-mono dl-mono-plain" style={{ fontSize: 11.5 }}>
                  {String(l.created_at ?? '').slice(0, 10)}
                </span>
              </div>

              <div style={{ marginTop: 6, display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                {l.email ? (
                  <a href={`mailto:${l.email}`} className="dl-mono dl-mono-plain" style={{ fontSize: 12.5, fontWeight: 600 }}>
                    {l.email}
                  </a>
                ) : null}
                {l.source ? (
                  <span className="dl-mono dl-mono-plain" style={{ fontSize: 12.5 }}>
                    via {l.source}
                  </span>
                ) : null}
              </div>

              {l.goal ? (
                <p
                  className="dl-body-m"
                  style={{ margin: '14px 0 0', whiteSpace: 'pre-wrap', borderLeft: '2px solid var(--dl-flame)', paddingLeft: 14 }}
                >
                  {l.goal}
                </p>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </>
  );
}

/* ------------------------------------------------------ launch checklist */

const CHECKLIST = [
  { tag: 'Local SEO', title: 'Add the business phone number', detail: 'Goes in the footer, the contact page, and the LocalBusiness schema. Must match the Google Business Profile exactly.' },
  { tag: 'Local SEO', title: 'Confirm street address or service-area-only', detail: 'A verified address unlocks Map Pack ranking. If there is no public office, register as a service-area business instead of inventing one.' },
  { tag: 'Local SEO', title: 'Connect the Google Business Profile', detail: 'Add the profile URL to the schema sameAs, and link the site from the profile. Categories: Software Company, Business Management Consultant.' },
  { tag: 'Local SEO', title: 'Set the canonical base URL', detail: 'Comes from contact.site in content/site.json. Confirm it points at the production domain so canonicals and JSON-LD resolve.' },
  { tag: 'Content', title: 'Add a client testimonial', detail: 'The homepage testimonial band was removed rather than shipped with placeholder copy. Add it back once a quote is approved for public use.' },
  { tag: 'Content', title: 'Add client logos', detail: 'The homepage runs a plain "who we build for" line instead. Swap in a logo row once logos are cleared for public use.' },
  { tag: 'Engineering', title: 'Replace prototype auth', detail: 'This login is a client-side password read from VITE_ADMIN_PASSWORD. Move to Supabase, Clerk, or your identity provider with a real server-side session.' },
  { tag: 'Engineering', title: 'Move content off localStorage', detail: 'Projects live in this browser only. Point the admin at the real content store and the POST /api/portfolio/drafts endpoint.' },
  { tag: 'Engineering', title: 'Confirm lead email delivery', detail: 'The form posts to /api/lead, which stores the lead and emails LEAD_NOTIFY_EMAIL via Resend. Set RESEND_API_KEY on the deployment, then submit once and confirm the mail actually lands — storage succeeding does not prove sending did.' },
];

export function ChecklistTab() {
  return (
    <>
      <h2 style={{ margin: 0, fontSize: '1.3rem', letterSpacing: '-.03em', fontWeight: 600 }}>Launch checklist</h2>
      <p className="dl-measure-66" style={{ margin: '10px 0 22px', fontSize: 15, color: 'var(--dl-muted)' }}>
        Everything that has to be real before this goes live. The first four directly affect local search ranking.
      </p>
      <div style={{ display: 'grid', gap: 1 }}>
        {CHECKLIST.map((c) => (
          <div key={c.title} className="dl-admin-card" style={{ padding: '18px 20px', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
            <span className="dl-badge" style={{ background: '#e7e4db', color: '#5a5d54', flex: 'none' }}>
              {c.tag}
            </span>
            <div>
              <div style={{ fontWeight: 600, fontSize: 16 }}>{c.title}</div>
              <div style={{ marginTop: 4, fontSize: 14.5, color: 'var(--dl-muted)', lineHeight: 1.45 }}>{c.detail}</div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
