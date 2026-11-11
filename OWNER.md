# UpKeep Command Center: owner notes

Run by Ethan (UpKeep Operator, agent 6cc83bb6), who reports to UpKeep. Formerly "UpKeep Operator Dash". Live: https://webermanapps.github.io/upkeep-owner-xhcdx0/

## Gen 2 boards (Oct 19 2026)
The site root is now Ethan's UpKeep Command Center (Gen 2, built by Branding/Swatch): `index.html` + `assets/` (upkeep-board.css, board.js, icons).
Agent tiles open the sub-boards `members/`, `technicians/`, `tools-equipment/`, `scheduling/` (each `index.html` + `robots.txt` + `assets/`).
The Security tile is a non-link "Coming Soon" tile until the UpKeep Security board is live (add `"href"` to its entry in `board-data` then).
All board data is the inline `board-data` block inside each locked page (Temp Data). Sub-board back links go to this site's root.
Removed with the old hub: `ucc.css`, `ucc.js`, root `ethan-avatar.png` (now `assets/ethan-avatar.png`). The legacy section pages `s/`
(with `org.css`, `org.js`, root `smart-upkeep-mark.png`) stay; `tools/update_data.py` now edits only `s/index.html`.
The layout notes below describe the pre-Oct 19 hub.

## Layout (matches Apps Home one for one, Oct 17 2026)
`index.html` (locked) renders in this order: header bar (Smart Upkeep mark, UPKEEP COMMAND CENTER, Max Weberman, Updated time from org-data) ->
title + subtitle -> top band of three (Requested changes in Apps Home's verified-strip slot `<!--mw-vc--> details#vc-strip.vc` from requests-data;
Deck Building link; UpKeep Decks Today, an honest placeholder with no number) -> top card `a.gb` for Ethan (img.gbi `ethan-avatar.png`, span.gbn "Ethan",
"UpKeep Operator · Command Center", role line) -> Morning Report, To-Do, Document Center, Ready Decks shelf -> boards: one card per section in
the four groups (tabs on phone, columns on wider screens), each opening `s/?id=<section>` -> Org Chart fold `details#org-chart`
(Ethan on top, the 10 sections in `details.oc-g>ul`, UpKeep Security under "Reports directly to Ethan"; every card is `.oc-b` with `.oc-nm` and `.oc-t`)
-> Routines -> footer (Built by Machan, no Share).
`ucc.js` renders band text, boards and org chart from the inline blocks synchronously, so a later `<!--mw-glow-->` block (Apps Home glow.py
markup) can be appended before `</body>`. Agent name strings: "Ethan" and "UpKeep Security". Section cards have no glow hook (`.snm`, not `.nm`).
`ucc.css` holds the look. `org.js`/`org.css` now serve only the section pages in `s/`.
Display only: no submit.js, no chat, no send or Pause buttons, no fetch or storage in page code (the kit shelf, routines and projects scripts load their own JSON stubs).

## Where the data lives
All hub data is INSIDE the locked pages, encrypted with them (Security, Oct 17 2026). Each of `index.html` and
`s/index.html` carries the same three inline blocks:
- `org-data`: title, lanes (groups), chief, the 10 sections (name, job, status, kind, group, kpi, facts, links, shows, owner_agent), shared agents, company KPIs.
- `requests-data`: Requested changes band (`items: [{text, owner, status}]`, `placeholder`).
- `todo-data`: To-Do items (not rendered yet).
`org.js` reads these blocks; it never fetches data files. There are no plaintext data files in the repo.

## The only way to update data: tools/update_data.py
```
python3 tools/update_data.py show org-data            # print current JSON (keep private)
mkdir -m 700 -p /workspace/wt/upkeep-owner-edit      # your working dir, never /tmp, never the repo
python3 tools/update_data.py show org-data > /workspace/wt/upkeep-owner-edit/org.json
# edit that file, then:
python3 tools/update_data.py set org-data /workspace/wt/upkeep-owner-edit/org.json
shred -u /workspace/wt/upkeep-owner-edit/org.json
python3 tools/update_data.py check
git add index.html s/index.html && git -c user.name=<you> -c user.email=<you>@users.noreply.github.com commit -m "..." && git push
```
`set` copies the locked pages into a `mkdir -m 700` dir under /workspace/wt/upkeep-owner-tmp, unlocks there with
`/workspace/security/pagelock/lock_pages.py` (same password as before; never printed), replaces the block in both pages,
relocks, copies the locked pages back, runs `lock_pages.py check`, and shreds the temp copies with `shred -u`.
It never writes plaintext into the repo. Sync with `git pull --rebase --autostash`; add only your files.

