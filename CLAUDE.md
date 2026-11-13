# CLAUDE.md: Own Two Feet website

Read this before changing anything in this repo.

## Astro move in progress (branch `astro`, started 2026-11-13)

The site is moving to Astro (approved by Marco). On this branch the old `index.html` is split into `src/layouts/Layout.astro`, `src/components/` (Symbols, Header, Footer, HelpChat) and `src/components/views/` (Home, Workshops, Activities, Story, Involved). The CSS is `src/styles/site.css`.

Since step 2 each view is its own page: `/` (Home), `/workshops/`, `/activities/` (the picker), `/activities/<id>/` (one page per activity, built from `src/pages/activities/[id].astro` with its Back link and Next card), `/story/` and `/get-involved/`. The old script is split into plain scripts in `public/js/` that share globals (no modules, no build step for them): `core.js` loads first on every page, then each page loads only its own files (`home.js`, `gl.js` for three.js, `form.js`, `workshops.js`, `story.js`, `activities.js`, and one file per activity), and `end.js` loads last (hash scrolling, help chat, scroll layer). `SITE` in JS is the site root (`/owntwofeet/`), read from `<html data-base>`. Activity names and card art live in `src/data/activities.js`; the interest form is one component (`InterestForm.astro`) placed on Home and Get Involved. Old one-page links (`/owntwofeet/#tools`, `#workshops`, `#ageTabs` and so on) still work: a small script in the Home head sends each old id to its new page, built from the page sources at build time. Flow test: `otf-tools/astroflow.mjs`; page-by-page compare with the old site: `otf-tools/astropages.mjs`. Manuals, privacy, 404, es.html, images and the sitemap are in `public/` unchanged. `npm run build` writes `dist/`, and `.github/workflows/deploy.yml` deploys it once pushed. Do not push until Marco says the whole move is done. Sections below that describe `index.html` as one file still describe the same code, now split into those files.

Since step 4 Home is short on purpose (Marco: "much less scrolling"): hero, four start cards (`.doors`: Workshops, Monthly plan, Activities, Manuals), the problem with a link to Story, eight topic tiles that open one panel below (`#cxTiles`, `#cxPanel`), a sideways row of the five activities (`#actRow`), four FAQs and the interest form. The founders quote band moved to Story and the class-period breakdown moved to Workshops (`#ses-h`); old links to them redirect. Keep new sections off Home: give them their own page and a start card or link.

## What this is

Own Two Feet plans to run **live, in-person life-skills workshops** for boys and young men (grades 3–8). Schools and community groups are the customers (counselors, youth leaders, churches, rec centers). Students are the end users. We bring the lesson plan, supplies and mentors; the host provides a room, students and an adult contact.

This replaced an older plan in our venture doc (selling a curriculum for staff to teach). **Do not bring back** apps, logins, an LMS or a backend. The one exception is the planned monthly online plan Marco added on 2026-11-13 (below); it is shown as planned only, with nothing to sign up for or pay yet.

Status: **in development, not running in the real world.** No workshops are running or booking, and there are no partner schools. We are not running pilots (nobody on the team has time to go to schools yet), so never ask visitors to host one. Planned prices, set by Marco on 2026-11-13 (lowered from $350/$500 after visitor feedback; the 90-minute dropped again from $350 to $300 the same day): **$200 per 50-minute workshop, $300 per 90-minute workshop, per session, up to 30 students, supplies included.** Monthly online plan (new activities and printable guides each month, run by the teacher): **$9.99 a month for a teacher, volunteer or community group leader who shows proof (school ID, a letter from their group) and says why the rate fits them; $19.99 a month for a team plan shared with up to two other teachers or staff.** Schools and groups serving low-income families get the first spots. The Workshops page shows the monthly plan right beside the workshops, and the home hero, FAQ, help chat and `es.html` mention it. Always shown as planned. Manuals: one free manual per topic, each its own page at `manuals/<topic>.html`, listed on the entry page `manuals/index.html` (linked from the nav, the topic panel, the FAQ and the footer). Seven are live (home-tools, tech, care, cook, money, comm, help); Vehicle basics shows "Coming later". A topic without a written manual shows "Coming soon" or "Coming later"; never link a manual that does not exist yet. The manual format is in `manuals/home-tools.html`: written to the student, three lessons, a quick check, numbered sources (government, university extension and safety nonprofits only, each verified), one screen at a time, prints clean.

