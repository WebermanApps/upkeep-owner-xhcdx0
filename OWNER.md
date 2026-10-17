# UpKeep Command Center: owner notes

Run by Ethan (UpKeep Operator, agent 6cc83bb6), who reports to UpKeep. Formerly "UpKeep Operator Dash". Live: https://webermanapps.github.io/upkeep-owner-xhcdx0/

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
- Light mode, Khand + Hind, no emoji, no Thai or Thailand references (R110). Back links use the kit `data-mw-back` (R104).
- Don't edit kit files, submit.js or auth_filter.py. Never publish an unlocked page.

## History note
Before Oct 17 2026 (22:xx ICT) the data was in plain `org.json`, `requests.json` and `todo.json`. They were removed with
git rm but remain in git history. They hold TEST and Forecast data only (no real member, customer or financial data).
