# CLAUDE.md: Own Two Feet website

Read this before changing anything in this repo.

## What this is

Own Two Feet plans to run **live, in-person life-skills workshops** for boys and young men (grades 3–8). Schools and community groups are the customers (counselors, youth leaders, churches, rec centers). Students are the end users. We bring the lesson plan, supplies and mentors; the host provides a room, students and an adult contact.

This replaced an older plan in our venture doc (selling a curriculum for staff to teach). **Do not bring back** apps, logins, an LMS or a backend. The one exception is the planned monthly online plan Marco added on 2026-11-13 (below); it is shown as planned only, with nothing to sign up for or pay yet.

Status: **in development, not running in the real world.** No workshops are running or booking, and there are no partner schools. We are not running pilots (nobody on the team has time to go to schools yet), so never ask visitors to host one. Planned prices, set by Marco on 2026-11-13 (lowered from $350/$500 after visitor feedback; the 90-minute dropped again from $350 to $300 the same day): **$200 per 50-minute workshop, $300 per 90-minute workshop, per session, up to 30 students, supplies included.** Monthly online plan (new activities and printable guides each month, run by the teacher): **$9.99 a month for a teacher, volunteer or community group leader who shows proof (school ID, a letter from their group) and says why the rate fits them; $19.99 a month for a team plan shared with up to two other teachers or staff.** Schools and groups serving low-income families get the first spots. The Workshops page shows the monthly plan right beside the workshops, the Monthly plan page explains it, and the home hero, FAQ and help chat mention it. Always shown as planned.

Manuals: one free manual per topic, each its own page at `manuals/<topic>.html`, listed on `manuals/index.html` (linked from the nav, the topic panel, the FAQ and the footer). Seven are live (home-tools, tech, care, cook, money, comm, help); Vehicle basics shows "Coming later". A topic without a written manual shows "Coming soon" or "Coming later"; never link a manual that does not exist yet. The manual format: written to the student, three lessons, a quick check, numbered sources (government, university extension and safety nonprofits only, each verified), one screen at a time, prints clean.

Team: Dane, Jewell, Marco (Baylor ENT 3315 venture project). Jewell is a woman; never write the team as "the boys" or "guys". Marco owns the GitHub repo. The Story page has a "Who we are" section (`.team`, three `.member` cards) with only facts from the ENT 3315 Part 1 doc: Marco's from his own notes; Dane's and Jewell's from their interview sections (Dane: his father, Jayden S., an uncle, friends; Jewell: Joseph P., Shepherd S., Slade F., Steven S., Michan G., and the Steven S. interview is what pointed the team at schools and groups as purchasers). Each card is written differently on purpose; never pad them or make them match. Interview names stay first name plus last initial. The photo panels say "Photo coming" until real photos exist.

The published contact address is hello.owntwofeet@gmail.com (footer and privacy page). Marco's personal email never goes on the site.

## Hard rules

- **Only touch this repo** (`m-melchor/owntwofeet`). Never clone, edit or push to Marco's other repositories.
- **Never push or deploy without Marco's word.** A push to `main` goes live.
- **Never invent** testimonials, partners, impact stats, credentials, dates or prices. The only prices are Marco's planned ones above. Plans are labeled as plans ("Coming soon", "Preview", "Planned").
- **Keep the top notice exactly:** "Own Two Feet is in development. No workshops are running yet. Join our interest list for launch updates."
- **The form must never pretend to send.** It only shows the thank-you after Formspree answers OK; on any failure it shows an error and keeps the answers.
- **Keep the flyer in step.** The flyer artifact (https://claude.ai/artifact/PS8uVF8vZanzALs8fqxD5G) must say the same things as the site: status, prices, group size, manuals.
- **Interview quotes** are real, from our research (first name + last initial). Check with the team before adding or changing any.
- **Respectful framing.** Never present absent fathers or busy parents as failures. "A busy parent isn't a missing parent."
- **Safety.** No hazardous repair instructions (electrical, gas, etc.). Every topic includes when to stop and get an adult or a pro.
- **Both languages, always.** Every page and every word exists in English and Spanish. A change to one language is not done until the other has it too.

## Design rules (Marco's)

- **No long lists dumped on a page.** Use interactive pieces instead (tabs, sliders, one-at-a-time panels).
- Premium, production-level, friendly. **Must not look AI-generated.**
- Don't copy LifeReady Academy's exact colors, fonts or layout. Soft and friendly is the goal, but in our own style.
- Avoid: emoji, gradient washes, generic icon-card grids, "A · B · C" label chains, ALL-CAPS label spam, invented stats.
- No small labels above headings and no category chips. Chips are only for status (Planned, Coming soon, Coming later, Preview). Icons sit bare, not in circles.
- **Never the browser's native select list.** Up to about 6 choices, use a row of real radio buttons styled as `.check` (like the form's role step). A longer list needs a themed custom menu that fits and works at 320px.
- Light theme only, on purpose. Never follow the device's dark mode.
- Progress marks are footprints (CSS masks `--print` and `--steps` in `:root`).
- On phones the Questions button stays off the first screen and tucks away while scrolling down, so it never covers text.
- Home is short on purpose (Marco: "much less scrolling"). Keep new sections off Home: give them their own page and a start card or link.

