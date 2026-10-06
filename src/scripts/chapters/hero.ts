import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';

/**
 * The name enters letter by letter; on scroll the hero recedes while the
 * 340 → 2 ms figure stays in front until the last moment.
 */
export function heroTimeline(): void {
  const hero = document.querySelector<HTMLElement>('[data-hero]');
  if (!hero) return;

  const name = hero.querySelector<HTMLElement>('[data-hero-name]');
  const fade = hero.querySelectorAll<HTMLElement>('[data-hero-fade]');
  const photo = hero.querySelector<HTMLElement>('[data-hero-photo]');
  const stat = hero.querySelector<HTMLElement>('[data-hero-stat]');
  const ms = hero.querySelector<HTMLElement>('[data-hero-ms]');

  const intro = gsap.timeline({ defaults: { ease: 'power4.out' } });

  if (name) {
    const split = SplitText.create(name, { type: 'chars,words', mask: 'words' });
    gsap.set(name, { autoAlpha: 1 });
    intro.from(split.chars, { yPercent: 110, duration: 1.1, stagger: 0.025 });
  }
  intro.fromTo(fade, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.08 }, '-=0.7');
  if (photo) intro.fromTo(photo, { autoAlpha: 0, scale: 1.08 }, { autoAlpha: 1, scale: 1, duration: 1.4 }, 0.2);

  // The counter drops from 340 to 2 on entry: a teaser for the Mainjobs chapter.
  if (ms) {
    const counter = { value: 340 };
    intro.to(
      counter,
      {
        value: 2,
        duration: 1.6,
        ease: 'expo.inOut',
        onUpdate: () => {
          ms.textContent = String(Math.round(counter.value));
        },
      },
      0.6,
    );
  }

  gsap
    .timeline({
      scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
    })
    .to(hero.querySelector('[data-hero-copy]'), { yPercent: -18, autoAlpha: 0, ease: 'none' }, 0)
    .to(photo, { scale: 0.86, yPercent: -10, autoAlpha: 0, ease: 'none' }, 0)
    .to(stat, { yPercent: -40, ease: 'none' }, 0);
}
