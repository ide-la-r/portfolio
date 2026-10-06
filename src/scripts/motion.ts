import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';
import { heroTimeline } from './chapters/hero';

gsap.registerPlugin(ScrollTrigger, SplitText);

/**
 * Starts smooth scrolling and every chapter animation.
 * With reduced motion it does nothing: the page already reads in full without JavaScript.
 */
export function startMotion(): void {
  if (!document.documentElement.classList.contains('motion')) return;

  const lenis = new Lenis({ lerp: 0.1, anchors: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  heroTimeline();
  revealOnEnter();

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
