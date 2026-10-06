import { gsap } from 'gsap';

/**
 * The stack arrives as a pile of layers tilted away from the viewer and spreads out
 * into its grid as the section scrolls in. On phones the grid is a single column,
 * so each group simply rises into place.
 */
export function stackLayers(): void {
  const grid = document.querySelector<HTMLElement>('[data-stack-grid]');
  if (!grid) return;
  const layers = gsap.utils.toArray<HTMLElement>('[data-stack-layer]', grid);

  const mm = gsap.matchMedia();

  mm.add('(width >= 48rem)', () => {
    // offsetLeft/Top ignore transforms, so the pile is measured from the real grid.
    gsap.from(layers, {
      x: (_: number, layer: HTMLElement) => grid.clientWidth / 2 - (layer.offsetLeft + layer.offsetWidth / 2),
      y: (i: number, layer: HTMLElement) => grid.clientHeight / 2 - (layer.offsetTop + layer.offsetHeight / 2) - i * 18,
      rotateX: 58,
      rotateZ: -9,
      scale: 0.8,
      transformPerspective: 1600,
      ease: 'power2.out',
      scrollTrigger: { trigger: grid, start: 'top 92%', end: 'center 58%', scrub: 0.6, invalidateOnRefresh: true },
    });
  });

  mm.add('(width < 48rem)', () => {
    layers.forEach((layer) => {
      gsap.from(layer, {
        autoAlpha: 0,
        y: 32,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: layer, start: 'top 90%', once: true },
      });
    });
  });
}
