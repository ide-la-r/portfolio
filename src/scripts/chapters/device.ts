import { gsap } from 'gsap';
import type { Scene } from '../scrolly';

/** Time each habit's terminal output takes to type, shared out by line length. */
const TYPING = 0.8;

const token = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(`--color-${name}`).trim();

/**
 * Each habit types its own lines into the terminal. When the side project comes in,
 * the terminal shrinks into a phone running it: the route and its climb, a ledger
 * entry that sums to zero, and the app installed on the home screen.
 */
export const deviceScene: Scene = ({ tl, at, one, all, stepNamed }) => {
  const device = one('[data-device]');
  const bar = one('[data-device-bar]');
  const lines = all('[data-line]');
  const phone = one('[data-phone]');
  const elevation = one<SVGPathElement>('[data-elevation]');
  const cost = one('[data-cost]');
  const ledger = one('[data-ledger]');
  const ledgerLines = all('[data-ledger-line]');
  const sum = one('[data-ledger-sum]');
  const toast = one('[data-toast]');
  const terminal = [bar, ...lines];

  gsap.set(device, { autoAlpha: 0, y: 28 });
  gsap.set(lines, { clipPath: 'inset(0% 100% 0% 0%)' });
  gsap.set(phone, { autoAlpha: 0 });
  gsap.set(elevation, { strokeDashoffset: 1 });
  gsap.set([cost, ledger], { autoAlpha: 0, y: 10 });
  gsap.set(ledgerLines, { autoAlpha: 0, x: -10 });
  gsap.set(toast, { autoAlpha: 0, y: -14 });

  // A typewriter: one step per character, the time shared out by line length.
  const type = (group: HTMLElement[], start: number, total: number) => {
    const chars = group.reduce((n, line) => n + (line.textContent?.length ?? 0), 0);
    let cursor = start;
    group.forEach((line) => {
      const length = line.textContent?.length ?? 1;
      const duration = (total * length) / chars;
      tl.to(line, { clipPath: 'inset(0% 0% 0% 0%)', ease: `steps(${length})`, duration }, cursor);
      cursor += duration;
    });
  };
  const linesOf = (group: string) => lines.filter((line) => line.dataset.group === group);

  tl.to(device, { autoAlpha: 1, y: 0, duration: 0.45, ease: 'power3.out' }, 0);

  // The agent gets its instruction while the chapter title is on screen...
  type(linesOf('intro'), 0.15, 0.45);

  // ...and every habit then types its own group of lines.
  const firstHabit = stepNamed('habit');
  const habits = [...new Set(lines.map((line) => line.dataset.group ?? ''))].filter((group) => group !== 'intro');
  habits.forEach((group, g) => type(linesOf(group), at(firstHabit + g), TYPING));

  // The terminal becomes the phone; the two screens overlap so the shell is never empty.
  const project = stepNamed('project');
  let s = at(project);
  tl.to(terminal, { autoAlpha: 0, duration: 0.2 }, s)
    .to(device, { width: 260, height: 520, borderRadius: 44, duration: 0.5, ease: 'power3.inOut' }, s + 0.05)
    .to(phone, { autoAlpha: 1, duration: 0.3 }, s + 0.3);

  // Real cost: the route is drawn with its climb.
  s = at(project + 1);
  tl.to(elevation, { strokeDashoffset: 0, duration: 0.6, ease: 'power1.inOut' }, s).to(
    cost,
    { autoAlpha: 1, y: 0, duration: 0.3 },
    s + 0.3,
  );

  // Double entry: one line per person, and the entry sums to zero.
  s = at(project + 2);
  tl.to(ledger, { autoAlpha: 1, y: 0, duration: 0.25 }, s)
    .to(ledgerLines, { autoAlpha: 1, x: 0, stagger: 0.1, duration: 0.25 }, s + 0.1)
    .to(sum, { color: token('ok'), borderTopColor: token('ok'), duration: 0.2 }, s + 0.55);

  // Installable: it lives on the home screen like any other app.
  s = at(project + 3);
  tl.to(toast, { autoAlpha: 1, y: 0, duration: 0.3, ease: 'back.out(1.6)' }, s);
};