Team: Dane, Jewell, Marco (Baylor ENT 3315 venture project). Marco owns the GitHub repo. The Story view has a "Who we are" section (`.team`, three `.member` cards) with only facts from the ENT 3315 Part 1 doc: Marco's from his own notes; Dane's and Jewell's from their interview sections (Dane: his father, Jayden S., an uncle, friends; Jewell: Joseph P., Shepherd S., Slade F., Steven S., Michan G., and the Steven S. interview is what pointed the team at schools and groups as purchasers). Each card is written differently on purpose; never pad them or make them match. Interview names stay first name plus last initial.

Spanish: `es.html` is a one-page version for parents and school staff in Mexican Spanish (what it is, for the parents panel, topics, planned prices, manuals note, interest form). It posts to the same Formspree form with the same field names and English option values, plus a hidden `idioma` field and its own `_subject`. Reached from a globe language switcher in the header of both pages (`<details class="lang">`: globe plus "EN"/"ES" on desktop, the globe alone on phones, a small English/Español menu; it works without scripts, and the script only closes it on an outside tap or Escape). Marco said a plain "Español" link in the nav looked lazy, so never put the language back in the nav. The footer keeps an "Español" link. `hreflang` links in both heads and in `sitemap.xml`. Manuals and activities stay in English for now and the page says so. The photo panels say "Photo coming" until real photos exist.

Other pages: `privacy.html` (what the form collects, Formspree, GoatCounter, localStorage, children, deletion; linked from the footer and under the form; update its "Last updated" date when it changes) and `404.html` (GitHub Pages serves it for missing links; `<base href="/owntwofeet/">` with a one-line script that switches to `/` on a custom domain). The published contact address is hello.owntwofeet@gmail.com (footer of index and es, privacy page). Marco's personal email never goes on the site.

## Hard rules

