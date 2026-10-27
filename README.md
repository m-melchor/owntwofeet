# Own Two Feet

Website for **Own Two Feet**, a planned service of live, in-person life-skills workshops for boys and young men in grades 3–8, run with schools and community groups. It's a student venture in development: no workshops are running or booking yet.

**Live site:** https://m-melchor.github.io/owntwofeet/

Built by Dane, Jewell and Marco (ENT 3315 venture project, Baylor University).

## What's here

| File | What it is |
|---|---|
| `index.html` | The whole site in one file: HTML, CSS and JavaScript |
| `privacy.html` | The privacy page: what the form collects, how visits are counted, how to ask for deletion |
| `es.html` | One-page Spanish version for parents and school staff, with its own copy of the interest form |
| `404.html` | The page GitHub Pages shows for a missing link, with buttons back to the site |
| `manuals/` | One free manual per topic, each its own page, listed on `manuals/index.html` |
| `sitemap.xml` | The list of pages for search engines, with the English and Spanish pages linked as translations |
| `.nojekyll` | Tells GitHub Pages to serve files as-is |
| `og-image.png` | The 1200x630 picture shown when the link is shared |
| `apple-touch-icon.png` | The icon for "Add to Home Screen" on iPhone |
| `CLAUDE.md` | Project notes and rules for Claude Code when editing this repo |
| `README.md` | This file |

## Pages on the site

- **Home**: hero with 3D tools and planned prices, why it matters, why we started (rotating quotes from Marco's mom and our interviews), topics explorer, session walkthrough, activity previews, FAQ, interest form
- **Workshops**: planned prices ($350 for 50 minutes, $500 for 90 minutes, per session, up to 30 students), age groups, who does what
- **Activities**: Tool Time (4 rounds, including reading a tape measure and leveling a shelf), Saturday on $25 (with a curveball and saving), Scam or Safe? (tap the red flags), Make the Call (reschedule an appointment by phone, three scenarios), Laundry Sort-Out (sort a pile, read care labels), plus coming-soon previews. The Activities page is a short picker of five cards (with a collapsed "more on the way" list); each activity opens on its own screen (#tools, #budget, #scams, #call, #laundry) with a Back link and a Next activity card. Finished activities are remembered on that device.
- **Our Story**: why we started, who we are, what we heard in interviews, what we believe
- **Get Involved**: ways to help and the interest form
- **Manuals** (`manuals/`): seven free topic manuals written to the student, with sources. Vehicle basics is coming later.
- **Privacy** (`privacy.html`): linked from the footer and from under the form.

There's also a "Questions?" help chat with saved answers. It isn't a live chat.

## Run it locally

No build step. Open `index.html` in Chrome, Safari or Edge, or serve the folder (for example `npx serve .`) so the manuals and privacy links resolve.

Phone previews (Files, Drive, Gmail) often block scripts. The site still shows everything in that case, but the menu, activities and 3D won't run. Open it in a real browser to test.

The 3D library (three.js from cdnjs) loads only when a page needs it, after the rest of the page has painted.

## Update the live site

1. Edit the files
2. Commit and push to `main`
3. GitHub Pages updates in about a minute

`404.html` assumes the site lives at `/owntwofeet/`. If the site ever moves to its own domain at the root, the small script at the top of that file switches its base path to `/` on its own.

## Not done yet

- **Team photos.** The Our Story team cards show "Photo coming" until we have real photos.
- **Vehicle basics manual.** The site says it's coming later.
- **Dates and partner schools** aren't set, so the site doesn't list any.

## Contact

hello.owntwofeet@gmail.com, shown in the footer and on the privacy page. Formspree notifications go to this address.

## Interest form

Signups go to [Formspree](https://formspree.io) (form `mgaaaeyp`) and arrive by email. The form shows "Sending…" while it runs, a thank-you on success, and an error that keeps the answers on failure. What we do with the answers is on `privacy.html`.

## Visit counts

[GoatCounter](https://www.goatcounter.com) counts visits without cookies or stored IP addresses. It doesn't count local or file:// visits.
