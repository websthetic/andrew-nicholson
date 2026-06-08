/* =============================================================
   VENTURES PORTFOLIO — Scroll Controller v3
   Desktop: scroll-driven sticky horizontal per group
   Mobile:  touch swipe horizontal per group + tab nav
   IIFE pattern per project conventions.
   ============================================================= */

(function () {
  "use strict";

  const sidebar      = document.getElementById("vp-sidebar");
  const mobileTabs   = document.getElementById("vp-mobile-tabs");
  const sidebarItems = sidebar ? Array.from(sidebar.querySelectorAll(".vp-sidebar-item")) : [];
  const mobileTabEls = mobileTabs ? Array.from(mobileTabs.querySelectorAll(".vp-mobile-tab")) : [];
  const groups       = [];

  /* ── Build group objects ───────────────────── */
  document.querySelectorAll(".vp-group").forEach(function (groupEl) {
    const cat    = groupEl.dataset.category;
    const track  = groupEl.querySelector(".vp-track");
    const panels = Array.from(groupEl.querySelectorAll(".vp-panel"));
    const dots   = Array.from(groupEl.querySelectorAll(".vp-dot"));
    const hint   = groupEl.querySelector(".vp-scroll-hint");

    groups.push({
      el: groupEl, track, panels, dots, hint, cat,
      targetX: 0, currentX: 0, maxX: 0, panelW: 0,
      hintHidden: false,
      // mobile touch state
      touchStartX: 0, touchStartY: 0, touchCurrentX: 0,
      isSwiping: false, swipeCardIdx: 0
    });
  });

  /* ── Detect mobile ─────────────────────────── */
  function isMobile() {
    return window.innerWidth < 768;
  }

  /* ── Setup dimensions ──────────────────────── */
  function setup() {
    groups.forEach(function (g) {
      g.panelW = window.innerWidth;
      g.maxX   = g.panelW * (g.panels.length - 1);
      g.track.style.width = (g.panels.length * g.panelW) + "px";

      if (isMobile()) {
        // Mobile: height = 100vh * cardCount (same as desktop — sticky scroll drives horiz)
        g.el.style.height = (100 + (g.panels.length - 1) * 100) + "vh";
        // Reset card index on resize
        g.swipeCardIdx = Math.min(g.swipeCardIdx, g.panels.length - 1);
        g.targetX  = g.swipeCardIdx * g.panelW;
        g.currentX = g.targetX;
      } else {
        g.el.style.height = (100 + (g.panels.length - 1) * 100) + "vh";
      }
    });
  }

  /* ── Desktop: map scroll → horizontal ──────── */
  function syncGroupsDesktop() {
    const scrollY = window.scrollY;
    groups.forEach(function (g) {
      const elTop   = g.el.getBoundingClientRect().top + scrollY;
      const elH     = g.el.offsetHeight;
      const stickyH = window.innerHeight;
      const scrolled = scrollY - elTop;

      if (scrolled < 0) {
        g.targetX = 0;
      } else if (scrolled > elH - stickyH) {
        g.targetX = g.maxX;
      } else {
        g.targetX = (scrolled / (elH - stickyH)) * g.maxX;
      }

      if (scrolled > 10 && !g.hintHidden) {
        g.hintHidden = true;
        if (g.hint) g.hint.classList.add("is-hidden");
      }
    });
  }

  /* ── Mobile touch handlers ──────────────────── */
  function onTouchStart(e) {
    if (!isMobile()) return;
    const g = getGroupFromEl(e.currentTarget);
    if (!g) return;
    g.touchStartX   = e.touches[0].clientX;
    g.touchStartY   = e.touches[0].clientY;
    g.touchCurrentX = g.touchStartX;
    g.isSwiping     = false;
  }

  function onTouchMove(e) {
    if (!isMobile()) return;
    const g = getGroupFromEl(e.currentTarget);
    if (!g) return;

    const dx = e.touches[0].clientX - g.touchStartX;
    const dy = e.touches[0].clientY - g.touchStartY;

    // Determine swipe axis on first significant move
    if (!g.isSwiping && Math.abs(dx) < 8 && Math.abs(dy) < 8) return;

    if (Math.abs(dx) > Math.abs(dy)) {
      // Horizontal swipe — prevent vertical scroll
      g.isSwiping = true;
      e.preventDefault();
      const base = g.swipeCardIdx * g.panelW;
      g.targetX  = Math.max(0, Math.min(g.maxX, base - dx));
    }
    // If primarily vertical, let page scroll naturally
  }

  function onTouchEnd(e) {
    if (!isMobile()) return;
    const g = getGroupFromEl(e.currentTarget);
    if (!g || !g.isSwiping) return;

    const dx        = e.changedTouches[0].clientX - g.touchStartX;
    const threshold = g.panelW * 0.2; // 20% of panel width to trigger swipe

    if (dx < -threshold) {
      g.swipeCardIdx = Math.min(g.swipeCardIdx + 1, g.panels.length - 1);
    } else if (dx > threshold) {
      g.swipeCardIdx = Math.max(g.swipeCardIdx - 1, 0);
    }

    g.targetX  = g.swipeCardIdx * g.panelW;
    g.isSwiping = false;
  }

  function getGroupFromEl(el) {
    return groups.find(function (g) { return g.el === el || g.el.contains(el); });
  }

  /* ── Attach touch listeners to each group ───── */
  function attachTouchListeners() {
    groups.forEach(function (g) {
      g.el.addEventListener("touchstart", onTouchStart, { passive: true });
      g.el.addEventListener("touchmove",  onTouchMove,  { passive: false });
      g.el.addEventListener("touchend",   onTouchEnd,   { passive: true });
    });
  }

  /* ── Smooth render loop ─────────────────────── */
  function tick() {
    groups.forEach(function (g) {
      const diff = g.targetX - g.currentX;
      g.currentX = Math.abs(diff) < 0.4 ? g.targetX : g.currentX + diff * 0.12;
      g.track.style.transform = "translateX(" + (-g.currentX) + "px)";

      // Dots
      const idx = Math.round(g.currentX / (g.panelW || 1));
      g.dots.forEach(function (d, i) { d.classList.toggle("is-active", i === idx); });
    });

    updateNavState();
    requestAnimationFrame(tick);
  }

  /* ── Nav visibility + active state ─────────── */
  function updateNavState() {
    let activeCat  = null;
    let anyVisible = false;

    document.querySelectorAll(".vp-divider-section, .vp-group").forEach(function (el) {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) {
        anyVisible = true;
        if (el.dataset.category) activeCat = el.dataset.category;
      }
    });

    // Desktop sidebar
    if (sidebar) sidebar.classList.toggle("is-visible", anyVisible && !isMobile());
    sidebarItems.forEach(function (item) {
      item.classList.toggle("is-active", item.dataset.category === activeCat);
    });

    // Mobile tabs
    if (mobileTabs) mobileTabs.classList.toggle("is-visible", anyVisible && isMobile());
    mobileTabEls.forEach(function (tab) {
      tab.classList.toggle("is-active", tab.dataset.category === activeCat);
    });
  }

  /* ── Sidebar click → scroll to divider ─────── */
  function scrollToCategory(cat) {
    const divider = document.querySelector(
      ".vp-divider-section[data-category='" + cat + "']"
    );
    if (divider) {
      window.scrollTo({
        top: divider.getBoundingClientRect().top + window.scrollY,
        behavior: "smooth"
      });
    }
  }

  sidebarItems.forEach(function (item) {
    item.addEventListener("click", function () { scrollToCategory(item.dataset.category); });
  });

  mobileTabEls.forEach(function (tab) {
    tab.addEventListener("click", function () { scrollToCategory(tab.dataset.category); });
  });

  /* ── Scroll listener (desktop) ──────────────── */
  window.addEventListener("scroll", function () {
    if (!isMobile()) syncGroupsDesktop();
  }, { passive: true });

  /* ── Init ───────────────────────────────────── */
  setup();
  if (!isMobile()) syncGroupsDesktop();
  attachTouchListeners();
  window.addEventListener("resize", function () { setup(); });
  requestAnimationFrame(tick);

})();