# ismaeldelarosa.dev

Portfolio of Ismael de la Rosa Guerrero, a backend-leaning full-stack engineer.

A single page told through scrolling, in Spanish (`/`) and English (`/en/`).

## Stack

- **Astro 7** with strict TypeScript: static HTML, with JavaScript only where there is animation.
- **Tailwind CSS 4**, with the design tokens in `src/styles/global.css`.
- **GSAP + ScrollTrigger + SplitText** for scroll-driven animation, and **Lenis** for smooth scrolling.
- With reduced motion enabled, the page renders in full and stays still.

## Structure

```
src/
├─ i18n/              # all copy; es.ts and en.ts implement the same interface
├─ components/
│  ├─ chapters/       # one component per chapter of the story
│  ├─ Home.astro      # the page, shared by both languages
│  └─ Nav.astro
├─ scripts/
│  ├─ motion.ts       # Lenis + ScrollTrigger + reveals
│  └─ chapters/       # one timeline per chapter
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
