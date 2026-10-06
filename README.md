# ismaeldelarosa.dev

Portfolio of Ismael de la Rosa Guerrero, a backend-leaning full-stack engineer.

A single page told through scrolling, in Spanish (`/`) and English (`/en/`).

## Stack

- **Astro 7** with strict TypeScript: static HTML, with JavaScript only where there is animation.
- **Tailwind CSS 4**, with the design tokens in `src/styles/global.css`.
- **GSAP + ScrollTrigger + SplitText** for scroll-driven animation, and **Lenis** for smooth scrolling.

## How the scroll story works

Three chapters are told in steps (`components/Scrolly.astro` + `components/Step.astro`):
a visual stays on screen while the text that explains it scrolls past, beside it on
desktop and above it on phones.

| Chapter | Visual | What happens on scroll |
|---|---|---|
| Journey | An elevation profile | A dot climbs one stop per step, from 2021 to Mainjobs |
| Mainjobs | A tender record | It arrives raw, gets cleaned, scored by the AI layer and listed in 2 ms |
| How I work + side project | A terminal | It types each habit, then shrinks into the phone running Libro de Trayectos |

Each chapter has a scene in `scripts/chapters/` that builds one GSAP timeline lasting
one unit per step, with every transition centred on the boundary between two steps
(`scripts/scrolly.ts`). Scenes drawn at a fixed design size are scaled as a whole to fit
their box (`scripts/fit.ts`).

With reduced motion enabled there is no smooth scrolling and nothing tweens: each step
switches its scene straight to its final state. Without JavaScript every chapter still
reads in full.

## Structure

```
src/
├─ i18n/              # all copy; es.ts and en.ts implement the same interface
├─ components/
│  ├─ chapters/       # one component per chapter of the story
│  ├─ Scrolly.astro   # sticky visual + steps that scroll past it
│  ├─ Step.astro
│  ├─ Home.astro      # the page, shared by both languages
│  └─ Nav.astro
├─ scripts/
│  ├─ motion.ts       # Lenis + every chapter wired to the scroll
│  ├─ scrolly.ts      # one timeline per chapter, one unit per step
│  ├─ fit.ts          # scales fixed-size scenes to their box
│  └─ chapters/       # the scenes
├─ layouts/Base.astro # SEO, hreflang, Open Graph and JSON-LD
└─ pages/             # / and /en/
```

## Commands

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # astro check + build into dist/
npm run preview
```
