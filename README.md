![OpenCode Landing Page Header](https://capsule-render.vercel.app/api?type=waving&color=1e293b&height=200&section=header&text=OpenCode%20Landing%20Page&fontSize=42&fontColor=ffffff&fontAlignY=38)

![Version](https://img.shields.io/badge/version-1.4.0-blue?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen?style=flat-square)

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)
![Playwright](https://img.shields.io/badge/Playwright-2EAD33?style=flat-square&logo=playwright&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)

Vanilla HTML/CSS/JS landing page template powered by Vite for the OpenCode
multi-agent pipeline.  
WCAG 2.1 AA compliant, modular architecture, and zero framework lock-in.

---

## Setup

1.  **Create Repository:** Use the
    [GitHub Template](https://github.com/KiKDraS/opencode-landing-page-template/generate).
2.  **Clone & Install:**
    `git clone <your-repo> && cd <your-repo> && npm install && npm run setup`
3.  **Git Flow Setup:** `git checkout -b develop && git push -u origin develop`
4.  **Authenticate:** Run `opencode` then `/connect` → sign in at
    [opencode.ai/auth](https://opencode.ai/auth)
5.  **Development:** `npm run dev` → open `http://localhost:5173`

---

## Secrets & Authentication

Configure your local secrets in `.opencode/secrets/`. Files in this folder are
gitignored and read dynamically at runtime via `{file:path}`—no global
environment variables required.

| Secret / Token       | Setup Command                                       | Purpose & Notes                                                                                            |
| -------------------- | --------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| **Context7 API Key** | `echo "<key>" > .opencode/secrets/context7-api-key` | Required for live docs. Enable `"enabled": true` under `"context7"` in `opencode.json`.                    |
| **GitHub Token**     | `echo "<token>" > .opencode/secrets/github-token`   | Required by `@release-manager` for automated PRs. _(Fallback: Git credential helper → `GITHUB_TOKEN` env)_ |

---

## AI Agent Pipeline

| Agent                       | Role                                                       | Branch Scope                              |
| --------------------------- | ---------------------------------------------------------- | ----------------------------------------- |
| `orchestrator`              | Architecture planning, task delegation, release management | Global decisions (requires user approval) |
| `frontend-dev`              | Builds features across HTML, CSS, and JS layers            | `feature/*`, `hotfix/*`                   |
| `code-review`               | Audits code quality against checklist criteria             | Reviewer authority                        |
| `release-manager`           | Manages PRs, branches, merges, tags, and releases          | Remote Git execution                      |
| `playwright-test-planner`   | Explores UI and generates test plans in `specs/`           | Testing phase                             |
| `playwright-test-generator` | Converts test plans to executable `.spec.ts` files         | Testing phase                             |
| `playwright-test-healer`    | Executes tests, debugs, and auto-fixes failures            | Testing phase                             |

```mermaid
flowchart LR
    subgraph Test_Phase["Test"]
        direction LR
        TP["<i>Plan</i>"]
        TG["<i>Generates</i>"]
        TE["<i>Execute &amp; Self-Heal</i>"]
    end

    TP --> TG
    TG --> TE
    P[("Plan")] --> B["Build"]
    B --> A["Audit"]
    A -- REJECTED --> B
    A -- APPROVED --> TP
    TE --> S["Ship"]
    S -. "User Approval" .-> R>"Release"]
```

### Git Flow & Agent Governance

**All AI agents are policy-bound to follow Git Flow**—no direct commits to
`main` or `develop` are allowed, and all changes must go through Pull Requests.

Autonomous agents operate within strict authority boundaries across the
workflow:

- **`@frontend-dev`** — Confined to `feature/*` and `hotfix/*` branches for
  feature implementation and bug fixes.
- **`@code-review`** — Acts as a quality gate; blocks merges until code meets
  all checklist criteria (`APPROVED`).
- **`@orchestrator`** — Decides when to advance the pipeline or request a
  release (always requires explicit user approval).
- **`@release-manager`** — Exclusively handles remote Git lifecycle operations:
  PR creation, branch merges, version tagging, and post-merge branch cleanup.

---

## Integrations & Tooling

| Tool                                                              | Purpose                                                        | Configuration                        |
| ----------------------------------------------------------------- | -------------------------------------------------------------- | ------------------------------------ |
| **[Ponytail](https://github.com/DietrichGebert/ponytail)**        | Enforces minimal code diffs, YAGNI, and stdlib-first solutions | Pre-configured (`/ponytail`)         |
| **[Caveman](https://github.com/anthonystepvoy/caveman-opencode)** | Token-efficient ultra-compressed communication mode            | Active by default (`/caveman`)       |
| **[Codegraph](https://github.com/colbymchenry/codegraph)**        | SQLite codebase indexing for surgical AI context               | Indexed via `npm run setup`          |
| **[Playwright](https://playwright.dev)**                          | Browser automation, UI exploration, and self-healing tests     | Configured in `playwright.config.ts` |
| **[Context7](https://context7.com)**                              | Live documentation fetching for modern libraries               | Requires API key in secret file      |

---

## Troubleshooting

| Issue                                          | Solution                                                                    |
| ---------------------------------------------- | --------------------------------------------------------------------------- |
| `bad file reference: "{file:...}"`             | Ensure key is set: `echo "<your-key>" > .opencode/secrets/context7-api-key` |
| `opencode.json is not valid JSON`              | Validate syntax: `npx jsonlint opencode.json`                               |
| `browserType.launch: Executable doesn't exist` | Install browsers: `npm run setup`                                           |
| MCP server tool unavailable                    | Check `"enabled": true` in `opencode.json` and restart session              |