## Other files
- `ucc.css` + `ucc.js` (hub), `org.css` + `org.js` (section pages), `ethan-avatar.png` (128px, from the UpKeep 2 avatar), `smart-upkeep-mark.png` (official mark).
- `shelf.json`, `report.json`, `routines.json`, `projects.json` (+ copies in `s/`): empty kit stubs the shared kit fetches
  (decks, Morning Report, Routines, Document Center). Pin documents only with `/workspace/ops/brand/pin_project.py` (encrypted .enc).
- Deck counts come from the shared kit file `style-swipe/kit/deck-counts.json` (agent key `deck_agent` in org-data).

## Rules
- Data is TEST / Forecast / Draft / Planned / Decided. Zero real members; never present it as traction; never mix TEST and Forecast in one number.
- Light mode, Khand + Hind, no emoji, no home-country or locale references (R110). Back links use the kit `data-mw-back` (R104).
- Don't edit kit files, submit.js or auth_filter.py. Never publish an unlocked page.

## History note
Before Oct 17 2026 (22:xx ICT) the data was in plain `org.json`, `requests.json` and `todo.json`. They were removed with
git rm but remain in git history. They hold TEST and Forecast data only (no real member, customer or financial data).

## uk11f (Oct 20 2026, UpKeep Develop): Machan's Command Center deck picks
- Deep slate mission-control theme on all 5 boards (assets/mc-dark.css generated by /workspace/ops/upkeep-board-data/uk11f/darken.py from the kit + board css; assets/mc.css).
- Shared mission header (assets/mc-head.js): callsign, mission clock (ICT) + TEST sim date, flat status light bars, tab row board switcher.
- Root = mission grid (assets/mc.js): panels drag by title bar and resize from a bottom corner at >=1100px; layout saved in localStorage `ukcc-layout-uk11f` (Reset layout button). Locked Ping Log (UK-YYYYMMDD-NN, Open / In progress / Done).
- Boards: Swatch's uk12 renderer (uk11 picks) + Ping Log columns + sortable van stock. Data still test-2026-10-19c. Build: build_uk11f.py.

## uk11g (Oct 28 2026, Machan): six-panel dark-shell Command Center
- No section drag/resize; legacy `ukcc-layout-uk11f` cleared on load; Reset layout removed.
- Keep only: Members (top-left), Technicians, Scheduling, Tools & Equipment, Marketing (placeholder tile), Ping Log.
- Dark/black chrome + light cream tile interiors (`assets/mc.css`). Cache tag `uk11g`.
- Source of truth still `/workspace/ops/upkeep-board-data/uk11f/` (`build_uk11f.py`, now idempotent on already-uk11f boards). Data unchanged test-2026-10-19c. Relocked.

