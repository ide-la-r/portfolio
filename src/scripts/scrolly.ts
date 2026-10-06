import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Share of a step that a transition lasts. Transitions are centred on the boundary
 * between two steps, so time `i` on a scene's timeline is where step `i` begins and
 * the whole timeline lasts exactly one unit per step.
 */
export const TRANSITION = 0.7;

export interface SceneContext {
  root: HTMLElement;
  tl: gsap.core.Timeline;
  steps: HTMLElement[];
  /** Where the transition into step `i` starts on the timeline. */
  at: (i: number) => number;
  /** Index of the first step with the given `name` (see Step.astro). */
  stepNamed: (name: string) => number;
  one: <T extends Element = HTMLElement>(selector: string) => T;
  all: <T extends Element = HTMLElement>(selector: string) => T[];
  /** Scenes skip purely decorative hand-offs when motion is reduced. */
  reducedMotion: boolean;
}

/** Builds a chapter's timeline: sets the first frame, then adds one transition per step. */
export type Scene = (ctx: SceneContext) => void;

const isDesktop = () => window.matchMedia('(width >= 64rem)').matches;

/**
 * The line a step has to cross to become the current one. On phones the visual
 * covers the top of the screen, so a step arrives while it slides into the reading
 * area below it, and the scene changes as its text comes in.
 */
const arrivalLine = () => (isDesktop() ? '58%' : '78%');

export function mountScrolly(root: HTMLElement, scene: Scene, reducedMotion: boolean): void {
  const steps = Array.from(root.querySelectorAll<HTMLElement>('[data-step]'));
  if (steps.length === 0) return;

  const tl = gsap.timeline({ paused: true, defaults: { duration: TRANSITION, ease: 'power2.inOut' } });

  scene({
    root,
    tl,
    steps,
    reducedMotion,
    at: (i) => Math.max(0, i - TRANSITION / 2),
    stepNamed: (name) => steps.findIndex((step) => step.dataset.stepName === name),
    one: <T extends Element = HTMLElement>(selector: string) => {
      const el = root.querySelector<T>(selector);
      if (!el) throw new Error(`Scene "${root.dataset.scrolly}" is missing ${selector}`);
      return el;
    },
    all: <T extends Element = HTMLElement>(selector: string) => Array.from(root.querySelectorAll<T>(selector)),
  });

  tl.set({}, {}, steps.length);
  root.dataset.ready = '';

  const first = steps[0];
  const last = steps[steps.length - 1];

  if (reducedMotion) {
    // No continuous motion: each step snaps the scene straight to its finished state.
    steps.forEach((step, i) => {
      ScrollTrigger.create({
        trigger: step,
        start: () => `top ${arrivalLine()}`,
        end: () => `bottom ${arrivalLine()}`,
        onToggle: (self) => {
          if (self.isActive) tl.seek(i + TRANSITION, false);
        },
        onLeaveBack: i === 0 ? () => tl.seek(0, false) : undefined,
      });
    });
    return;
  }

  ScrollTrigger.create({
    trigger: first,
    start: () => `top ${arrivalLine()}`,
    endTrigger: last,
    end: () => `bottom ${arrivalLine()}`,
    scrub: 0.7,
    animation: tl,
  });

  steps.forEach((step) => {
    ScrollTrigger.create({ trigger: step, start: 'top 55%', end: 'bottom 55%', toggleClass: 'is-active' });
  });
}
