import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';
import { fitScenes } from './fit';
import { mountScrolly, type Scene } from './scrolly';
import { heroTimeline } from './chapters/hero';
import { routeScene } from './chapters/route';

gsap.registerPlugin(ScrollTrigger, SplitText);

/** One scene per chapter told in steps, keyed by its data-scrolly name. */
const scenes: Record<string, Scene> = { route: routeScene };

/**
 * Wires every chapter to the scroll. With reduced motion the scroll scenes still
 * change state as each step arrives, but instantly: no smooth scrolling, no tweens,
 * no reveals.
 */
export function startMotion(): void {
  const reducedMotion = !document.documentElement.classList.contains('motion');

  fitScenes();
  document.querySelectorAll<HTMLElement>('[data-scrolly]').forEach((root) => {
    const scene = scenes[root.dataset.scrolly ?? ''];
    if (scene) mountScrolly(root, scene, reducedMotion);
  });

  if (!reducedMotion) {
    const lenis = new Lenis({ lerp: 0.1, anchors: { offset: -56 } });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    heroTimeline();
    revealOnEnter();
  }

  // Web fonts change text metrics, so triggers are recalculated once they load.
  document.fonts.ready.then(() => ScrollTrigger.refresh());
}

/** Anything marked data-reveal fades in once, when it enters the viewport. */
function revealOnEnter(): void {
  gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
    gsap.fromTo(
      el,
      { autoAlpha: 0, y: 32 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.9,
        ease: 'power3.out',
        delay: Number(el.dataset.revealDelay ?? 0),
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      },
    );
  });
}