## Writing voice

Plain, friendly, how a real person talks. Short sentences. No em dashes. Say "topics," not "modules" or "curriculum." Say "mentors" or "our team," not "facilitators." Avoid stiff or salesy words: leverage, empower, seamless, holistic, journey, unlock, robust, ensure. Buttons say exactly what happens ("Join the Interest List").

Spanish is Mexican Spanish: tú to students, usted to grown-ups, no Spanglish, no em dashes.

## Design tokens (`:root` at the top of `src/styles/site.css`)

- Background `--bg #F6F4EF`, surface `#FFFFFF`, ink `--ink #16211C`
- Soft panels: sage `#D9E6D8`, mist `#DDE7F0`, sand `#F2E6D3`, butter `#F4EDCF`, peach `#F5E0D3`
- One accent: forest `--accent #2F6450`
- Fonts: **Young Serif** for headings, **Geist** for body, **Geist Mono** for small labels. They come from `@fontsource` packages and are served from the site itself (imported at the top of `Layout.astro` and `Sub.astro`). No Google Fonts.
- Big rounded panels (`--r-lg: 32px`), pill buttons.

## Logo

Round sage badge: white inner circle, two footprints with toes (left ink `#16211C`, right forest `#2F6450`), "OWN TWO FEET" around the top and "LIFE SKILLS · HANDS ON" around the bottom. It's inline SVG in the header, the footer and the chat; the manuals, privacy and 404 pages use `Mark.astro`. The favicon is a simplified feet-only version. Each SVG copy needs **unique ids** for its `textPath` paths.

## How the site is built

Astro, static output. `npm run build` writes `dist/`. `astro.config.mjs` sets `base: '/owntwofeet'` (GitHub Pages serves the repo there) and `build.format: 'preserve'`, so `privacy.astro` writes `privacy.html` and `workshops/index.astro` writes `workshops/index.html`.

**Pages** (`src/pages/`): `/` (Home), `/workshops/`, `/monthly-plan/`, `/activities/` (the picker), `/activities/<id>/` (one page per activity from `activities/[id]/index.astro`, with a Back link and a Next card), `/story/`, `/get-involved/`, `/manuals/` and `/manuals/<slug>.html`, `/privacy.html` and `/404.html`. Each main page renders a view from `src/components/views/` inside `src/layouts/Layout.astro` (header, footer, help chat). Activities are `src/components/activities/`; their names and card art are in `src/data/activities.js`. The interest form is one component, `InterestForm.astro`, placed on Home and Get Involved.

**Manuals, privacy and 404** are content. Each manual is `src/content/manuals/en/<slug>.md` (frontmatter: name, description, mark id prefix, lesson screen names; the body is the page's HTML) built by `src/pages/manuals/[slug].astro`, with its art in `src/data/manual-art/<slug>.svg`, its CSS in `src/styles/manual.css` (scoped with `[data-m="slug"]`) and its screen script in `public/js/manual.js`. The manuals list, privacy and 404 bodies are `src/content/pages/en/*.md`. The collections are defined in `src/content.config.js`. These pages share `src/layouts/Sub.astro` (slim header with the badge and a Back link). To add a manual, add its .md (both languages) and .svg; never link a manual that does not exist.

**Spanish** is the whole site at `/es/` (Astro i18n, `prefixDefaultLocale: false`). `useT(Astro)` from `src/i18n/t.js` returns `{ t, lang, home }`: `home` is the site root for the page's language (use it for page links), `base` from `src/base.js` is for files. Words live in `src/i18n/en.json` and `es.json` (shared parts) plus one file per page or activity in `src/i18n/en/*.json` and `src/i18n/es/*.json`. `t('group.key')` stops the build on a missing key, so both languages must have every key. Spanish pages are thin wrappers in `src/pages/es/` that render the English page component. Spanish manuals are `src/content/manuals/es/<slug>.md` (same HTML as English; sources point to the agency's official Spanish page where one was verified, otherwise the English link is marked "(en inglés)"); a manual without an es file falls back to English. The manuals list, privacy and 404 have `src/content/pages/es/*.md`. Values sent to Formspree (role values, prefer keys) stay in code and stay English in every language; the Spanish form adds a hidden `idioma` field and its own `_subject`.

