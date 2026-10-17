# UpKeep Operator Dash: owner notes

Owner: operator-dash-agent (placeholder). Live: https://webermanapps.github.io/upkeep-owner-xhcdx0/

## Files
- `index.html`: the hub (Apps Home layout on the kit R106 header). Page-locked.
- `s/index.html`: one template for every section page, opened as `s/?id=<section id>`. Page-locked.
- `org.json`: ALL hub content: title, groups, the chief (Grok Bot 2), sections (name, job, status, kind, group, facts, links, shows, owner_agent) and the shared agents. Edit this to add, rename or move a section; no HTML change is needed.
- `requests.json`: Requested changes band (`items: [{text, owner, status}]`; set `placeholder` false once real).
- `todo.json`: To-Do items (not wired yet; the fold-down shows the empty state).
- `shelf.json`, `report.json`, `routines.json`, `projects.json` (+ copies in `s/`): kit data for decks, Morning Report, Routines and the Document Center. Pin documents only with `/workspace/ops/brand/pin_project.py`.
- `org.css` (style variables at the top), `org.js` (renders everything from the JSON), `smart-upkeep-mark.png` (official mark, from smartupkeep.ai icon-192.png).
- Deck counts come from the shared kit file `style-swipe/kit/deck-counts.json`, agent key `deck_agent` in org.json.

## Rules
- JSON/CSS/JS edits: commit and push. HTML edits: unlock in a `mkdir -m 700` dir, edit, lock with `/workspace/security/pagelock/lock_pages.py lock .`, check every `.html` is gated, then push. Never publish an unlocked page; never print the password.
- Data is TEST / Planned / Draft. Zero real members; never present it as traction.
- Light mode only, Khand + Hind, no emoji, no Thai or Thailand references (R110).
- Back links use the kit `data-mw-back` (R104: history first, else Apps Home).
- Don't edit kit files, submit.js or auth_filter.py.
