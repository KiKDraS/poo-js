---
name: html-css-best-practices
description:
  Semantic HTML5, CSS custom properties, responsive design, and performance
  optimization for web development
license: Apache-2.0
---

# HTML/CSS Best Practices Skill

## Purpose

This skill defines HTML and CSS best practices for building accessible,
performant, and maintainable web interfaces, specifically tailored for modular
development using Vite.

---

## Rules

### Semantic HTML5

**MUST USE:**

- `<header>` for site/page header
- `<nav>` for navigation menus
- `<main>` for main content (one per page)
- `<article>` for self-contained content
- `<section>` for thematic grouping
- `<aside>` for tangential content
- `<footer>` for site/page footer
- `<h1>-<h6>` in hierarchical order (don't skip levels)
- `<button>` for interactive actions
- `<a>` for navigation
- `<figure>` and `<figcaption>` for images with captions
- `<time datetime="">` for dates/times

**MUST NOT:**

- Use `<div>` when semantic element exists
- Use `<span>` for block-level content
- Skip heading levels (e.g., h1 → h3)
- Use `<br>` for spacing (use CSS)
- Use tables for layout (use CSS Grid/Flexbox)

### HTML Structure

**MUST:**

- Include `<!DOCTYPE html>`
- Set `lang` attribute on `<html>` element
- Include charset: `<meta charset="UTF-8">`
- Include viewport meta:
  `<meta name="viewport" content="width=device-width, initial-scale=1.0">`
- Use descriptive `<title>` (unique per page)
- Include meta description
- Close all tags properly
- Use lowercase for element names and attributes
- Quote all attribute values
- Validate HTML with W3C validator

**Example:**

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta
      name="description"
      content="Hack23 - Cybersecurity consulting with transparency"
    />
    <title>Hack23 - Cybersecurity Consulting</title>
  </head>
  <body>
    <header>
      <nav>...</nav>
    </header>
    <main>
      <article>...</article>
    </main>
    <footer>...</footer>
    <script type="module" src="/src/main.js"></script>
  </body>
</html>
```

### CSS Organization & Architecture

**MUST:**

- Separate CSS files strictly by responsibility inside `src/styles/` using the
  following architectural layers:
  1.  **Config/Tokens:** `variables.css` (Custom properties only)
  2.  **Boilerplate:** `reset.css` (Normalization) and `base.css` (Global
      defaults, HTML/Body element styling)
  3.  **Layout:** Layout structural elements (`layout/header.css`,
      `layout/main.css`, `layout/footer.css`)
  4.  **Components:** Standalone UI units (`components/button.css`,
      `components/card.css`, etc.)
  5.  **Utilities:** Single-purpose global modifiers (`utilities.css`)
- Use an entry point file `src/styles/main.css` that aggregates all modules
  using standard `@import` statements.
- Use CSS Nesting natively for structural scope hierarchy (see "CSS Nesting"
  subsection below for rules and examples).
- Use meaningful class names following a flat, component-scoped convention.
- Avoid `!important` (solve styling conflicts using CSS specificity or cascading
  order layers).
- Use shorthand properties where appropriate
- Comment complex sections

### CSS Nesting

CSS Nesting replaces flat selector repetition by colocating pseudo-classes,
pseudo-elements, media queries, and child selectors inside their parent block.
This eliminates selector duplication, improves readability, and enforces
structural scope.

**MUST nest the following inside their parent selector:**

- Pseudo-classes (`&:hover`, `&:focus-visible`, `&:nth-child()`, `&:not()`)
- Pseudo-elements (`&::before`, `&::after`)
- Media queries (`@media`) that modify the parent component at a breakpoint
- Child selectors that exist only as descendants of the parent

**MUST NOT:**

- Nest sibling components inside each other (e.g., `.header` rules inside
  `.footer`)
- Exceed 3 levels of nesting depth
- Nest unrelated selectors just to colocate them in the same file

**Before (flat repetition — REJECTED):**

```css
.card {
  padding: var(--space-md);
}
.card:hover {
  transform: translateY(-2px);
}
.card::after {
  content: "";
}
@media (min-width: 768px) {
  .card {
    padding: var(--space-lg);
  }
}
```

**After (nested — APPROVED):**

```css
.card {
  padding: var(--space-md);

  &:hover {
    transform: translateY(-2px);
  }

  &::after {
    content: "";
  }

  @media (min-width: 768px) {
    padding: var(--space-lg);
  }
}
```

**Parent-referencing suffix (`&` at the end):** When a child element needs
different styling based on a modifier on an ancestor, place `&` after the
ancestor selector:

```css
.badge {
  color: var(--color-text-muted);

  .card--featured & {
    color: var(--color-primary);
  }
}
```

### CSS Custom Properties (Variables)

**MUST USE for:**

- Colors (primary, secondary, backgrounds, text)
- Spacing (margins, padding multiples)
- Typography (font sizes, line heights)
- Breakpoints
- Transitions/animations
- Z-index values

**Benefits:**

- Easy theme switching
- Consistent values across site
- Easier maintenance
- Runtime updates possible

### Responsive Design

**MUST:**

- Design mobile-first (base styles for mobile, media queries for larger screens)
- Use relative units (`rem`, `em`, `%`, `vw`, `vh`) over fixed `px`
- Test at multiple breakpoints (320px, 768px, 1024px, 1440px+)
- Use CSS Grid or Flexbox for layouts
- Ensure touch targets are at least 44×44px
- Avoid horizontal scrolling
- Use `max-width` for readability (60-80 characters per line)

### Performance Optimization

**MUST:**

- Minimize CSS file size by avoiding dead styles.
- Rely on Vite + LightningCSS to minify, parse nesting, and handle vendor
  autoprefixing at build time.
- Avoid deep selector nesting (maximum 3 levels deep).
- Optimize images using asset pipelines (WebP format, native `loading="lazy"`).

### Browser Compatibility

**MUST:**

- Test in modern browsers (Chrome, Firefox, Safari, Edge)
- Use standard modern CSS features; let LightningCSS compile syntax regressions
  if fallback targets demand it.

---

## Examples

### Example 1: Semantic HTML Page Structure

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta
      name="description"
      content="Cybersecurity consulting services with transparent security practices"
    />
    <title>Services - Hack23 Cybersecurity Consulting</title>
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <header class="site-header container">
      <a href="index.html" class="logo">
        <img src="logo.svg" alt="Hack23 Logo" width="150" height="50" />
      </a>
      <nav aria-label="Main navigation">
        <ul class="nav-menu">
          <li><a href="index.html">Home</a></li>
          <li><a href="services.html" aria-current="page">Services</a></li>
          <li><a href="projects.html">Projects</a></li>
          <li><a href="blog.html">Blog</a></li>
        </ul>
      </nav>
    </header>

    <main class="main-content container">
      <article>
        <header>
          <h1>Cybersecurity Consulting Services</h1>
          <p class="lead">
            Transparent, effective security for modern organizations
          </p>
        </header>

        <section>
          <h2>Security Assessments</h2>
          <p>Comprehensive evaluation of your security posture...</p>
        </section>

        <section>
          <h2>Compliance Support</h2>
          <p>ISO 27001, GDPR, NIS2 compliance assistance...</p>
        </section>
      </article>

      <aside class="sidebar">
        <h2>Related Services</h2>
        <nav aria-label="Related services">
          <ul>
            <li><a href="penetration-testing.html">Penetration Testing</a></li>
            <li><a href="security-training.html">Security Training</a></li>
          </ul>
        </nav>
      </aside>
    </main>

    <footer class="site-footer container">
      <p>
        &copy; <time datetime="2025">2025</time> Hack23 AB. All rights reserved.
      </p>
      <nav aria-label="Footer navigation">
        <ul>
          <li><a href="privacy.html">Privacy Policy</a></li>
          <li><a href="accessibility.html">Accessibility</a></li>
        </ul>
      </nav>
    </footer>
  </body>
</html>
```

### Example 2: Modular CSS Architecture Split

Below is the directory map and contents breakdown demonstrating how stylesheets
must be separated by responsibility under `src/styles/`:

src/styles/ ├── layout/ │ ├── header.css │ ├── main.css │ └── footer.css ├──
components/ │ ├── button.css │ └── card.css ├── variables.css ├── reset.css ├──
base.css ├── utilities.css └── main.css

#### File: `src/styles/variables.css`

```css
:root {
  /* Colors */
  --color-primary: #2c3e50;
  --color-secondary: #3498db;
  --color-accent: #e74c3c;
  --color-text: #333;
  --color-text-light: #666;
  --color-bg: #ffffff;
  --color-bg-alt: #f8f9fa;
  --color-border: #dee2e6;

  /* Typography */
  --font-base: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  --font-size-base: 16px;
  --line-height-base: 1.6;
  --line-height-heading: 1.2;

  /* Spacing */
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;

  /* Layout tokens */
  --max-width: 1200px;
  --header-height: 80px;
  --z-sticky: 200;
}
```

#### File: `src/styles/reset.css`

```css
*,
*::before,
*::after {
  box-sizing: border-box;
}

body,
h1,
h2,
h3,
p,
ul,
figure {
  margin: 0;
  padding: 0;
}
```

#### File: `src/styles/base.css`

```css
html {
  font-size: var(--font-size-base);
  scroll-behavior: smooth;
}

body {
  font-family: var(--font-base);
  color: var(--color-text);
  background-color: var(--color-bg);
  line-height: var(--line-height-base);
  -webkit-font-smoothing: antialiased;
}

h1,
h2,
h3,
h4 {
  color: var(--color-primary);
  line-height: var(--line-height-heading);
  margin-bottom: var(--spacing-md);
}

a {
  color: var(--color-secondary);
  text-decoration: none;

  &:hover,
  &:focus {
    color: var(--color-accent);
  }
}
```

#### File: `src/styles/layout/main.css`

```css
.container {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 var(--spacing-md);

  @media (min-width: 768px) {
    padding: 0 var(--spacing-lg);
  }
}

.main-content {
  min-height: calc(100vh - var(--header-height) - 200px);
  padding: var(--spacing-xl) 0;
}
```

#### File: `src/styles/layout/header.css`

```css
.site-header {
  background-color: var(--color-primary);
  color: white;
  height: var(--header-height);
  display: flex;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: var(--z-sticky);
}
```

#### File: `src/styles/components/button.css`

```css
.button {
  display: inline-block;
  padding: var(--spacing-sm) var(--spacing-lg);
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover,
  &:focus {
    background-color: var(--color-secondary);
  }
}
```

#### File: `src/styles/utilities.css`

```css
.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.text-center {
  text-align: center;
}
```

#### Entry Point File: `src/styles/main.css`

```css
/* Config & Boilerplate Layers */
@import "./variables.css";
@import "./reset.css";
@import "./base.css";

/* Structural Layout Layers */
@import "./layout/main.css";
@import "./layout/header.css";
@import "./layout/footer.css";

/* Component Layers */
@import "./components/button.css";
@import "./components/card.css";

/* Utility Modifier Layers */
@import "./utilities.css";
```

---

## Performance Budget

- **CSS layer bundle size:** < 50KB (gzipped output post LightningCSS
  processing)

## Validation & Testing

- **Lighthouse:** Run audits in Chrome DevTools to check style budget and layout
  performance thresholds.