**Language switch:** a globe in the header (`<details class="lang">`: globe plus "EN"/"ES" on desktop, the globe alone on phones, a small English/Español menu; it works without scripts, and the script only closes it on an outside tap or Escape). It links each page to its twin (`twinPath` in `t.js`) and saves `otf-lang`; an English page sends a returning Spanish visitor to `/es/`. Marco said a plain "Español" link in the nav looked lazy, so never put the language back in the nav. The footer keeps a language link. Every page has `hreflang` links. `public/es.html` is the old Spanish address and only redirects to `/es/`.

**Scripts** are plain files in `public/js/` that share globals (no modules, not bundled). `core.js` loads first on every main page, then each page loads only its own files (`home.js`, `gl.js` for 3D, `form.js`, `workshops.js`, `story.js`, `activities.js`, one file per activity), and `end.js` loads last (hash scrolling, help chat, scroll layer). `SITE` is the site root for the page's language, read from `<html data-base>`. Words a script needs go out through `JsText.astro` as `<script type="application/json" id="txt-NAME">`, and `core.js` reads them with `TXT('NAME')` (with `{slot}` filling).

**Old links:** the site used to be one page with hash links. Old addresses (`/owntwofeet/#tools`, `#workshops`, `#ageTabs` and so on) still work: a small script in the Home head sends each old id to its new page, built from the page sources at build time.

