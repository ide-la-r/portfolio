import { gsap } from 'gsap';
import type { Scene } from '../scrolly';

const token = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(`--color-${name}`).trim();

/**
 * One record through the product: it arrives raw, ingestion cleans it, the AI layer
 * scores it (OpenAI has no key, so Anthropic takes over), a long job runs in the
 * queue without blocking the request, and the record ends up as one row of a
 * listing that now answers in 2 ms.
 */
export const workScene: Scene = ({ tl, at, one, all, stepNamed }) => {
  const seed = one('[data-seed]');
  const card = one('[data-card]');
  const raw = one('[data-raw]');
  const clean = one('[data-clean]');
  const score = one('[data-score]');
  const nodes = all('[data-node]');
  const wires = all<SVGPathElement>('[data-wire]');
  const box = (provider: string) => one(`[data-node="${provider}"] [data-node-box]`);
  const wire = (provider: string) => one<SVGPathElement>(`[data-wire="${provider}"]`);
  const status = (key: string) => one(`[data-status="${key}"]`);
  const job = one('[data-job]');
  const jobBar = one('[data-job-bar]');
  const jobStatus = (key: string) => one(`[data-job-status="${key}"]`);
  const rows = all('[data-list] > *');
  const meter = one('[data-meter]');
  const ms = one('[data-ms]');
  const bar = one('[data-bar]');
  const signal = token('signal');

  // First frame: a warm dot where the card will be.
  gsap.set(card, { autoAlpha: 0, scale: 0.5, rotateX: 22, rotateY: -26, transformPerspective: 1100 });
  gsap.set(clean, { autoAlpha: 0 });
  gsap.set(nodes, { autoAlpha: 0, y: 14 });
  gsap.set(wires, { strokeDashoffset: 1, autoAlpha: 0 });
  gsap.set(all('[data-status]'), { autoAlpha: 0 });
  gsap.set(box('anthropic'), { boxShadow: '0 0 0px 0px rgba(143, 179, 255, 0)' });
  gsap.set(score, { autoAlpha: 0, scale: 0.6 });
  gsap.set(job, { autoAlpha: 0, y: 16 });
  gsap.set(jobBar, { scaleX: 0 });
  gsap.set(all('[data-job-status]'), { autoAlpha: 0 });
  gsap.set(rows, { autoAlpha: 0, y: 16 });
  gsap.set(meter, { autoAlpha: 0, y: 16 });
  gsap.set(bar, { scaleX: 1 });
  ms.textContent = '340';

  // The dot left behind by the route unfolds into a raw record.
  tl.to(seed, { scale: 7, autoAlpha: 0, duration: 0.4, ease: 'power2.in' }, 0).to(
    card,
    { autoAlpha: 1, scale: 1, duration: 0.45, ease: 'power3.out' },
    0.12,
  );

  const first = stepNamed('step');

  // Ingestion: the record lands flat and clean.
  let s = at(first);
  tl.to(card, { rotateX: 0, rotateY: 0 }, s)
    .to(raw, { autoAlpha: 0, duration: 0.3 }, s + 0.2)
    .to(clean, { autoAlpha: 1, duration: 0.3 }, s + 0.35);

  // AI layer: the provider is resolved per service, with a fallback when a key is missing.
  s = at(first + 1);
  tl.to(nodes, { autoAlpha: 1, y: 0, stagger: 0.06, duration: 0.3 }, s)
    .to(status('standby'), { autoAlpha: 1, duration: 0.15 }, s + 0.2)
    .to(wire('gemini'), { strokeDashoffset: 0, autoAlpha: 0.5, duration: 0.25, ease: 'none' }, s + 0.15)
    .to(wire('openai'), { strokeDashoffset: 0, autoAlpha: 1, duration: 0.25, ease: 'none' }, s + 0.15)
    .to(status('trying'), { autoAlpha: 1, duration: 0.1 }, s + 0.2)
    .to(box('openai'), { opacity: 0.35, duration: 0.15 }, s + 0.45)
    .to(wire('openai'), { opacity: 0.15, duration: 0.15 }, s + 0.45)
    .to(status('trying'), { autoAlpha: 0, duration: 0.1 }, s + 0.45)
    .to(status('skip'), { autoAlpha: 1, duration: 0.1 }, s + 0.5)
    .to(wire('anthropic'), { strokeDashoffset: 0, autoAlpha: 1, duration: 0.25, ease: 'none' }, s + 0.5)
    .to(
      box('anthropic'),
      { borderColor: signal, color: signal, boxShadow: '0 0 28px 0px rgba(143, 179, 255, 0.55)', duration: 0.2 },
      s + 0.72,
    )
    .to(status('resolves'), { autoAlpha: 1, duration: 0.15 }, s + 0.72)
    .to(score, { autoAlpha: 1, scale: 1, ease: 'back.out(2)', duration: 0.2 }, s + 0.8);

  // Product: the request answers at once; the long generation runs in the queue.
  s = at(first + 2);
  tl.to(job, { autoAlpha: 1, y: 0, duration: 0.25 }, s)
    .to(jobStatus('queued'), { autoAlpha: 1, duration: 0.1 }, s + 0.15)
    .to(jobBar, { scaleX: 1, duration: 0.6, ease: 'none' }, s + 0.25)
    .to(jobStatus('queued'), { autoAlpha: 0, duration: 0.1 }, s + 0.32)
    .to(jobStatus('running'), { autoAlpha: 1, duration: 0.1 }, s + 0.35)
    .to(jobStatus('running'), { autoAlpha: 0, duration: 0.1 }, s + 0.8)
    .to(jobStatus('done'), { autoAlpha: 1, duration: 0.1 }, s + 0.85);

  // Performance: the record becomes one row of the listing, and the query drops to 2 ms.
  s = at(first + 3);
  tl.to([...nodes, ...wires, job], { autoAlpha: 0, duration: 0.25 }, s)
    .to(card, { y: -130, scale: 0.9, transformOrigin: '50% 0%', duration: 0.5 }, s + 0.1)
    .to(rows, { autoAlpha: 1, y: 0, stagger: 0.08, duration: 0.3 }, s + 0.3)
    .to(meter, { autoAlpha: 1, y: 0, duration: 0.3 }, s + 0.35)
    .to(ms, { textContent: 2, snap: { textContent: 1 }, duration: 0.6, ease: 'expo.inOut' }, s + 0.45)
    .to(bar, { scaleX: 2 / 340, duration: 0.6, ease: 'expo.inOut' }, s + 0.45);
};