## uk11h (Oct 28 2026 evening, Machan): MacBook-fit tile polish
- No header Needs Machan band (per-section only when relevant).
- MacBook viewport fit: 6-row grid (3+3 panels), denser cream tiles, viewport-scaled `--rowh`.
- Members (v7bucs): 4 metric pills · Needs OFF · open messages list · 4 then more.
- Technicians (u3tf3p): metrics · clear green Needs · stop bars per TD · folds when clear.
- Scheduling (hqq4gd): metrics · green clear Needs · separate Scheduling Requests · 4 then more.
- Tools: per-van (Van #1/#2/#3) + At the Shop (freewrite / 9o9eqp framing; remake picks pending).
- Marketing: summary placeholder (18vb3b still open).
- Ping Log (l8sm55): always-expanded compact table · team tabs · 5 rows before scroll · quiet chevron.
- Still waiting: Color Tone 7bj9b4, Appearance b54c65, Marketing Tile 18vb3b, Tools remake picks 9o9eqp.
- Dark shell + light tiles unchanged. Data test-2026-10-19c. Relocked.

## uk11i (Oct 28 2026 night, Machan): light-warm / soft-slate shell bake
- Shell r8tml5: light-warm cream/soft-slate page chrome (NOT deep dark); soft slate header middle; high-contrast white tiles; plain light-warm over parchment; neither mist/lagoon.
- Visual 9z4q38: softer shell blend · inset cream chrome · stronger left accents · soft lift · moderate titles · slight internal padding; keep MacBook 6-fit (z7cble tight beats roomier).
- Function z7cble: Header Open only · Early KPI placeholders on Marketing · Ping Log keeps important metrics (no collapse-to-3) · Needs only when items exist (no empty Needs headers).
- Left open / not baked: Light Dashboard bozbb8, Color Tone 7bj9b4, Appearance b54c65, Marketing 18vb3b, Tools 9o9eqp.
- Tile content from uk11h (v7bucs/u3tf3p/hqq4gd/l8sm55 + Tools vans+shop) preserved.

## uk11j (Nov 2 2026, Machan): Members, Scheduling, Financial, side Ping Log
- EXAMPLE DATA. New inline `#ccm-data` block in root `index.html` (20 members, ~255 visits, 12 conversations, 6 pending requests, ~60 pings, financials); dates are day offsets resolved against America/Detroit "today".
- Members demo list cut to 20 in `members/index.html` board-data; the other 80 are archived in the `#members-archive` JSON block in the same locked page (not rendered). Restore by appending them to board-data.members.
- `assets/ccm.js` + `assets/ccm.css`: Members 4 tiles (Active Members, Visits This Month, Messages, Pending Requests) with sortable pop-up lists, Messages list + chat (replies in localStorage `ccm-demo-uk11j`, logged to Ping Log), Scheduling 4 tiles + calendar, Financial tiles, Tools Order Approval, Ping Log as a fixed right column on desktop (collapsible on phone), white header for WCAG AA contrast.
- Footers: plain "Built by Machan", no link. Cache tag `uk11j`.

## uk11k (Nov 2 2026, Machan): Member Summary + polish
- Active Members list: names open a Member Summary (overview, Systems from Home Record, Visit History, Messages, Pending Requests, Billing) with Back.
- Header date is today's real date in Detroit time (mc-head.js). Members tiles 2x2 on desktop.
- Stock demo: Inventory yellow (gear.shop), Van 1 green, Van 2 red; Order Approval orders are built from those flagged items.
- Financial: 4 tiles (Monthly Revenue, Avg Rev/Member, Cash On Hand, Profit), each with a pop-up. Cache tag `uk11k`.

## uk11l (Nov 2 2026, Machan): Scheduling calendar main display
- Scheduling: month calendar always visible under the 4 tiles (dots/days clickable); Scheduling Requests is a collapsed dropdown, yellow header with count badge when 1+ (green at 0).
- Tools: stock names Title Case; Below Min stat from current data (2, Van 2). Van and At The Shop (Inventory) headers open full grouped, searchable lists (gear.shop_full).
- Board tab bar hidden on the main page only (inline style); sub-boards unchanged. Cache tag `uk11l`.

## v2 preview (Nov 2 2026, Machan): simplicity-first redesign at /v2/ (locked, same password, not linked anywhere)
- `v2/index.html` (locked; same ccm-data + mc-data blocks), `v2/ccm.js` (copy of assets/ccm.js with extra exports), `v2/app.js` (section template: title, 4 tiles, main view, dropdowns), `v2/ccm.css`, `v2/app.css`. Main page unchanged.

## uk11m (Nov 2 2026, Machan): Warm List tracker (main + v2)
- REAL personal data: the 18 homes live ONLY in the locked `#warm-data` block of `index.html` and `v2/index.html` (name, relationship, city or TBD; no street addresses). Source: /workspace/upkeep/warm-list/list.txt (private). Never add a plaintext copy.
- `assets/warm.js` + `warm.css` (copies in v2/): 4 tiles (Sent, Interested, Booked Scan, Member; cumulative), table with status, content ticks, next step, add, delete, Delete All, Restore. Edits in localStorage `ccm-warm-v1`.
- v2 desktop sizing matched to the main page (v2b). Cache tags uk11m / v2b.

## Nov 9 2026
The legacy `/s/` section pages were taken down (Machan, 10:22 PM ICT): `s/`, `org.js`, `org.css` and `tools/update_data.py` deleted. Notes above about `s/`, `org.js` and `update_data.py` are historical.

- Header typography (Nov 11 2026, Swatch call after Machan: "command center header can be up to you"): mission header uses brand fonts — Khand for the title, Hind for body and meta, `font-variant-numeric: tabular-nums` on figures. Leftover Inter / JetBrains Mono removed app-wide (CSS vars, header exception, Google Fonts links). Light header, existing layout, and the unlinked 'Built by Machan' footer are unchanged. Cache tag `cc1t`.

- Header QA r2 (Nov 11 2026, Swatch FAIL on PR #10): launch countdown uses tabular-nums; board headers stay one row at 1280 with the date and clock packed to the right edge; under 560px the header shows a short Khand title (Command Center, Members, Scheduling, Technicians, Tools And Equipment) instead of hiding the title, and the active board tab scrolls into view; Hind 700 is loaded so the UPK code is not fake-bold; dead near-white clock colours removed; board fold labels are Title Case (Member Messages, Open Questions). Cache tag `cc1u`.
