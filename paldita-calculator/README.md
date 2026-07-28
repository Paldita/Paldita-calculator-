# Paldita Calculator

A glassmorphic calculator with scientific mode, memory, calculation history,
a fully animated day/night theme transition, and a couple of hidden surprises.
State (theme, memory, history) is persisted in the browser via `localStorage`.

## Highlights

- **Theme story sequence** — toggling light/dark drops in a small painter
  character who "paints" a sun/moon medallion, while the whole screen floods
  to the new theme color from the point you tapped. Switching to dark spawns
  falling stars and a soft chime; switching to light sends birds flying past
  with a synthesized chirp. A "Good morning" / "Good night" banner slides in
  each time. All sounds are synthesized live with the Web Audio API — no
  audio files.
- **Persistent night sky** — dark mode keeps a faint field of twinkling stars
  in the background.
- **Deeper glassmorphism** — layered blur/saturation, an animated sheen
  sweep, and a subtle SVG-noise grain overlay for a more tactile glass feel.
- **Type system** — Outfit for UI, JetBrains Mono for the numeric display,
  Fraunces italic for the wordmark and story banners.
- **Angular-driven animation** — the painter and banner use Angular's
  `@angular/animations` enter/leave triggers; the digit display re-renders
  through a keyed `*ngFor` so every value change cascades in digit-by-digit.
- **More calculator functions** — x², 1/x, ± (negate), π, alongside the
  existing sin/cos/tan/√/log/ln/xʸ/n!, plus memory (MC/MR/M+/M−) and a full
  history panel.
- **Tap the result to copy it** to your clipboard (small toast confirms it).
- **Paldita branding** — a faceted gem logo mark sits next to the wordmark in
  the top bar, doubling as the browser favicon.
- **Smoother, tactile keypad** — spring-style easing on button presses/hover,
  plus a light haptic tick (`navigator.vibrate`) on supported touch devices.
- **Easter egg #1 — Konami code**: enter ↑ ↑ ↓ ↓ ← → ← → b a on a keyboard for
  a hidden confetti celebration. Since phones don't have arrow keys, the
  **same secret** is also reachable by **tapping the logo mark 5 times**
  quickly — no keyboard required, works identically on desktop and mobile.
- **Easter egg #2 — Paldita surprise** *(new)*: press and hold the "Paldita"
  wordmark for about a second (mouse or finger — both work the same) to spill
  a shower of sparkles, hear a little four-note signature jingle, and give
  the `=` button a golden glow. This is Paldita's own calling card, separate
  from the Konami egg.

## Run locally

```bash
npm install
npm start
```

Then open http://localhost:4200.

## Build for production

```bash
npm install
npm run build
```

Output goes to `dist/calculator/browser`.

## Deploy to Vercel

**Option A — Vercel CLI**

```bash
npm install -g vercel
vercel
```

Vercel will read `vercel.json`, which already points at the correct build
command and output directory (`dist/calculator/browser`).

**Option B — Git + Vercel dashboard**

1. Push this folder to a GitHub/GitLab/Bitbucket repo.
2. Import the repo in the Vercel dashboard.
3. Vercel auto-detects the settings from `vercel.json` — no manual
   configuration needed. Click Deploy.

## Project structure

```
paldita-calculator/
├── src/
│   ├── app/
│   │   ├── app.component.ts     Component logic
│   │   └── app.component.html   Template
│   ├── assets/
│   │   └── favicon.svg          Paldita gem logo / favicon
│   ├── index.html               Shell + fonts + favicon
│   ├── main.ts                  Bootstrap
│   └── styles.css               Global glass/theme styles
├── angular.json
├── package.json
├── tsconfig*.json
└── vercel.json
```
