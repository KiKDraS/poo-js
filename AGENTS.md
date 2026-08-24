# Agent Context

Goal: **Landing Page** — vanilla HTML/CSS/JS + **Vite**.

## Tech Stack

Bund: Vite | Struct: HTML5 | Style: Native CSS (lightningcss) | Logic: JS (ES6+)

## Project Structure

Strict. No files outside schema.

```
src/
├── assets/{images, icons, fonts}
├── styles/{layout,components,boilerplate,main.css}
├── js/{layout,components,utils,main.js}
├── tests/{e2e,components}
├── public/{favicon,robots.txt}
├── DESIGN.md DESIGN.md.template   # DO NOT EDIT
├── index.html sitemap.xml playwright.config.js package.json
```

## Dev Rules by Owner

| Area                | Owner              | File                                  |
| ------------------- | ------------------ | ------------------------------------- |
| HTML+CSS+JS         | `@frontend-dev`    | `.opencode/agents/frontend-dev.md`    |
| Audit               | `@code-review`     | `.opencode/agents/code-review.md`     |
| Pipeline+QA+release | `@orchestrator`    | `.opencode/agents/orchestrator.md`    |
| PR+merge+tag        | `@release-manager` | `.opencode/agents/release-manager.md` |

**All agents respect:**

- CSS: `src/styles/main.css` only import. NOT from `src/main.js`.
- JS: `src/main.js`=init only. No DOM manipulate, no `DOMContentLoaded`.
- HTML: `<link rel="stylesheet" href="/src/styles/main.css">` head.
  `<script type="module" src="/src/main.js">` before `</body>`.
- Fonts: local `src/assets/fonts/`. No Google Fonts CDN. Relative CSS paths.
- Assets: `src/assets/` (Vite-processed). `public/` (as-is: favicon,
  robots.txt).

## Git Flow

**main**=prod. Merge from `release/*`/`hotfix/*` only. **develop**=daily integ.

| Type        | From→To       | Naming           |
| ----------- | ------------- | ---------------- |
| `feat/*`    | dev→dev       | `feature/name`   |
| `release/*` | dev→main+dev  | `release/vX.X.X` |
| `hotfix/*`  | main→main+dev | `hotfix/fix`     |

**All merges via PR.** `feat/*`→dev delete branch. `release/*`→main tag+GH
Release→back-merge dev. `hotfix/*`→main tag+GH Release→back-merge dev. Never
delete main/develop.

**Agent perms:**

1. `@frontend-dev`: code on `feature/*`+`hotfix/*`. Push only. No main/develop.
2. `@release-manager`: git write only (push/PR/merge/tag/delete). `gh`
   CLI→fallback `curl`+REST. Token: `.opencode/secrets/github-token`>git
   cred>`GITHUB_TOKEN`.
3. `@orchestrator`: decide merge/release. Delegate to `@release-manager`. User
   checkpoint before release branch/merge main.
4. Merge guard: merge develop only after `@code-review` `STATUS: APPROVED`+QA
   pass.
