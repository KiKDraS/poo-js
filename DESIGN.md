# DESIGN.md — Project Design Contract

**Status:** Active — all agents MUST comply
**Source:** `DESIGN.md.template`
**Language:** Spanish (es) — all UI copy, content, tests. Code identifiers/JS keywords stay English.

---

## 1. PROJECT IDENTITY & DESIGN PHILOSOPHY

### 1.1 Project Purpose
Landing page educativa. Enseña a estudiantes principiantes de JS: **Contexto de Ejecución** y **`this`** (mecánica POO pre-ES6: constructores + `prototype`; ejemplos con sintaxis moderna `let`/`const`) como base para entender POO en JS.

### 1.2 Primary Audience
Estudiantes que empiezan JS. Sin experiencia previa en contextos/`this`. Lectura en pantalla y proyección en clase.

### 1.3 Primary Conversion Goal
Leer la lección completa y ejecutar los demos interactivos (call-stack stepper + toggle strict/sloppy). Sin formularios, sin registro.

### 1.4 Design Philosophy (mandated by `frontend-design`)

| Principle | Project Decision |
|---|---|
| **Aesthetic Direction** | "The Runtime Ledger" — textbook editorial × debugger console. Papel cálido, tinta azul, un acento. Refined minimalism, densidad precisa |
| **Typography** | Fraunces (display) + Atkinson Hyperlegible (body) + JetBrains Mono (code) — todas locales, OFL |
| **Color Strategy** | Papel cálido + tinta azul profunda. Acento único: ámbar quemado (highlights, flechas, spotlight de `this`). Paleta sintaxis para código |
| **Layout Approach** | Single long-form lesson. TOC sticky con progreso (desktop). Bloques "código + explicación" en 2 columnas |
| **Background Treatment** | Textura de papel (grain CSS sutil). Secciones alternan con patrón de cuadrícula (graph paper) |
| **Motion Choreography** | Reveal escalonado en load + scroll reveal por sección. Frames del stack animan pop-in/pop-out. Calmado, sin gimmicks |
| **Differentiator** | **Call-stack stepper interactivo** (botón Run: los contextos se apilan/desapilan en vivo) + **metáfora de la llamada telefónica** para `this` (quien contesta la llamada; haz visual muestra quién contesta en cada ejemplo) |

---

## 2. DESIGN TOKENS

Fill into `src/styles/boilerplate/variables.css`.

### 2.1 Color Palette

| Token | Light | Dark | Usage |
|---|---|---|---|
| `--color-bg` | `#F7F2E9` | `#10151F` | Page background |
| `--color-bg-alt` | `#EFE7D8` | `#0B0F16` | Alternate sections |
| `--color-bg-elevated` | `#FFFDF7` | `#1A2130` | Cards, code blocks |
| `--color-text` | `#1F2430` | `#E8E4D8` | Primary text |
| `--color-text-muted` | `#5A6072` | `#9AA0B0` | Secondary text |
| `--color-text-inverse` | `#F7F2E9` | `#10151F` | Text on dark backgrounds |
| `--color-primary` | `#1E3A5F` | `#5B8DD9` | Brand dominant |
| `--color-primary-hover` | `#17304F` | `#74A1E3` | Brand hover |
| `--color-primary-active` | `#12263E` | `#4A78C0` | Brand active |
| `--color-accent` | `#C75B12` | `#E08A3C` | Highlights, arrows, "quién contesta" |
| `--color-accent-hover` | `#A94A0E` | `#E9A05C` | Accent hover |
| `--color-border` | `#DCD3C0` | `#2A3345` | Subtle borders |
| `--color-border-strong` | `#C4B99F` | `#3A4566` | Emphasized borders |
| `--color-focus` | `#C75B12` | `#E08A3C` | Focus rings |
| `--color-error` | `#B3261E` | `#F28B82` | Error states |
| `--color-success` | `#1B7F4D` | `#7FD1A6` | Success states |
| `--color-warning` | `#B45309` | `#F2B26B` | Warning states |

