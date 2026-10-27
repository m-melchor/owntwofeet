# CLAUDE.md: Own Two Feet website

Read this before changing anything in this repo.

## What this is

Own Two Feet plans to run **live, in-person life-skills workshops** for boys and young men (grades 3–8). Schools and community groups are the customers (counselors, youth leaders, churches, rec centers). Students are the end users. We bring the lesson plan, supplies and mentors; the host provides a room, students and an adult contact.

This replaced an older plan in our venture doc (selling a curriculum for staff to teach). **Do not bring back** apps, logins, an LMS, subscriptions or a backend.

Status: **in development, not running in the real world.** No workshops are running or booking, and there are no partner schools. We are not running pilots (nobody on the team has time to go to schools yet), so never ask visitors to host one. Planned prices, set by Marco on 2026-10-25: **$350 per 50-minute workshop, $500 per 90-minute workshop, per session, up to 30 students, supplies included.** Always shown as planned. Manuals: one free manual per topic, each its own page at `manuals/<topic>.html`, listed on the entry page `manuals/index.html` (linked from the nav, the topic panel, the FAQ and the footer). Seven are live (home-tools, tech, care, cook, money, comm, help); Vehicle basics shows "Coming later". A topic without a written manual shows "Coming soon" or "Coming later"; never link a manual that does not exist yet. The manual format is in `manuals/home-tools.html`: written to the student, three lessons, a quick check, numbered sources (government, university extension and safety nonprofits only, each verified), one screen at a time, prints clean.

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
- **sitemap.xml** lists every page with today's date; update `lastmod` when a page changes. There's no robots.txt on purpose: crawlers only read it at the root of m-melchor.github.io, which is a different repo. Submit the sitemap in Google Search Console instead.
- **Router:** hash-based. `#workshops` shows a view; `#tools`, `#interest`, etc. scroll to an id inside a view. Long jumps scroll instantly (smooth scrolling over long distances kept stopping partway on phones).
- **Script-built content is also prerendered** into the HTML (topics, session bar, activities), so the page still shows everything when scripts are blocked. If you change the data arrays in JS (`MODS`, `SEG`, `TOOLS`, `BI`, `MS`, `PV`), update the matching prerendered HTML too, or re-run a prerender.
- **Workshops and Story views** are hand-built HTML (no data arrays): age tabs `#ageTabs` (panels stacked in one grid cell), Story interview row `#ivRow` (phone scroll-snap row with `#ivPrev`/`#ivNext`/`#ivCount`, 2x2 grid from 900px), commitments `#commits` (details on phones, all open and fixed from 900px). Wiring is in the "workshops age tabs" block after the quotes script. Test: `views2.mjs`.
- **Quotes** live only in the HTML: the dark "why we started" band on Home rotates Marco's mom plus the four interview quotes (`#vq .fq` figures, stacked in one grid cell so the band never changes height). Add or edit quotes there. Auto-rotation runs only while the band is at least half on screen, restarts its 8 s clock each time the band comes into view, and waits out any scroll before flipping (phones hold timers during a scroll, which used to make the quote change the moment the finger stopped). Prev/Next ends auto-rotation.
- **No-script fallback:** CSS under `html:not(.js)` shows all views stacked, makes the menu plain links, and shows a note telling people to open the file in a real browser.
- **3D:** three.js r128 from cdnjs, loaded on demand by `loadThree()` (a promise that injects the script once) so it never blocks the first paint: the hero calls it after the page scripts run, Tool Time calls it from `initBench()`. The hero camera auto-fits all six tools at any size (`fit()`), and tall frames switch to a 2-column layout. The Tool Time wall falls back to 2D SVG if WebGL fails or the script can't load.
- **Performance rules (Lighthouse 2026-10-26, gzip server: 85 / 100 / 100 / 100):** the `js` class goes on `<html>` from a one-line script in `<head>`, before any CSS, so the no-script layout never flashes and shifts (that shift was 0.22 CLS). Google Fonts load with `media="print" onload` plus a `<noscript>` copy. Headings never skip a level (the Curveball box and the footer columns are `h3`). The help button has `aria-label="Questions?"` because its word is hidden on narrow phones. Brand links carry no `aria-label`; the footer badge is `aria-hidden` with an `.sr-only` name. Measure on a server that compresses (localhost:8080 doesn't; GitHub Pages does): `npx serve -l 8081 .`
- **Motion:** scroll reveals and staggered entrances, word-by-word highlight in "Why it matters", the session section that stays put while you scroll through it (desktop only, over 900px), and a progress line at the top. All of it respects `prefers-reduced-motion`.
- **Help chat:** saved answers only (`A` object in the help chat script). Labeled "Not a live chat."
- **Form:** inline in `#formHolder`; JS moves it between the Home and Get Involved views. After validation it `fetch`es `https://formspree.io/f/mgaaaeyp` (`Accept: application/json`), with a `_gotcha` honeypot. The form's `action` points at the same endpoint, so it still posts when scripts are blocked. To test without sending real signups, fake the Formspree response with Playwright's `page.route`.

- **Visit counter:** GoatCounter (free, no cookies) at `owntwofeet.goatcounter.com`, loaded in `<head>` with `no_onload`. `countVisit()` in the router counts each view once as `/home`, `/workshops`, etc. It doesn't count local file:// or localhost visits. Marco uses visits vs. sign-ups for his ENT 3315 Part 2A smoke test. `countEvent()` also records two events: `activity-done/<id>` when an activity finishes and `signup-sent` only after Formspree answers OK. Every page ends with a way to join the interest list (Activities picker band, practiced cards, Workshops and Story bands).

## Before every push, verify

Marco expects layout problems to be caught before he sees them.

- Check widths **1920, 1366, 1100, 940, 860, 390**: no sideways scroll, all six hero tools fully in frame, nothing clipped.
- Click every nav item, button and link. Each one should land on a visible section (no dead links).
- Mobile: the menu opens and closes, both "Join the Interest List" buttons reach the form, and the form validates.
- Activities: the `#activities` picker shows five cards and a collapsed "more on the way" list (`#previews` opens it); each activity is its own screen at `#tools`, `#budget`, `#scams`, `#call`, `#laundry` (router shows only that article, Back link on top, Next card at the bottom; the Tool Time 3D bench runs only on `#tools`). With scripts blocked, the picker, all five articles and the previews stack. Test scripts act1 to act5 (act5 covers the picker and screens). All four Tool Time modes (including Use it: tape and shelf; Pro or not deals 6 of the 12 situations in `PROP`, two per answer), the budget check through its curveball (one promise from `PRM` and four wants from `WNT` are dealt each play and on Reset; curveballs only name items that were dealt), Scam or Safe (with flag taps, the stamp and the phone reply) Make the Call (best path and all-wrong path; three scenarios in `CALLS`, a different one each play, each with its own week box, mood line and confirmation text) and Laundry Sort-Out (drag with a mouse, tap then tap on phones) all complete and reset. Test scripts for these live outside the repo (act1 to act5). On touch screens Laundry sorting is tap only, on purpose, so a swipe always scrolls the page. Each shows its "What you practiced" card, and the Done marks (localStorage `otf-done`) survive a reload.
- Scripts blocked: content still shows (test with JavaScript disabled).
- No console errors. Reduced-motion mode leaves nothing hidden.
