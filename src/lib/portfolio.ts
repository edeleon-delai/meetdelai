/**
 * Portfolio store for /work and /admin.
 *
 * Prototype persistence: the shipped baseline is content/projects.json, and
 * the admin's edits are layered on top in localStorage. That is deliberate and
 * temporary — the redesign brief's own launch checklist lists "move content
 * off localStorage" as a blocker, and the Hermes integration tab documents the
 * real contract (POST /api/portfolio/drafts). When that endpoint exists, only
 * `load`/`save` below need to change; nothing else reads storage directly.
 *
 * Every export here is SSR-safe: the prerenderer renders these same page
 * components with react-dom/server, where `window` does not exist. Reads fall
 * back to the seed, writes become no-ops.
 */
import { useCallback, useEffect, useState } from 'react';
import { seedProjects, type Project } from '../content';

export const PROJECTS_KEY = 'delai.projects.v3';
export const QUEUE_KEY = 'delai.hermes.queue.v1';

/** A draft Hermes has proposed. It can write these; it cannot publish them. */
export interface QueueItem {
  id: string;
  /** ISO timestamp. */
  created: string;
  /** Human-readable provenance, e.g. "GitHub · delai/eyegoal · 14 commits". */
  source: string;
  /** 0–1. Rendered as a percentage. */
  confidence: number;
  note: string;
  payload: {
    slug: string;
    title: string;
    category: string;
    summary: string;
    result: string;
  };
}

export function seedQueue(): QueueItem[] {
  return [
    {
      id: 'h-1',
      created: '2026-07-28T09:14:00Z',
      source: 'GitHub · delai/eyegoal · 14 commits since Jun 02',
      confidence: 0.81,
      note: 'Detected a release tag and a new README section. Drafted a case study update for EyeGoal.',
      payload: {
        slug: 'eyegoal',
        title: 'EyeGoal',
        category: 'Internal AI Tool',
        summary:
          'A goal-tracking system that reads progress from the tools a team already uses, instead of asking anyone to fill in a tracker.',
        result:
          'Shipped v1.2 with automated progress detection. Manual check-ins dropped out of the daily loop entirely.',
      },
    },
  ];
}

function read<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* quota or private mode — the in-memory state still holds for this session */
  }
}

export const loadProjects = (): Project[] => read<Project[]>(PROJECTS_KEY, seedProjects);
export const loadQueue = (): QueueItem[] => read<QueueItem[]>(QUEUE_KEY, seedQueue());

export const today = (): string => new Date().toISOString().slice(0, 10);

export function slugify(text: string): string {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/** A new, empty project record — the "New project" form's starting state. */
export function blankProject(): Project {
  const stamp = Date.now();
  return {
    id: `p-${stamp}`,
    slug: '',
    title: '',
    client: '',
    year: String(new Date().getFullYear()),
    category: 'AI Workflow Automation',
    status: 'draft',
    featured: false,
    source: 'human',
    link: '',
    summary: '',
    challenge: '',
    approach: '',
    result: '',
    tags: '',
    coverId: `cover-${stamp}`,
    cover: '',
    updated: today(),
  };
}

/** Only published projects are ever visible off /admin. */
export const publishedOnly = (projects: Project[]): Project[] =>
  projects.filter((p) => p.status === 'published');

export const projectHref = (p: Project): string => `/work/${p.slug}`;

export const approachLines = (p: Project | undefined): string[] =>
  String(p?.approach ?? '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

export const tagList = (p: Project | undefined): string[] =>
  String(p?.tags ?? '')
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);

/**
 * Shared state for the public work pages and the admin.
 *
 * Hydration note: the first render must match the prerendered HTML, so this
 * starts on the seed and swaps to the stored copy in an effect. Public pages
 * therefore paint the shipped baseline, then reconcile — which is correct,
 * since the stored copy only exists in the editor's own browser.
 */
export function usePortfolio() {
  const [projects, setProjects] = useState<Project[]>(seedProjects);
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setProjects(loadProjects());
    setQueue(loadQueue());
    setHydrated(true);
  }, []);

  const saveProjects = useCallback((next: Project[]) => {
    setProjects(next);
    write(PROJECTS_KEY, next);
  }, []);

  const saveQueue = useCallback((next: QueueItem[]) => {
    setQueue(next);
    write(QUEUE_KEY, next);
  }, []);

  const resetDemo = useCallback(() => {
    saveProjects(seedProjects);
    saveQueue(seedQueue());
  }, [saveProjects, saveQueue]);

  return { projects, queue, hydrated, saveProjects, saveQueue, resetDemo };
}