**Dark mode:** copy tokens into `@media (prefers-color-scheme: dark) { :root { ... } }`. Override only color tokens.

**Syntax palette (code blocks, light/dark):** keyword `#7A3E9D`/`#C792EA`, string `#1B7F4D`/`#A5D6A7`, function `#1E3A5F`/`#82AAFF`, comment `#8A8578`/`#6B7280`, number `#B45309`/`#F78C6C`, property `#C75B12`/`#FFCB6B`, plain `#1F2430`/`#E8E4D8`.

### 2.2 Typography Scale (clamp fluid)

| Token | Value | Font |
|---|---|---|
| `--font-display` | — | Fraunces |
| `--font-body` | — | Atkinson Hyperlegible |
| `--font-mono` | — | JetBrains Mono |
| `--font-size-fluid-base` | `clamp(1rem, 0.95rem + 0.25vw, 1.125rem)` | Base body |
| `--font-size-display-1` | `clamp(2.5rem, 1.8rem + 3.5vw, 4.5rem)` | Hero title |
| `--font-size-display-2` | `clamp(2rem, 1.5rem + 2.5vw, 3.25rem)` | Section title |
| `--font-size-display-3` | `clamp(1.5rem, 1.2rem + 1.5vw, 2.25rem)` | Sub-section title |
| `--font-size-heading-1` | `clamp(1.375rem, 1.2rem + 0.9vw, 1.75rem)` | Card title |
| `--font-size-heading-2` | `clamp(1.25rem, 1.1rem + 0.7vw, 1.5rem)` | Rule title |
| `--font-size-heading-3` | `clamp(1.125rem, 1.05rem + 0.4vw, 1.25rem)` | Small heading |
| `--font-size-body` | `var(--font-size-fluid-base)` | Body |
| `--font-size-body-sm` | `clamp(0.875rem, 0.85rem + 0.15vw, 0.9375rem)` | Secondary |
| `--font-size-caption` | `clamp(0.75rem, 0.72rem + 0.12vw, 0.8125rem)` | Captions, labels |
| `--line-height-tight` | `1.15` | Headings |
| `--line-height-base` | `1.6` | Body |
| `--line-height-relaxed` | `1.75` | Long-form lesson |
| `--letter-spacing-tight` | `-0.02em` | Display |
| `--letter-spacing-normal` | `0` | Body |
| `--letter-spacing-wide` | `0.08em` | Labels, kickers |

**Font files:** WOFF2 en `src/assets/fonts/`. `@font-face` en `boilerplate/fonts.css`, rutas CSS relativas. No CDN.

### 2.3 Spacing

8px scale defaults (template §2.3). `--space-1` `0.25rem` → `--space-10` `8rem`.

### 2.4 Section Dimensions

| Token | Value |
|---|---|
| `--container-max` | `72rem` (1160px) |
| `--container-padding` | `1.5rem` |
| `--header-height` | `4rem` |
| `--footer-height` | `auto` |

### 2.5 Motion

Template defaults (2.5). Adiciones: `--duration-step` `450ms` (pop de frames del stack).

### 2.6 Z-Index Scale

Template defaults (2.6).

---

## 3. COMPONENT INVENTORY

| Component | Status | CSS File | JS Module |
|---|---|---|---|
| TocNav (sticky, progreso) | ☐ Planned | `layout/header.css` | `js/layout/nav.js` |
| Hero | ☐ Planned | `components/hero.css` | — |
| CodeBlock (syntax colores) | ☐ Planned | `components/code-block.css` | — |
| StackDiagram (CSS frames) | ☐ Planned | `components/stack-diagram.css` | — |
| StackDemo (stepper interactivo) | ☐ Planned | `components/stack-demo.css` | `js/components/stack-demo.js` |
| RuleCard (4 reglas + spotlight) | ☐ Planned | `components/rule-card.css` | — |
| StrictToggle (normal/strict) | ☐ Planned | `components/strict-toggle.css` | `js/components/strict-toggle.js` |
| Callout (trampas comunes) | ☐ Planned | `components/callout.css` | — |
| CheatSheet (tabla resumen) | ☐ Planned | `components/cheat-sheet.css` | — |
| Footer | ☐ Planned | `layout/footer.css` | — |

