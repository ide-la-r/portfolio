export const locales = ['es', 'en'] as const;
export type Locale = (typeof locales)[number];

/** A fixed-length list: the scroll scenes draw one element per entry. */
type Tuple<T, N extends number, Acc extends T[] = []> = Acc['length'] extends N ? Acc : Tuple<T, N, [...Acc, T]>;

export interface RouteStop {
  year: string;
  kind: 'study' | 'work';
  /** Label under the stop's marker on the route chart. */
  short: string;
  title: string;
  place: string;
  body: string;
}

export interface TerminalLine {
  kind: 'cmd' | 'ok' | 'fail' | 'note' | 'warn';
  text: string;
}

interface Habit {
  title: string;
  body: string;
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
  route: {
    eyebrow: string;
    title: string;
    intro: string;
    /** Label of the altitude readout above the chart. */
    climb: string;
    /** Six stops, one per vertex of the route profile drawn in Route.astro. */
    stops: Tuple<RouteStop, 6>;
  };
  work: {
    eyebrow: string;
    company: string;
    period: string;
    title: string;
    context: string;
    /** Ingestion, AI layer, product, performance: the four states of the card. */
    steps: Tuple<{ label: string; title: string; body: string }, 4>;
    latency: { label: string };
    /** The sample record that travels through ingestion, already clean. */
    card: { label: string; value: string }[];
    machine: {
      /** Labels that tell the raw record apart from the clean one. */
      rawLabel: string;
      cleanLabel: string;
      /** What is wrong with the raw record, in the order it appears in it. */
      rawNotes: Tuple<string, 3>;
      trying: string;
      skip: string;
      resolves: string;
      standby: string;
      request: string;
      requestDone: string;
      job: string;
      queued: string;
      running: string;
      done: string;
      rows: Tuple<{ title: string; score: string }, 2>;
    };
    sample: string;
  };
  how: {
    eyebrow: string;
    title: string;
    intro: string;
    points: Tuple<Habit, 4>;
    /** The first thing the terminal types, while the chapter title is on screen. */
    prompt: TerminalLine;
    /** What the terminal types while each habit is on screen, one group per habit. */
    terminal: Tuple<TerminalLine[], 4>;
  };
  project: {
    eyebrow: string;
    name: string;
    tagline: string;
    /** Real cost, double-entry ledger, data sources: the three states of the phone. */
    body: Tuple<string, 3>;
    facts: { label: string; value: string }[];
    ledger: {
      title: string;
      route: string;
      meta: string;
      costLabel: string;
      cost: string;
      entry: string;
      lines: { who: string; amount: string }[];
      total: string;
      installed: string;
    };
    live: string;
    code: string;
  };
  stack: { eyebrow: string; title: string; groups: { name: string; items: string[] }[] };
  education: {
    eyebrow: string;
    title: string;
    items: { title: string; place: string; years: string; note: string }[];
    also: string[];
    /** Spoken languages and their level, shown as a row of their own. */
    languages: {
      label: string;
      items: { name: string; level: string }[];
      note: string;
    };
  };
  contact: { eyebrow: string; title: string; body: string; copy: string; copied: string; cv: string; footer: string };
}
