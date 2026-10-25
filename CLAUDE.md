# CLAUDE.md: Own Two Feet website

Read this before changing anything in this repo.

## What this is

Own Two Feet runs **live, in-person life-skills workshops** for boys and young men (grades 3–8). Schools and community groups are the customers (counselors, youth leaders, churches, rec centers). Students are the end users. We bring the lesson plan, supplies and mentors; the host provides a room, students and an adult contact.

This replaced an older plan in our venture doc (selling a curriculum for staff to teach). **Do not bring back** apps, logins, an LMS, subscriptions or a backend.

Status: **in development.** No pilots running, no prices, no partner schools yet.

Team: Dane, Jewell, Marco (Baylor ENT 3315 venture project). Marco owns the GitHub repo.

## Hard rules

- **Only touch this repo** (`m-melchor/owntwofeet`). Never clone, edit or push to Marco's other repositories.
- **Never invent** testimonials, partners, impact stats, credentials, dates or prices. Plans are labeled as plans ("Coming soon", "Preview", "Planned").
- **Keep the top notice exactly:** "Own Two Feet is in development. Join our interest list for launch and pilot updates."
- **The form must never pretend to send.** It stays labeled as not connected until a real service is wired up.
- **Interview quotes** are real, from our research (first name + last initial). Check with the team before adding or changing any.
- **Respectful framing.** Never present absent fathers or busy parents as failures. "A busy parent isn't a missing parent."
- **Safety.** No hazardous repair instructions (electrical, gas, etc.). Every topic includes when to stop and get an adult or a pro.

## Design rules (Marco's)

- **No long lists dumped on the landing page.** Use interactive pieces instead (tabs, sliders, one-at-a-time panels).
- Premium, production-level, friendly. **Must not look AI-generated.**
- Don't copy LifeReady Academy's exact colors, fonts or layout. Soft and friendly is the goal, but in our own style.
- Avoid: emoji, gradient washes, generic icon-card grids, "A · B · C" label chains, ALL-CAPS label spam, invented stats.

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

- **Router:** hash-based. `#workshops` shows a view; `#tools`, `#interest`, etc. scroll to an id inside a view. Long jumps scroll instantly (smooth scrolling over long distances kept stopping partway on phones).
- **Script-built content is also prerendered** into the HTML (topics, session bar, quotes, activities), so the page still shows everything when scripts are blocked. If you change the data arrays in JS (`MODS`, `SEG`, `Q`, `TOOLS`, `BI`, `MS`, `PV`), update the matching prerendered HTML too, or re-run a prerender.
- **No-script fallback:** CSS under `html:not(.js)` shows all views stacked, makes the menu plain links, and shows a note telling people to open the file in a real browser.
- **3D:** three.js r128 from cdnjs. The hero camera auto-fits all six tools at any size (`fit()`), and tall frames switch to a 2-column layout. The Tool Time wall falls back to 2D SVG if WebGL fails.
- **Motion:** scroll reveals and staggered entrances, word-by-word highlight in "Why it matters", the session section that stays put while you scroll through it (desktop only, over 900px), and a progress line at the top. All of it respects `prefers-reduced-motion`.
- **Help chat:** saved answers only (`A` object in the help chat script). Labeled "Not a live chat."
- **Form:** inline in `#formHolder`; JS moves it between the Home and Get Involved views. Validation only; nothing is sent.

## Connecting the form (next step)

1. Create a Formspree form and get its endpoint (`https://formspree.io/f/xxxx`).
2. In the submit handler, after validation passes, `fetch` the endpoint with the form data (`Accept: application/json`).
3. Show "Sending…" while it runs, a real confirmation on success, and a clear error on failure.
4. Remove the "isn't hooked up yet" notes only after real submissions work.

## Before every push, verify

Marco expects layout problems to be caught before he sees them.

- Check widths **1920, 1366, 1100, 940, 860, 390**: no sideways scroll, all six hero tools fully in frame, nothing clipped.
- Click every nav item, button and link. Each one should land on a visible section (no dead links).
- Mobile: the menu opens and closes, both "Join the Interest List" buttons reach the form, and the form validates.
- Activities: all three Tool Time rounds, the budget check, and Scam or Safe all complete and reset.
- Scripts blocked: content still shows (test with JavaScript disabled).
- No console errors. Reduced-motion mode leaves nothing hidden.
