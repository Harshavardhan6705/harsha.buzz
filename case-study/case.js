// Case-study pages: the portfolio's motion layer (Lenis smooth scroll, dot + ring cursor, magnetic
// buttons with the selection box / W × H readout), scroll reveals, the active contents link, and the
// portfolio's "/#section" links (the home page reads mv-nav-to and scrolls there, so the address bar stays at "/").
(function () {
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
  var OFF = 84;
  var lenis = null;

  // ---- site header (same markup/CSS as the portfolio's header component): breakpoints, glass after 40px,
  // hide on scroll down, and the Menu drawer below 1100px ----
  var hd = document.querySelector(".mvhd"), dr = document.getElementById("mvhd-drawer");
  if (hd) {
    var bgBtn = hd.querySelector(".mvhd-bg"), bgTxt = hd.querySelector(".mvhd-bgt");
    var hs = { lastY: window.scrollY, acc: 0, hid: false, open: false };
    // always the boxed (glass) bar: these pages barely scroll, and the home page's look is the boxed bar
    var applyTop = function () { hd.classList.remove("is-top"); hd.classList.add("is-glass"); };
    var setOpen = function (v, refocus) {
      if (!dr || hs.open === v) return;
      hs.open = v;
      hd.classList.toggle("is-open", v); dr.classList.toggle("is-open", v);
      if (v) { hs.hid = false; hd.classList.remove("is-hid"); }
      dr.inert = !v; dr.setAttribute("aria-hidden", v ? "false" : "true");
      bgBtn.setAttribute("aria-expanded", v ? "true" : "false");
      bgBtn.setAttribute("aria-label", v ? "Close" : "Menu"); bgTxt.textContent = v ? "Close" : "Menu";
      var de = document.documentElement, L = window.__ltLenis;
      de.style.overflow = document.body.style.overflow = v ? "hidden" : "";
      if (v) de.setAttribute("data-mvhd-lock", ""); else de.removeAttribute("data-mvhd-lock");
      try { if (L) { if (v) L.stop(); else L.start(); } } catch (err) {}
      applyTop();
      if (v) setTimeout(function () { var a = dr.querySelector(".mvhd-dl a"); if (a) a.focus({ preventScroll: true }); }, 60);
      else if (refocus) setTimeout(function () { bgBtn.focus({ preventScroll: true }); }, 30);
    };
    var bp = function () {
      var w = window.innerWidth;
      hd.classList.toggle("is-ph", w < 810); hd.classList.toggle("is-tab", w >= 810 && w < 1100);
      if (dr) { dr.classList.toggle("is-ph", w < 810); dr.hidden = w >= 1100; }
      if (w >= 1100) setOpen(false);
    };
    var onHdScroll = function () {
      var y = window.scrollY, d = y - hs.lastY, hid = hs.hid;
      hs.lastY = y;
      applyTop();
      if (hs.open || y < 40 || reduce) hid = false;
      else { if ((d > 0) !== (hs.acc > 0)) hs.acc = 0; hs.acc += d; if (hs.acc > 12) hid = true; else if (hs.acc < -8) hid = false; }
      if (hid && hd.contains(document.activeElement)) hid = false;
      if (hid !== hs.hid) { hs.hid = hid; hd.classList.toggle("is-hid", hid); }
    };
    bp(); applyTop();
    addEventListener("resize", bp);
    addEventListener("scroll", onHdScroll, { passive: true });
    hd.addEventListener("focusin", function () { if (hs.hid) { hs.hid = false; hs.acc = 0; hd.classList.remove("is-hid"); } });
    if (bgBtn) bgBtn.addEventListener("click", function () { setOpen(!hs.open); });
    hd.querySelector(".mvhd-logo").addEventListener("click", function () { if (hs.open) setOpen(false); });
    if (dr) {
      dr.addEventListener("click", function (e) { if (e.target.closest && e.target.closest("a[href]")) setOpen(false); });
      document.addEventListener("keydown", function (e) {
        if (!hs.open) return;
        if (e.key === "Escape") { e.preventDefault(); setOpen(false, true); return; }
        if (e.key !== "Tab") return;
        var f = [hd.querySelector(".mvhd-logo"), bgBtn].concat([].slice.call(dr.querySelectorAll("a[href],button:not([disabled])")));
        var i = f.indexOf(document.activeElement);
        e.preventDefault();
        f[e.shiftKey ? (i <= 0 ? f.length - 1 : i - 1) : (i < 0 || i >= f.length - 1 ? 0 : i + 1)].focus();
      }, true);
      var clock = dr.querySelector("[data-mvhd-time]");
      var tick = function () { try { clock.textContent = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date()); } catch (err) {} };
      if (clock) { tick(); setInterval(tick, 15000); }
    }
  }

  // ---- buttons: rebuild .cs-btn / .cs-back into the portfolio's mv-btn markup ----
  var ARROW = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17L17 7M9 7h8v8"/></svg>';
  function esc(t) { return t.replace(/&/g, "&amp;").replace(/</g, "&lt;"); }
  [].forEach.call(document.querySelectorAll("a.cs-btn, a.cs-back"), function (a) {
    var label = a.textContent.replace(/[→←]/g, "").replace(/\s+/g, " ").trim();
    var kind = a.classList.contains("cs-back") ? "mv-quiet" : a.classList.contains("is-main") ? "mv-solid" : "mv-ghost";
    a.classList.add("mv-btn", kind);
    a.setAttribute("data-mag", "true");
    if (!a.hasAttribute("aria-label") && a.target === "_blank") a.setAttribute("aria-label", label + " (opens in a new tab)");
    a.innerHTML = '<span class="mv-face"><span class="mv-fill" aria-hidden="true"></span><span class="mv-lbl"><span class="mv-roll">' +
      '<span class="mv-l1">' + esc(label) + '</span><span class="mv-l2" aria-hidden="true">' + esc(label) + '</span></span></span>' +
      '<span class="mv-arr" aria-hidden="true"><span class="mv-a1">' + ARROW + '</span><span class="mv-a2">' + ARROW + '</span></span></span>' +
      '<span class="mv-selb" aria-hidden="true"><i></i><i></i><i></i><i></i></span><b class="mv-dim" aria-hidden="true"></b>';
  });

  if (fine) {
    // size readout + magnetic pull (same maths as the portfolio: up to 8px within 150px)
    var mags = [].slice.call(document.querySelectorAll("[data-mag]"));
    mags.forEach(function (b) {
      b.addEventListener("pointerenter", function () {
        var d = b.querySelector(".mv-dim");
        if (d) d.textContent = Math.round(b.offsetWidth) + " × " + Math.round(b.offsetHeight);
      });
    });
    if (!reduce) {
      addEventListener("pointermove", function (e) {
        mags.forEach(function (b) {
          var r = b.getBoundingClientRect(), x = e.clientX - (r.left + r.width / 2), y = e.clientY - (r.top + r.height / 2),
            d = Math.hypot(x, y), o = d < 150 ? (1 - d / 150) * 8 : 0;
          b.style.setProperty("--mx", (x / (d || 1)) * o + "px");
          b.style.setProperty("--my", (y / (d || 1)) * o + "px");
        });
      }, { passive: true });
    }

    // dot + ring cursor
    var dot = document.createElement("div"), ring = document.createElement("div");
    dot.className = "hxc-dot"; ring.className = "hxc-ring";
    dot.setAttribute("aria-hidden", "true"); ring.setAttribute("aria-hidden", "true");
    dot.style.display = ring.style.display = "none";
    document.body.appendChild(dot); document.body.appendChild(ring);
    var pos = { x: -100, y: -100 }, trail = { x: -100, y: -100 }, frame = 0, shown = false, TRAIL = 0.18;
    var INTERACTIVE = 'a, button, input, textarea, select, summary, [role="button"]';
    function setShown(v) { if (shown === v) return; shown = v; dot.style.display = ring.style.display = v ? "" : "none"; }
    function step() {
      trail.x += (pos.x - trail.x) * TRAIL; trail.y += (pos.y - trail.y) * TRAIL;
      ring.style.transform = "translate3d(" + trail.x + "px," + trail.y + "px,0)";
      frame = Math.abs(pos.x - trail.x) + Math.abs(pos.y - trail.y) > 0.1 ? requestAnimationFrame(step) : 0;
    }
    addEventListener("mousemove", function (e) {
      pos.x = e.clientX; pos.y = e.clientY;
      if (!shown) { trail.x = pos.x; trail.y = pos.y; setShown(true); }
      dot.style.transform = "translate3d(" + pos.x + "px," + pos.y + "px,0)";
      var hovered = !!(e.target && e.target.closest && e.target.closest(INTERACTIVE));
      dot.classList.toggle("is-hover", hovered); ring.classList.toggle("is-hover", hovered);
      if (!frame) frame = requestAnimationFrame(step);
    }, { passive: true });
    addEventListener("mousedown", function () { dot.classList.add("is-click"); ring.classList.add("is-click"); }, { passive: true });
    addEventListener("mouseup", function () { dot.classList.remove("is-click"); ring.classList.remove("is-click"); }, { passive: true });
    document.documentElement.addEventListener("mouseleave", function () { setShown(false); });
    document.documentElement.addEventListener("mouseenter", function () { setShown(true); });

    // Lenis, the same build and settings the portfolio uses
    if (!reduce) {
      import("/_fr/lenis@1.1.NJQGRwQU.mjs").then(function (m) {
        var L = m.default || m.Lenis || m;
        lenis = new L({ duration: 1.15, easing: function (k) { return Math.min(1, 1.001 - Math.pow(2, -10 * k)); }, lerp: 0.1, wheelMultiplier: 1, smoothWheel: true });
        window.__ltLenis = lenis;
        document.documentElement.classList.add("lenis");
        (function raf(t) { lenis.raf(t); requestAnimationFrame(raf); })(performance.now());
      }).catch(function () {});
    }
  }

  // ---- reveal anything whose top has entered the viewport (checked on scroll, so it never depends on
  // an observer that a background tab may pause; content above the fold appears at once) ----
  var rv = [].slice.call(document.querySelectorAll(".cs-rv"));
  function reveal() {
    var edge = innerHeight * 0.92;
    rv = rv.filter(function (el) {
      if (reduce || el.getBoundingClientRect().top < edge) { el.classList.add("is-in"); return false; }
      return true;
    });
    if (!rv.length) { removeEventListener("scroll", onScroll); removeEventListener("resize", onScroll); }
  }
  var queued = false;
  function onScroll() { if (!queued) { queued = true; setTimeout(function () { queued = false; reveal(); }, 60); } }
  addEventListener("scroll", onScroll, { passive: true });
  addEventListener("resize", onScroll);
  reveal();

  // ---- active contents link ----
  var links = [].slice.call(document.querySelectorAll(".cs-toc a[href^='#']"));
  var secs = links.map(function (a) { return document.getElementById(a.getAttribute("href").slice(1)); });
  function active() {
    var y = window.scrollY + 140, on = 0;
    secs.forEach(function (s, i) { if (s && s.offsetTop <= y) on = i; });
    links.forEach(function (a, i) { a.classList.toggle("is-on", i === on); });
  }
  if (links.length) { addEventListener("scroll", active, { passive: true }); active(); }

  // ---- two-slide deck: tabs, next/previous buttons, arrow keys, swipe; #development opens slide 2 ----
  var deck = document.querySelector("[data-deck]");
  if (deck) {
    var slides = [].slice.call(deck.querySelectorAll(".cs-slide"));
    var tabs = [].slice.call(deck.querySelectorAll(".cs-tab"));
    var HASH = ["overview", "development"];
    var cur = 0, timer = 0;
    function show(i, opts) {
      opts = opts || {};
      if (i === cur || i < 0 || i >= slides.length) return;
      var old = slides[cur], nw = slides[i], fwd = i > cur, instant = reduce || opts.instant;
      clearTimeout(timer);
      slides.forEach(function (s) { if (s !== old && s !== nw) { s.hidden = true; s.className = "cs-slide"; } });
      nw.hidden = false;
      nw.className = "cs-slide is-on";
      if (instant) { old.hidden = true; old.className = "cs-slide"; }
      else {
        nw.classList.add(fwd ? "is-from-right" : "is-from-left");
        void nw.offsetWidth;
        nw.classList.remove("is-from-right", "is-from-left");
        old.className = "cs-slide " + (fwd ? "is-leave-left" : "is-leave-right");
        timer = setTimeout(function () { old.hidden = true; old.className = "cs-slide"; }, 650);
      }
      tabs.forEach(function (t, k) { t.setAttribute("aria-selected", k === i ? "true" : "false"); t.tabIndex = k === i ? 0 : -1; });
      cur = i;
      history.replaceState(null, "", i ? "#" + HASH[i] : location.pathname);
      if (!opts.instant && deck.getBoundingClientRect().top < 0) {
        if (lenis) lenis.scrollTo(0, { duration: 0.8 }); else window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
      }
      if (opts.focus) tabs[i].focus({ preventScroll: true });
    }
    deck.addEventListener("click", function (e) {
      var b = e.target.closest && e.target.closest("[data-go]");
      if (b) show(+b.getAttribute("data-go"), { focus: b.classList.contains("cs-next") });
    });
    deck.querySelector(".cs-tabs").addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") { e.preventDefault(); show(cur + (e.key === "ArrowRight" ? 1 : -1), { focus: true }); }
    });
    document.addEventListener("keydown", function (e) {
      if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
      var t = e.target; if (t && t.closest && (t.isContentEditable || /INPUT|TEXTAREA|SELECT/.test(t.tagName) || t.closest(".cs-tabs"))) return;
      if (e.key === "ArrowRight") show(cur + 1); else if (e.key === "ArrowLeft") show(cur - 1);
    });
    var sx = 0, sy = 0, swiping = false;
    var stage = deck.querySelector(".cs-stage");
    stage.addEventListener("touchstart", function (e) { if (e.touches.length !== 1) return; swiping = true; sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
    stage.addEventListener("touchend", function (e) {
      if (!swiping) return; swiping = false;
      var dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
      if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) show(cur + (dx < 0 ? 1 : -1));
    }, { passive: true });
    function fromHash(instant) {
      var k = HASH.indexOf(location.hash.slice(1));
      if (k === -1 && location.hash === "#slide-2") k = 1;
      if (k > -1) show(k, { instant: instant });
    }
    addEventListener("hashchange", function () { fromHash(false); });
    fromHash(true);
  }

  // ---- links ----
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("a[href]");
    if (!a || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var h = a.getAttribute("href");
    if (h.charAt(0) === "#" && h.length > 1) {
      var el = document.getElementById(h.slice(1));
      if (!el) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(el, { offset: -OFF, duration: 1.15 });
      else el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
      history.replaceState(null, "", location.pathname);
    } else if (h.indexOf("/#") === 0) {
      e.preventDefault();
      try { sessionStorage.setItem("mv-nav-to", decodeURIComponent(h.slice(2))); location.assign("/"); }
      catch (err) { location.assign(h); }
    }
  });
})();
