# Trinity Architecture

Binding: `@frontend-dev` (write) + `@code-review` (audit). Violation → rework /
REJECT. Contract = AGENTS.md structure + DESIGN.md aesthetics. This doc refines,
never overrides.

---

## Trinity

1. Markup in `index.html`. `<link rel="stylesheet" href="/src/styles/main.css">`
   in `<head>`.
2. CSS in `src/styles/layout/` or `components/`. Aggregated in `main.css`.
   Import via `main.css`. NOT imported from JS.
3. JS modules in `src/js/layout/` or `components/`. Init via `src/main.js`
   scoped lifecycle wrapper.

## HTML

- Entire structure in `index.html`. No fragments.
- SEO: unique meta, semantic `<h1>`, descriptive alt+wh, JSON-LD.
- Only CSS: `<link rel="stylesheet" href="/src/styles/main.css">`.
- Only JS: `<script type="module" src="/src/main.js">` head`.
- Forbidden: `<div>`+ARIA to fake native (use `<ul>`, `<button>`, `<dialog>`).
- Forbidden: inline styles, `<style>`, `<script>`, onclick attrs.

## CSS

- **Bound by DESIGN.md** — palette, typo, motion, spatial = hard.
- **Modular layers** — layout/, components/, boilerplate/. Aggregated in
  main.css.
- **Anti-AI slop** — asymmetry, diagonal flows, grid-breaking.
- **Nesting** — collapse flat selectors into `&` blocks. Max 3 levels.
- **Type** — local fonts in `src/assets/fonts/`. No Google CDN. No
  Inter/Roboto/system-ui.
- **Tokens** — use vars from `boilerplate/variables.css`.

## JS

- `src/main.js` = init only. No DOM manipulate, no feature logic.
- Module split: `layout/` (nav, scroll), `components/` (slider, modal), `utils/`
  (debounce).
- Each module exports `init()` — no params, guard missing DOM, return cleanup.
- No `DOMContentLoaded` — ES modules deferred by default.
- **Event delegation** — bind once to parent. No loop of listeners.
  `event.target.closest()`.
- **Identify via `data-*`** — `data-*` attrs over id/class for event targeting.
- **closest over tagName** — buttons wrap tags (icon, span). Click target =
  inner node, not button. Use `event.target.closest('button')`. Never
  `target.tagName === 'BUTTON'`.
- **Defensive** — async inside try/catch. Guard element presence.
- **Scope** — `globalThis` over `window`. No global pollution.
- **ES6+** — map/filter/reduce over loops. Pure fns, immutability.

### Readability

- **Names state intent** — full descriptive names, no abbreviations
  (`stackContainer`, `progressBar`, `activeStepIndex`). Exceptions: units
  (`_MS`), web-standard terms (`DOM`, `URL`), loop locals.
- **Helpers at module scope** — logic/render helpers live outside `init()` as
  module-level functions taking the refs/state they need; `init()` only queries
  DOM, holds state, wires listeners.
- **No unnecessary params** — every parameter must be used. Drop unused ones
  (e.g. `init()` takes no `config`).
- **Self-documenting over comments** — name says _what_, comment only _why_
  (non-obvious). No restating comments.
- **Naming/condition rules** - (named predicates, small one-job fns) live in
  `performance-reliability.md` §Cognitive difficulty. This doc refines, never
  duplicates.

## Assets

- `src/assets/`: Vite-processed (images, fonts). Relative CSS paths.
- `public/`: as-is (favicon, robots.txt).
- Fonts: `src/assets/fonts/` only. No CDN.
