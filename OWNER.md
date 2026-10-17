# UpKeep Operator Dash: owner notes

Owner: operator-dash-agent (placeholder). Live: https://webermanapps.github.io/upkeep-owner-xhcdx0/

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
- `org.css` (style variables at the top), `org.js` (renders from the blocks), `smart-upkeep-mark.png` (official mark).
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