---

## 4. CONTENT CONTRACT (es)

Sections in order, single page `index.html` (`lang="es"`):

1. **Hero** — premise + TOC anchors
2. **Contexto de Ejecución** — definición, call stack (diagrama CSS + stepper interactivo), fases creation/execution, hoisting
3. **`this` y las 4 reglas** — definición + **metáfora de la llamada telefónica** (`this` = quien contesta): reglas: default (llamada suelta → contesta la centralita global; estricto: nadie), implícita (`ana.saludar()` → contesta `ana`), explícita (`call`/`apply`/`bind` → contesta el objeto que pasas), `new` (línea nueva → contesta la instancia); prioridad `new` > explícita > implícita > default. Haz visual conservado (renombrado "contesta: X")
4. **Modo estricto vs normal** — `"use strict"`, side-by-side mismo código ambos modos, por qué strict protege
5. **Puente a la POO** — constructor functions pre-ES6, `prototype`, `this` = instancia, patrón `new` + `this`
6. **Clases ES6 y la POO moderna** — payoff del pre-ES6. Ejemplo completo reproducible: `class`/`constructor` (ES2015), campos públicos (ES2022), `#privados` (ES2022), método privado `#` (ES2022), `get` (ES5, en clase ES2015), `static` (ES2015), `extends`/`super` (ES2015), override; comentarios de versión en el código (`// class — ES2015 (ES6)`, `// #campo — ES2022`); tabla timeline feature→versión→año (`.sheet`); callout puente: clases = azúcar sobre `new`/`prototype`/`this` + spotlight "contesta: instancia"; enseñanza: `#` = privacidad real, `ana.#secreto` → `SyntaxError` en parse. **Sub-bloque "Las Arrow Functions y el POO"** — arrow `=>` (ES6): sin `this` propio (léxico, ignora las 4 reglas), no constructor (`new` → `TypeError`), `call`/`apply`/`bind` ignorados; método (`saludar() {}` → prototype, `this` por llamada) vs campo con Arrow Function (`saludar = () => {}` → **ventaja real: auto-bind**, `this` fijado al nacer, se pasa suelto a `setTimeout`/eventos sin `.bind()`; precio: copia por instancia, sin `prototype` compartido, `this` no dinámico); ejemplo con `setTimeout` + extracción; trampa: objeto literal `{ saluda: () => this }` captura el exterior, no el objeto
7. **Resumen (cheat sheet)** — 4 reglas + strict + errores comunes (`setTimeout`, extraer métodos, Arrow Function ignora `bind`); fila "Arrow Function (excepción)" en tabla 4 reglas (`this` léxico); cierre: "siguiente paso: TypeScript"

Code comments: Spanish. Interactive: stack stepper + strict toggle (2 únicos).

**Sintaxis de ejemplos:** `let`/`const` (moderna). Única excepción: demo de hoisting usa `var` (enseña el contraste). Fase Creación: `var` hoistea (inicializa `undefined`); `let`/`const` hoistean sin inicializar (TDZ → `ReferenceError`); enlazar con modo estricto (ambos combaten errores silenciosos).

**Ejemplos reproducibles:** cada bloque autocontenido — definiciones + llamadas + salida esperada en comentario (`// → ...`). Pegable en consola/Node sin editar. Caption: "pégalo en la consola".

**Cierre `.next-step`:** `class`/`constructor`/`super`/`new` en contraste AA sobre fondo `--color-primary` (base.css `code` = `--color-primary` → invisible. Fix: `.next-step code` con tinte claro).

---

## 5. ENFORCEMENT

Binding contract. `@code-review` rejects violations. Propose changes: `@orchestrator` → user approval → update.

---

*End of DESIGN.md.*