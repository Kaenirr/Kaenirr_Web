# Kaenirr — Portfolio

Personal portfolio site. Static, dark/light themed, deployed to GitHub Pages on a custom domain.

**Stack:** [Astro](https://astro.build) + TypeScript · zero client JS by default (only a small theme toggle, card tilt, and skill toast ship to the browser) · vanilla CSS with custom properties · Playwright for e2e.

## Develop

```bash
npm install
npm run dev      # dev server at http://localhost:4321
```

| Script            | Does                                  |
| ----------------- | ------------------------------------- |
| `npm run dev`     | Dev server with hot reload            |
| `npm run build`   | Static build to `dist/`               |
| `npm run preview` | Serve the built site locally          |
| `npm run check`   | Astro + TypeScript diagnostics        |
| `npm test`        | Playwright e2e suite                  |

First test run needs the browser once: `npx playwright install chromium`.

## Structure

```
src/
  layouts/Layout.astro       # page shell, <head>, theme bootstrap, mounts NavBar + SkillToast
  components/
    NavBar.astro             # name (→ home) · center links · theme toggle
    ThemeToggle.astro        # flips data-theme, persists to localStorage
    ProjectCard.astro        # project card (overlay link + clickable skill tags)
    SkillTag.astro           # one skill pill — clickable if it maps to a registered skill
    SkillToast.astro         # global popup; any [data-skill] opens it, no navigation
  pages/
    index.astro              # hero + four section buttons
    skills.astro             # searchable grid of skills
    experience.astro         # vertical timeline, sorted newest-first
    projects.astro           # project grid
    contact.astro            # contact methods (email, GitHub, LinkedIn)
  data/skills.ts             # single source of truth for skills
  nav.ts                     # nav items + site name
  scripts/tilt.ts            # cursor tilt + underglow for [data-tilt] cards
  styles/theme.css           # color tokens + shared .glow-card utilities
public/                      # static assets served as-is (favicon.png, CNAME)
```

## Editing content

- **Skills** — edit [`src/data/skills.ts`](src/data/skills.ts). Each skill has an `id`, `name`, `category`, `description`.
- **Skill tags** — anywhere (experience, projects) a tag value that matches a skill `id` becomes clickable and opens the skill toast; any other value renders as a plain pill. Add new clickable skills by adding them to `skills.ts`.
- **Experience** — edit the `entries` array in [`src/pages/experience.astro`](src/pages/experience.astro). Use `start`/`end` as `"YYYY-MM"`; set `end: null` for a current role. Entries sort newest-first automatically.
- **Projects** — edit the `projects` array in [`src/pages/projects.astro`](src/pages/projects.astro).
- **Nav / name** — [`src/nav.ts`](src/nav.ts).
- **Theme colors** — the `:root` and `[data-theme="dark"]` token blocks in [`src/styles/theme.css`](src/styles/theme.css). Components only reference `var(--…)`.
- **Contact** — edit the `methods` array in [`src/pages/contact.astro`](src/pages/contact.astro) (email, GitHub, LinkedIn links).

## Theming

Colors are CSS custom properties. The active theme is stored in `localStorage` (`theme`), defaulting to the OS preference, and is applied by a blocking inline script in `<head>` before first paint to avoid a flash of the wrong theme.

## Deploy

Pushing to `main` triggers [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml): it runs the Playwright suite, builds with Astro, and publishes to GitHub Pages. A red test run blocks the deploy.

One-time setup:

1. Repo **Settings → Pages → Source = "GitHub Actions"**.
2. Custom domain: `site` is set in [`astro.config.mjs`](astro.config.mjs) and `public/CNAME` holds `kaenirr.com` — point the domain's DNS at GitHub Pages.
