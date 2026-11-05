/* Live Supabase pings → Command Center Ping Log (ops/admin/tech session on THIS origin). */
(function () {
  "use strict";
  if (window.__SU_LIVE_PINGS__) return;
  window.__SU_LIVE_PINGS__ = 1;

  function mapStatus(s) {
    if (s === "open") return "Open";
    if (s === "claimed") return "In progress";
    if (s === "done" || s === "cancelled") return "Done";
    return "Open";
  }

  function toUi(row) {
    var label = row.item_label || row.item_id || "Quote request";
    var who = row.member_name || row.member_email || "Member";
    return {
      at: row.created_at || Date.now(),
      cat: "Requests",
      type: row.kind === "quote_request" ? "Quote Request" : (row.kind || "Ping"),
      summary: label + (row.plan ? " · " + row.plan : "") + (row.notes ? " · " + row.notes : ""),
      member: who,
      sender: "Member App",
      state: mapStatus(row.status),
      live: 1,
      id: row.id
    };
  }

  function pushLocal(ui) {
    try {
      var key = "ccm-demo-uk11o";
      var s = JSON.parse(localStorage.getItem(key) || "{}");
      s.pings = s.pings || [];
      if (ui.id && s.pings.some(function (p) { return p.id === ui.id; })) return false;
      s.pings.unshift(ui);
      localStorage.setItem(key, JSON.stringify(s));
      return true;
    } catch (e) { return false; }
  }

  function refreshUi() {
    try { if (window.CCM && typeof window.CCM.refresh === "function") window.CCM.refresh(); } catch (e) {}
  }

  function toast(msg) {
    try {
      var t = document.createElement("div");
      t.className = "mc-toast";
      t.setAttribute("role", "status");
      t.textContent = msg;
      document.body.appendChild(t);
      setTimeout(function () { t.remove(); }, 3200);
    } catch (e) {}
  }

  function ensureChip() {
    if (document.getElementById("su-live-chip")) return document.getElementById("su-live-chip");
    var st = document.createElement("style");
    st.textContent = "#su-live-chip{position:fixed;left:12px;bottom:12px;z-index:9999;font:600 13px Hind,system-ui,sans-serif}" +
      "#su-live-chip button,#su-live-chip .su-card{background:#fff;border:1px solid #d9d1c4;border-radius:12px;box-shadow:0 8px 24px rgba(0,0,0,.08)}" +
      "#su-live-chip > button{padding:10px 14px;cursor:pointer;color:#1a1a1a}" +
      "#su-live-chip .su-card{display:none;padding:14px;width:min(320px,calc(100vw - 24px));margin-top:8px}" +
      "#su-live-chip.open .su-card{display:block}#su-live-chip label{display:block;font-size:12px;margin:8px 0 4px}" +
      "#su-live-chip input{width:100%;box-sizing:border-box;min-height:40px;padding:8px;border:1px solid #cfc6b4;border-radius:8px}" +
      "#su-live-chip .su-go{width:100%;margin-top:10px;min-height:40px;background:#C1502E;color:#fff;border:0;border-radius:8px;font-weight:700;cursor:pointer}" +
      "#su-live-chip .su-err{color:#a12a1b;min-height:18px;font-size:12px;margin-top:6px}" +
      "#su-live-chip .su-ok{padding:10px 14px;border:1px solid #d9d1c4;border-radius:12px;background:#fff;color:#1a1a1a}";
    document.head.appendChild(st);
    var wrap = document.createElement("div");
    wrap.id = "su-live-chip";
    wrap.innerHTML = '<button type="button" id="su-live-open">Live pings · Sign in</button>' +
      '<div class="su-card"><strong>Operator sign-in</strong><p style="margin:6px 0 0;font:400 12px Hind,sans-serif;color:#5c5c5c">Same Supabase pilot accounts. Session stays on this Command Center site.</p>' +
      '<label for="su-live-email">Email</label><input id="su-live-email" type="email" autocomplete="username">' +
      '<label for="su-live-pass">Password</label><input id="su-live-pass" type="password" autocomplete="current-password">' +
      '<button type="button" class="su-go" id="su-live-go">Sign in & load pings</button><div class="su-err" id="su-live-err"></div></div>' +
      '<div class="su-ok" id="su-live-ok" hidden></div>';
    document.body.appendChild(wrap);
    document.getElementById("su-live-open").onclick = function () { wrap.classList.toggle("open"); };
    document.getElementById("su-live-go").onclick = function () {
      var email = document.getElementById("su-live-email").value.trim();
      var pass = document.getElementById("su-live-pass").value;
      var err = document.getElementById("su-live-err");
      err.textContent = "";
      window.SUAuth.signIn(email, pass).then(function () {
        wrap.classList.remove("open");
        boot(true);
      }).catch(function (ex) {
        err.textContent = (ex && ex.message) || "Sign in failed";
      });
    };
    return wrap;
  }

  function showSignedIn(user) {
    var wrap = ensureChip();
    var open = document.getElementById("su-live-open");
    var ok = document.getElementById("su-live-ok");
    open.hidden = true;
    wrap.querySelector(".su-card").style.display = "none";
    ok.hidden = false;
    ok.innerHTML = "Live pings on · " + (user.email || "") +
      ' <button type="button" id="su-live-out" style="margin-left:8px;border:0;background:transparent;text-decoration:underline;cursor:pointer">Sign out</button>';
    document.getElementById("su-live-out").onclick = function () {
      window.SUAuth.signOut().then(function () { location.reload(); });
    };
  }

  async function subscribe(sb) {
    var res = await sb.from("pings").select("*").order("created_at", { ascending: false }).limit(40);
    if (res.error) { console.warn("[su-live-pings] fetch", res.error); return; }
    (res.data || []).slice().reverse().forEach(function (row) { pushLocal(toUi(row)); });
    refreshUi();
    try {
      sb.channel("cc-pings")
        .on("postgres_changes", { event: "INSERT", schema: "public", table: "pings" }, function (payload) {
          var ui = toUi(payload.new || {});
          if (pushLocal(ui)) {
            toast("New quote request · " + (ui.summary || ""));
            refreshUi();
          }
        })
        .subscribe();
    } catch (e) {
      console.warn("[su-live-pings] realtime", e);
      setInterval(async function () {
        var r = await sb.from("pings").select("*").order("created_at", { ascending: false }).limit(10);
        var changed = false;
        (r.data || []).forEach(function (row) { if (pushLocal(toUi(row))) changed = true; });
        if (changed) refreshUi();
      }, 15000);
    }
  }

  async function boot(force) {
    if (!window.SUAuth || !window.SU_SUPABASE) { ensureChip(); return; }
    ensureChip();
    var u = await window.SUAuth.user();
    if (!u) return;
    var role = window.SUAuth.roleOf(u);
    if (["ops", "admin", "tech"].indexOf(role) < 0) {
      document.getElementById("su-live-open").textContent = "Live pings · wrong role";
      return;
    }
    showSignedIn(u);
    var sb = await window.SUAuth.getClient();
    await subscribe(sb);
    if (force) toast("Live pings connected");
  }

  function start() { boot(false).catch(function (e) { console.warn(e); ensureChip(); }); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
