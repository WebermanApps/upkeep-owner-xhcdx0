#!/usr/bin/env python3
"""UpKeep Operator Dash data tool. The data lives ONLY inside the locked pages as
<script type="application/json" id="..."> blocks (org-data, requests-data, todo-data), in
s/index.html (the legacy section pages; since Oct 19 2026 the root index.html is the Gen 2 board). Never write plaintext into the repo.

Usage (run from anywhere):
  update_data.py show <block>               print one block's JSON (data is TEST/Forecast; keep output private)
  update_data.py set  <block> <file.json>   replace a block from a JSON file kept in a mkdir -m 700 dir under /workspace
  update_data.py check                      verify both pages are locked and carry all blocks
Blocks: org-data, requests-data, todo-data.
Flow: copy locked pages into a mkdir -m 700 dir under /workspace, unlock there, edit, relock there,
copy the locked pages back, run lock_pages.py check on the repo, shred -u the temp copies.
Commit/push is left to the caller (git add s/index.html only)."""
import json, os, re, shutil, subprocess, sys, tempfile
REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PL = "/workspace/security/pagelock/lock_pages.py"
PAGES = ["s/index.html"]  # Oct 19 2026: root index.html is now the Gen 2 Ethan board (board-data block, no org-data)
BLOCKS = ["org-data", "requests-data", "todo-data"]
TMPROOT = "/workspace/wt/upkeep-owner-tmp"

def jblock(i, data):
    return f'<script type="application/json" id="{i}">' + json.dumps(data, ensure_ascii=False, separators=(",", ":")).replace("</", "<\\/") + "</script>"

def run(*c): subprocess.run(list(c), check=True, stdout=subprocess.DEVNULL)

def tempdir():
    os.makedirs(TMPROOT, mode=0o700, exist_ok=True); os.chmod(TMPROOT, 0o700)
    d = tempfile.mkdtemp(prefix="ud-", dir=TMPROOT); os.chmod(d, 0o700); return d

def shred(d):
    for root, _, files in os.walk(d):
        for f in files: subprocess.run(["shred", "-u", os.path.join(root, f)], check=False)
    shutil.rmtree(d, ignore_errors=True)

def unlocked_copy():
    d = tempdir()
    for p in PAGES:
        os.makedirs(os.path.join(d, os.path.dirname(p)), mode=0o700, exist_ok=True)
        shutil.copy(os.path.join(REPO, p), os.path.join(d, p))
    run("python3", PL, "unlock", d); return d

def get(t, i):
    m = re.search(rf'<script type="application/json" id="{i}">(.*?)</script>', t, re.S)
    if not m: raise SystemExit(f"{i} block missing")
    return json.loads(m.group(1).replace("<\\/", "</"))

def check():
    for p in PAGES:
        t = open(os.path.join(REPO, p)).read()
        if "const D=" not in t: raise SystemExit(f"UNLOCKED {p}")
        if 'type="application/json"' in t: raise SystemExit(f"plaintext block in {p}")
    run("python3", PL, "check", REPO)
    d = unlocked_copy()
    try:
        for p in PAGES:
            t = open(os.path.join(d, p)).read()
            for b in BLOCKS: get(t, b)
    finally: shred(d)
    print("check ok: pages locked, blocks present")

def show(b):
    d = unlocked_copy()
    try: print(json.dumps(get(open(os.path.join(d, PAGES[0])).read(), b), indent=1, ensure_ascii=False))
    finally: shred(d)

def set_(b, src):
    if b not in BLOCKS: raise SystemExit("unknown block")
    data = json.load(open(src))
    d = unlocked_copy()
    try:
        for p in PAGES:
            f = os.path.join(d, p); t = open(f).read(); get(t, b)
            t = re.sub(rf'<script type="application/json" id="{b}">.*?</script>', lambda m: jblock(b, data), t, count=1, flags=re.S)
            open(f, "w").write(t)
        run("python3", PL, "lock", d)
        for p in PAGES:
            t = open(os.path.join(d, p)).read()
            if "const D=" not in t: raise SystemExit(f"relock failed for {p}; repo untouched")
        for p in PAGES: shutil.copy(os.path.join(d, p), os.path.join(REPO, p))
    finally: shred(d)
    check()

if __name__ == "__main__":
    a = sys.argv[1:]
    if a[:1] == ["show"] and len(a) == 2: show(a[1])
    elif a[:1] == ["set"] and len(a) == 3: set_(a[1], a[2])
    elif a[:1] == ["check"]: check()
    else: print(__doc__)
