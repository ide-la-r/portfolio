export const locales = ['es', 'en'] as const;
export type Locale = (typeof locales)[number];

export interface RouteStop {
  year: string;
  kind: 'study' | 'work';
  title: string;
  place: string;
  body: string;
}

export interface TerminalLine {
  kind: 'cmd' | 'ok' | 'dim';
  text: string;
}

/**
 * Every piece of copy on the site. Both languages implement this interface, so a
 * missing key in either one fails the build.
 */
export interface Dictionary {
  meta: { title: string; description: string; ogLocale: string };
  nav: {
    label: string;
    route: string;
    work: string;
    how: string;
    project: string;
    stack: string;
    contact: string;
    cv: string;
    cvFile: string;
    switchLabel: string;
    skip: string;
  };
  hero: {
    role: string;
    summary: string;
    location: string;
    statLabel: string;
    scroll: string;
    photoAlt: string;
  };
  route: { eyebrow: string; title: string; intro: string; climb: string; stops: RouteStop[] };
  work: {
    eyebrow: string;
    company: string;
    period: string;
    title: string;
    context: string;
    steps: { label: string; title: string; body: string }[];
    latency: { label: string; caption: string };
    /** The sample record that travels through ingestion, already clean. */
    card: { label: string; value: string }[];
    sample: string;
  };
  how: { eyebrow: string; title: string; intro: string; terminal: TerminalLine[]; points: { title: string; body: string }[] };
  project: {
    eyebrow: string;
    name: string;
    tagline: string;
    body: string[];
    facts: { label: string; value: string }[];
    ledger: { title: string; route: string; meta: string; costLabel: string; cost: string; entry: string; lines: { who: string; amount: string }[] };
    live: string;
    code: string;
  };
  stack: { eyebrow: string; title: string; groups: { name: string; items: string[] }[] };
  education: {
    eyebrow: string;
    title: string;
    items: { title: string; place: string; years: string; note: string }[];
    also: string[];
    languages: string;
  };
  contact: { eyebrow: string; title: string; body: string; copy: string; copied: string; cv: string; footer: string };
}