- **Header:** the nav links, the language switch and "Join the Interest List" sit on one line from 1000px up (links never wrap; tighter link spacing from 1000 to 1280 and tighter still up to 1060, so the longer Spanish words fit). Below 1000 the header switches to the Menu button. Phones step the brand down at 380, 360 and 340 so the header stays one line with its 16px gutter down to 320. The Menu button never shrinks.
- **Home:** hero, four start cards (`.doors`: Workshops, Monthly plan, Activities, Manuals), the problem with a link to Story, eight topic tiles (`#cxTiles`) and one topic panel (`#cxPanel`): from 900px a side list with one topic open beside it; on phones a tile opens the topic as its own full-screen view (Back "All topics", count, Prev/Next and the manual button in a bar at the bottom; Back, Escape or the phone's back gesture closes it). Marco wants entry points that open their own view, never a long panel stacked under the tiles. a sideways row of the five activities (`#actRow`), four FAQs and the interest form.
- **Rows that scroll sideways** get swipe cues from `edgeArrows(row)`: a plain arrow just below the row (no background, no circle) that nudges right while more is hidden and flips to a left arrow at the end, a fade on the cut-off edge, and one peek the first time the row is on screen (skipped with reduced motion). Any new sideways row gets it too.
- **Script-built content is also in the HTML** (the first topic panel, the activity cards), so pages still show everything when scripts are blocked. If you change a list a script builds from (`MODS` in home.js, `TOOLS`, `PROP` in tools.js, `BI`, `PRM`, `WNT` in budget.js, `MS` in scams.js, `CALLS` in call.js, `PV` in activities.js), check the matching Astro markup and both languages' words.
- **Workshops and Story:** age tabs `#ageTabs` (panels stacked in one grid cell), the class-period breakdown `#ses-h`, Story interview row `#ivRow` (phone scroll-snap row with `#ivPrev`/`#ivNext`/`#ivCount`, 2x2 grid from 900px), commitments `#commits` (details on phones, all open from 900px).
- **Quotes** live only in the Story markup: the dark band (`.founders.solo`, wired in `story.js`) rotates Marco's mom plus the four interview quotes (`#vq .fq` figures, stacked in one grid cell so the band never changes height). Auto-rotation runs only while the band is at least half on screen, restarts its 8 s clock each time the band comes into view, and waits out any scroll before flipping. Prev/Next ends auto-rotation.
- **No-script fallback:** CSS under `html:not(.js)` shows the content plainly, makes the menu plain links, shows every form step and shows a short note. The `js` class goes on `<html>` from a one-line script in `<head>`, before any CSS, so the no-script layout never flashes and shifts.
- **3D:** three.js r128 from the `three@0.128.0` package, served from the site as a hashed file. Its address is on `<html data-three>`, and `loadThree()` in `gl.js` injects it once, on demand, so it never blocks the first paint: the Home hero calls it after the page scripts run, Tool Time calls it from `initBench()`. The hero camera auto-fits all six tools at any size, and tall frames switch to a 2-column layout. The Tool Time wall falls back to 2D SVG if WebGL fails or the script can't load.
- **Accessibility:** headings never skip a level. The help button has `aria-label="Questions?"` because its word is hidden on narrow phones. Brand links carry no `aria-label`; the footer badge is `aria-hidden` with an `.sr-only` name.
- **Motion:** scroll reveals and staggered entrances, word-by-word highlight in the Home problem heading, and a progress line at the top. All of it respects `prefers-reduced-motion`.
- **Help chat:** saved answers only. Labeled "Not a live chat."
- **Form:** `InterestForm.astro` with `public/js/form.js`. Four steps, one open at a time (who you are, what fits, contact, note and send); a tap on a choice opens the next step, Back and Next move between them, and with no script every step shows. Step 2 shows only the choices that fit the role. A `data-pick` button (a plan or a path) pre-picks a step 2 choice, across pages through sessionStorage `otf-pick`. Formspree names stay: role, prefer, interest (set from prefer), name, email, org, msg, adult. After validation it `fetch`es `https://formspree.io/f/mgaaaeyp` (`Accept: application/json`), with a `_gotcha` honeypot. The form's `action` points at the same endpoint, so it still posts when scripts are blocked. Never send real test signups; fake Formspree with Playwright's `page.route`, as the tests do.
- **Activities:** Tool Time (four modes, including Use it: tape and shelf; Pro or not deals 6 of the 12 situations in `PROP`, two per answer), Saturday on $25 (one promise from `PRM` and four wants from `WNT` are dealt each play and on Reset; curveballs only name items that were dealt), Scam or Safe (flag taps, the stamp, the phone reply), Make the Call (three scenarios in `CALLS`, a different one each play) and Laundry Sort-Out (drag with a mouse; on touch screens tap then tap, on purpose, so a swipe always scrolls the page). Each ends with its "What you practiced" card and a Next button, and the Done marks (localStorage `otf-done`) survive a reload.
- **Visit counter:** GoatCounter (free, no cookies) at `owntwofeet.goatcounter.com`, loaded in `<head>` with `no_onload`. `countVisit()` in `core.js` counts each page once. It doesn't count localhost visits. Marco uses visits vs. sign-ups for his ENT 3315 smoke test. `countEvent()` records `activity-done/<id>` when an activity finishes and `signup-sent` only after Formspree answers OK. Every page ends with a way to join the interest list.
- **Privacy page:** what the form collects, Formspree, GoatCounter, localStorage, children, deletion, and the services a page loads. Linked from the footer and under the form. Update its "Last updated" date (both languages) when it changes, and update it whenever the site starts loading something new from another service.
- **404:** GitHub Pages serves `404.html` for missing links; its `<base>` tag (from Astro's `base`) keeps its links on the site at any depth, and a missing address under `es/` swaps in the Spanish words.
- **sitemap.xml** (`public/`) lists every page in both languages, with the English and Spanish pages linked as translations. Update `lastmod` when a page changes; the tests fail if a page is missing from it. There's no robots.txt on purpose: crawlers only read it at the root of m-melchor.github.io, which is a different repo.

## Deploy

`.github/workflows/deploy.yml` builds with Astro and deploys `dist/` to GitHub Pages on every push to `main` (the repo's Pages source is GitHub Actions). Only with Marco's word.

## Before every push, verify

Marco expects layout problems to be caught before he sees them.

- Run `npm run check`. It builds the site and runs the Playwright tests in `tests/` in the installed Chrome (no browser download). They cover every page in both languages at 390 and 1366 (no console errors, no sideways scroll, nothing loaded from outside the site except GoatCounter), the sitemap, every internal link and `#target`, old one-page links, `es.html`, the language switch, the form (sent, Spanish tag, failed send keeps the answers), finishing activities, the Tool Time 3D bench, every manual screen, and content with scripts blocked. Astro allows one preview server, so the tests reuse one already running on port 5630.
- Then look at widths **1920, 1366, 1100, 940, 860, 390** headless: all six hero tools fully in frame, nothing clipped, header on one line.
- Play each activity through to its end once (the tests only check the finish card).
- Reduced-motion mode leaves nothing hidden.
