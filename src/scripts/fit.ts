/** Never blow a scene up beyond this: its type would get coarse on big screens. */
const MAX_SCALE = 1.25;
/** Breathing room left around a scene inside its box. */
const MARGIN = 0.94;

/**
 * Scenes with a fixed design size (data-fit="440x500") are drawn in pixels and
 * scaled as a whole to fit their box, so the composition is identical on a phone
 * and on a 27" screen.
 */
export function fitScenes(): void {
  document.querySelectorAll<HTMLElement>('[data-fit]').forEach((scene) => {
    const [width, height] = (scene.dataset.fit ?? '').split('x').map(Number);
    const box = scene.parentElement;
    if (!width || !height || !box) return;

    const fit = () => {
      const scale = Math.min((box.clientWidth * MARGIN) / width, (box.clientHeight * MARGIN) / height, MAX_SCALE);
      scene.style.setProperty('--fit', scale.toFixed(3));
    };

    new ResizeObserver(fit).observe(box);
    fit();
  });
}
