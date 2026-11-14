# Own Two Feet

Website for **Own Two Feet**, a planned service of live, in-person life-skills workshops for boys and young men in grades 3–8, run with schools and community groups. It's a student venture in development: no workshops are running or booking yet.

**Live site:** https://m-melchor.github.io/owntwofeet/ (Spanish: https://m-melchor.github.io/owntwofeet/es/)

Built by Dane, Jewell and Marco (ENT 3315 venture project, Baylor University).

## What's here

The site is built with [Astro](https://astro.build) into plain static pages.

| Path | What it is |
|---|---|
| `src/pages/` | One file per page. `src/pages/es/` holds the Spanish twins |
| `src/components/` | The page views, the five activities, the interest form, header, footer and help chat |
| `src/layouts/` | `Layout.astro` for the main pages, `Sub.astro` for the manuals, privacy and 404 |
| `src/content/` | The manuals and the privacy, 404 and manuals-list pages, in English and Spanish |
| `src/i18n/` | Every word on the site, in `en` and `es` files |
| `src/styles/` | The site's CSS |
| `src/data/` | Activity names and the manual and topic drawings |
| `public/js/` | The scripts that run in the browser (menu, activities, form, 3D, help chat) |
| `public/` | Files served as-is: `sitemap.xml`, `og-image.png`, `apple-touch-icon.png`, `.nojekyll`, and `es.html` (the old Spanish address, which sends visitors to `/es/`) |
| `tests/` | Playwright tests for the built site |
| `.github/workflows/deploy.yml` | Builds the site and publishes it to GitHub Pages |
| `CLAUDE.md` | Project notes and rules for Claude Code when editing this repo |

## Pages on the site

Every page exists in English and in Spanish (under `/es/`). A globe in the header switches languages and keeps you on the same page.

- **Home**: hero with 3D tools and planned prices, four start cards (Workshops, Monthly plan, Activities, Manuals), why it matters, a topics explorer, the activities, FAQ and the interest form
- **Workshops**: planned prices, in person ($200 for 50 minutes, $300 for 90 minutes, per session, up to 30 students) beside the monthly online plans ($9.99 a month for a teacher or volunteer with proof, $19.99 a month for a team of three), age groups, how a session runs, who does what
- **Monthly plan**: what the planned monthly online plan includes and who it's for
- **Activities**: a short picker of five cards, each opening its own page with a Back link and a Next activity card. Tool Time (4 rounds, including reading a tape measure and leveling a shelf), Saturday on $25 (with a curveball and saving), Scam or Safe? (tap the red flags), Make the Call (reschedule an appointment by phone, three scenarios), Laundry Sort-Out (sort a pile, read care labels), plus a collapsed "more on the way" list. Finished activities are remembered on that device.
- **Our Story**: why we started (rotating quotes from Marco's mom and our interviews), who we are, what we heard in interviews, what we believe
- **Get Involved**: ways to help and the interest form
- **Manuals**: seven free topic manuals written to the student, with sources. Vehicle basics is coming later.
- **Privacy**: linked from the footer and from under the form.

There's also a "Questions?" help chat with saved answers. It isn't a live chat.

Old links from when the site was one page (like `/owntwofeet/#tools`) still work and open the right page.

## Run it locally

You need [Node.js](https://nodejs.org) 22.23 or newer.

```
npm install
npm run dev
```

Then open http://localhost:4321/owntwofeet/.

| Command | What it does |
|---|---|
| `npm run dev` | Runs the site locally and reloads as you edit |
| `npm run build` | Builds the finished site into `dist/` |
| `npm run preview` | Serves the built `dist/` folder |
| `npm run check` | Builds, then runs every test |

The tests use the Chrome already installed on the computer. They check every page in both languages on a phone and a desktop width (no errors, no sideways scroll, nothing loaded from outside the site except the visit counter), every internal link, the old one-page links, the language switch, the interest form (with a fake Formspree, so no real signups), finishing activities, the 3D bench, the manuals, and that every page still shows its content with scripts blocked.

Fonts and the 3D library (three.js) come from npm packages and are served from the site itself. The 3D library loads only when a page needs it, after the rest of the page has painted.

Phone previews (Files, Drive, Gmail) often block scripts. The site still shows everything in that case, but the menu, activities and 3D won't run. Open it in a real browser to test.

## Update the live site

1. Edit the files, then run `npm run check`
2. Commit and push to `main`
3. GitHub Actions builds the site and publishes it to GitHub Pages in a couple of minutes (the repo's Pages source is set to GitHub Actions)

The site lives at `/owntwofeet/`, set by `base` in `astro.config.mjs`. If it ever moves to its own domain, change `base` there; every page, including the 404 page, follows it.

## Not done yet

- **Team photos.** The Our Story team cards show "Photo coming" until we have real photos.
- **Vehicle basics manual.** The site says it's coming later.
- **Dates and partner schools** aren't set, so the site doesn't list any.

## Contact

hello.owntwofeet@gmail.com, shown in the footer and on the privacy page. Formspree notifications go to this address.

## Interest form

Signups go to [Formspree](https://formspree.io) (form `mgaaaeyp`) and arrive by email. The form shows "Sending…" while it runs, a thank-you on success, and an error that keeps the answers on failure. Spanish signups are tagged so you can tell them apart. What we do with the answers is on the privacy page.

## Visit counts

[GoatCounter](https://www.goatcounter.com) counts visits without cookies or stored IP addresses. It doesn't count local visits.
