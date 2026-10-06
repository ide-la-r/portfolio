import type { Scene } from '../scrolly';

/**
 * The dot climbs the profile one stop per step, drawing the line behind it. At the
 * end the chart zooms into the last stop: the dot the Mainjobs chapter grows from.
 */
export const routeScene: Scene = ({ tl, steps, at, one, all, stepNamed, reducedMotion }) => {
  const path = one<SVGPathElement>('[data-route-path]');
  const clip = one<SVGRectElement>('[data-route-clip]');
  const chart = one('[data-route-chart]');
  const dot = one('[data-route-dot]');
  const readout = one('[data-route-readout]');
  const year = one('[data-route-year]');
  const altitude = one('[data-route-alt]');
  const marks = all('[data-route-mark]');

  const total = path.getTotalLength();
  const stopLengths = marks.map((mark) => lengthAtX(path, total, Number(mark.dataset.x)));
  const head = { length: 0 };

  // The profile only moves rightwards, so revealing everything left of the dot
  // draws the line exactly up to it.
  const draw = () => {
    const point = path.getPointAtLength(head.length);
    clip.setAttribute('width', String(point.x + 20));
    dot.style.left = `${point.x / 8}%`;
    dot.style.top = `${point.y / 3}%`;
    marks.forEach((mark, i) => mark.classList.toggle('is-passed', head.length >= stopLengths[i] - 0.5));
  };

  year.textContent = marks[0].dataset.year ?? '';
  altitude.textContent = '0';
  draw();

  const firstStop = stepNamed('stop');
  marks.forEach((mark, i) => {
    const start = at(firstStop + i);
    tl.to(head, { length: stopLengths[i], onUpdate: draw }, start)
      .to(year, { textContent: Number(mark.dataset.year), snap: { textContent: 1 }, ease: 'none' }, start)
      .to(altitude, { textContent: Number(mark.dataset.alt), snap: { textContent: 1 } }, start);
  });

  if (reducedMotion) return;

  const last = marks[marks.length - 1];
  const end = steps.length;
  tl.to(
    chart,
    { scale: 2.6, autoAlpha: 0, transformOrigin: `${last.style.left} ${last.style.top}`, duration: 0.5, ease: 'power2.in' },
    end - 0.5,
  ).to(readout, { autoAlpha: 0, y: -24, duration: 0.35, ease: 'power2.in' }, end - 0.5);
};

/** Path length at which the profile reaches `x`, found by bisection. */
function lengthAtX(path: SVGPathElement, total: number, x: number): number {
  let low = 0;
  let high = total;
  for (let i = 0; i < 24; i++) {
    const mid = (low + high) / 2;
    if (path.getPointAtLength(mid).x < x) low = mid;
    else high = mid;
  }
  return (low + high) / 2;
}