- **Only touch this repo** (`m-melchor/owntwofeet`). Never clone, edit or push to Marco's other repositories.
- **Never invent** testimonials, partners, impact stats, credentials, dates or prices. The only prices are Marco's planned ones above. Plans are labeled as plans ("Coming soon", "Preview", "Planned").
- **Keep the top notice exactly:** "Own Two Feet is in development. No workshops are running yet. Join our interest list for launch updates."
- **The form must never pretend to send.** It only shows the thank-you after Formspree answers OK; on any failure it shows an error and keeps the answers.
- **Keep the flyer in step.** The flyer artifact (https://claude.ai/artifact/PS8uVF8vZanzALs8fqxD5G) must say the same things as the site: status, prices, group size, manuals.
- **Interview quotes** are real, from our research (first name + last initial). Check with the team before adding or changing any.
- **Respectful framing.** Never present absent fathers or busy parents as failures. "A busy parent isn't a missing parent."
- **Safety.** No hazardous repair instructions (electrical, gas, etc.). Every topic includes when to stop and get an adult or a pro.

## Design rules (Marco's)

- **No long lists dumped on the landing page.** Use interactive pieces instead (tabs, sliders, one-at-a-time panels).
- Premium, production-level, friendly. **Must not look AI-generated.**
- Don't copy LifeReady Academy's exact colors, fonts or layout. Soft and friendly is the goal, but in our own style.
- Avoid: emoji, gradient washes, generic icon-card grids, "A · B · C" label chains, ALL-CAPS label spam, invented stats.
- No small labels above headings and no category chips. Chips are only for status (Planned, Coming soon, Coming later, Preview). Icons sit bare, not in circles.
- Progress marks are footprints (CSS masks `--print` and `--steps` in `:root`).
- On phones the Questions button stays off the first screen and tucks away while scrolling down, so it never covers text.

## Writing voice

Plain, friendly, how a real person talks. Short sentences. Say "topics," not "modules" or "curriculum." Say "mentors" or "our team," not "facilitators." Avoid stiff or salesy words: leverage, empower, seamless, holistic, journey, unlock, robust, ensure. Buttons say exactly what happens ("Join the Interest List").

## Design tokens (in `:root` at the top of `index.html`)

- Background `--bg #F6F4EF`, surface `#FFFFFF`, ink `--ink #16211C`
- Soft panels: sage `#D9E6D8`, mist `#DDE7F0`, sand `#F2E6D3`, butter `#F4EDCF`, peach `#F5E0D3`
- One accent: forest `--accent #2F6450`
- Fonts (Google Fonts): **Young Serif** for headings, **Geist** for body, **Geist Mono** for small labels
- Big rounded panels (`--r-lg: 32px`), pill buttons. Light theme only, on purpose.

## Logo

Round sage badge: white inner circle, two footprints with toes (left ink `#16211C`, right forest `#2F6450`), "OWN TWO FEET" around the top and "LIFE SKILLS · HANDS ON" around the bottom. It's inline SVG in the header, the footer and the chat. The favicon is a simplified feet-only version. Each SVG copy needs **unique ids** for its `textPath` paths.

## How `index.html` is built

One file, no build step. Sections in order: CSS → SVG tool symbols → notice → header → `<main>` with five views (`data-view="home|workshops|activities|story|involved"`) → footer → help chat → scripts.

- **Header:** the five nav links, the language switch and "Join the Interest List" sit on one line from 1000px up (tighter link spacing from 1000 to 1140). Below 1000 the header switches to the Menu button. Phones step the brand down at 380, 360 and 340 so the header stays one line with its 16px gutter down to 320. The Menu button never shrinks (it used to squeeze its icon to a dot).
- **Rows that scroll sideways** get swipe cues from `edgeArrows(row)`: a plain arrow just below the row (no background, no circle) that nudges right while more is hidden and flips to a left arrow at the end, a fade on the cut-off edge, and one peek the first time the row is on screen (skipped with reduced motion). Today only the activity row on Home (`#actRow`) needs it. Any new sideways row gets it too.
- **Dropdowns:** never show the browser's native select list. Up to about 6 choices, use a row of real radio buttons styled as `.check` (like the form's role step). The old `niceSelect` was removed with the role select in step 3 of the Astro move; a longer list needs a themed custom menu that fits and works at 320px.
- **sitemap.xml** lists every page with today's date; update `lastmod` when a page changes. There's no robots.txt on purpose: crawlers only read it at the root of m-melchor.github.io, which is a different repo. Submit the sitemap in Google Search Console instead.
- **Router:** hash-based. `#workshops` shows a view; `#tools`, `#interest`, etc. scroll to an id inside a view. Long jumps scroll instantly (smooth scrolling over long distances kept stopping partway on phones).
- **Script-built content is also prerendered** into the HTML (the first topic panel, the activity cards), so the page still shows everything when scripts are blocked. If you change the data arrays in JS (`MODS`, `TOOLS`, `BI`, `MS`, `PV`), update the matching prerendered HTML too, or re-run a prerender.
- **Workshops and Story views** are hand-built HTML (no data arrays): age tabs `#ageTabs` (panels stacked in one grid cell), Story interview row `#ivRow` (phone scroll-snap row with `#ivPrev`/`#ivNext`/`#ivCount`, 2x2 grid from 900px), commitments `#commits` (details on phones, all open and fixed from 900px). Wiring is in the "workshops age tabs" block after the quotes script. Test: `views2.mjs`.
- **Quotes** live only in the HTML: the dark band on the Story page (`.founders.solo`, wired in `story.js`) rotates Marco's mom plus the four interview quotes (`#vq .fq` figures, stacked in one grid cell so the band never changes height). Add or edit quotes there. Auto-rotation runs only while the band is at least half on screen, restarts its 8 s clock each time the band comes into view, and waits out any scroll before flipping (phones hold timers during a scroll, which used to make the quote change the moment the finger stopped). Prev/Next ends auto-rotation.
- **No-script fallback:** CSS under `html:not(.js)` shows all views stacked, makes the menu plain links, and shows a note telling people to open the file in a real browser.
- **3D:** three.js r128 from cdnjs, loaded on demand by `loadThree()` (a promise that injects the script once) so it never blocks the first paint: the hero calls it after the page scripts run, Tool Time calls it from `initBench()`. The hero camera auto-fits all six tools at any size (`fit()`), and tall frames switch to a 2-column layout. The Tool Time wall falls back to 2D SVG if WebGL fails or the script can't load.
- **Performance rules (Lighthouse 2026-10-26, gzip server: 85 / 100 / 100 / 100):** the `js` class goes on `<html>` from a one-line script in `<head>`, before any CSS, so the no-script layout never flashes and shifts (that shift was 0.22 CLS). Google Fonts load with `media="print" onload` plus a `<noscript>` copy. Headings never skip a level (the Curveball box and the footer columns are `h3`). The help button has `aria-label="Questions?"` because its word is hidden on narrow phones. Brand links carry no `aria-label`; the footer badge is `aria-hidden` with an `.sr-only` name. Measure on a server that compresses (localhost:8080 doesn't; GitHub Pages does): `npx serve -l 8081 .`
- **Motion:** scroll reveals and staggered entrances, word-by-word highlight in the Home problem heading, and a progress line at the top. All of it respects `prefers-reduced-motion`.
- **Help chat:** saved answers only (`A` object in the help chat script). Labeled "Not a live chat."
- **Form:** `src/components/InterestForm.astro` (Home and Get Involved) with `public/js/form.js`. Four steps, one open at a time (who you are, what fits, contact, note and send); a tap on a choice opens the next step, Back and Next move between them, and with no script every step shows. Step 2 shows only the choices that fit the role. A `data-pick` button (a plan or a path) pre-picks a step 2 choice, across pages through sessionStorage `otf-pick` (set in core.js). Formspree names stay: role, prefer, interest (set from prefer), name, email, org, msg, adult. After validation it `fetch`es `https://formspree.io/f/mgaaaeyp` (`Accept: application/json`), with a `_gotcha` honeypot. The form's `action` points at the same endpoint, so it still posts when scripts are blocked. To test without sending real signups, fake the Formspree response with Playwright's `page.route`.

- **Visit counter:** GoatCounter (free, no cookies) at `owntwofeet.goatcounter.com`, loaded in `<head>` with `no_onload`. `countVisit()` in the router counts each view once as `/home`, `/workshops`, etc. It doesn't count local file:// or localhost visits. Marco uses visits vs. sign-ups for his ENT 3315 Part 2A smoke test. `countEvent()` also records two events: `activity-done/<id>` when an activity finishes and `signup-sent` only after Formspree answers OK. Every page ends with a way to join the interest list (Activities picker band, practiced cards, Workshops and Story bands).

## Before every push, verify

Marco expects layout problems to be caught before he sees them.

- Check widths **1920, 1366, 1100, 940, 860, 390**: no sideways scroll, all six hero tools fully in frame, nothing clipped.
- Click every nav item, button and link. Each one should land on a visible section (no dead links).
- Mobile: the menu opens and closes, both "Join the Interest List" buttons reach the form, and the form validates.
- Activities: the `#activities` picker shows five cards and a collapsed "more on the way" list (`#previews` opens it); each activity is its own screen at `#tools`, `#budget`, `#scams`, `#call`, `#laundry` (router shows only that article, Back link on top, Next card at the bottom; the Tool Time 3D bench runs only on `#tools`). With scripts blocked, the picker, all five articles and the previews stack. Test scripts act1 to act5 (act5 covers the picker and screens). All four Tool Time modes (including Use it: tape and shelf; Pro or not deals 6 of the 12 situations in `PROP`, two per answer), the budget check through its curveball (one promise from `PRM` and four wants from `WNT` are dealt each play and on Reset; curveballs only name items that were dealt), Scam or Safe (with flag taps, the stamp and the phone reply) Make the Call (best path and all-wrong path; three scenarios in `CALLS`, a different one each play, each with its own week box, mood line and confirmation text) and Laundry Sort-Out (drag with a mouse, tap then tap on phones) all complete and reset. Test scripts for these live outside the repo (act1 to act5). On touch screens Laundry sorting is tap only, on purpose, so a swipe always scrolls the page. Each shows its "What you practiced" card, and the Done marks (localStorage `otf-done`) survive a reload.
- Scripts blocked: content still shows (test with JavaScript disabled).
- No console errors. Reduced-motion mode leaves nothing hidden.
