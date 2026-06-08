/* =============================================================
   VENTURES PORTFOLIO — Scroll Controller v4
   Desktop: scroll-driven sticky horizontal (translateX via scrollY)
   Mobile:  CSS scroll-snap — pure native, zero JS touch handling
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
      hintHidden: false
    });
  });

  function isMobile() { return window.innerWidth < 768; }

  /* ── Setup dimensions ──────────────────────── */
  function setup() {
    groups.forEach(function (g) {
      g.panelW = window.innerWidth;
      g.maxX   = g.panelW * (g.panels.length - 1);
      g.track.style.width = (g.panels.length * g.panelW) + "px";

      if (isMobile()) {
        /* Mobile: group is just 100vh — no extra scroll height needed.
           CSS scroll-snap handles everything inside .vp-group-sticky */
        g.el.style.height = "100vh";
        /* Reset JS transform — CSS snap takes over */
        g.track.style.transform = "none";
        g.currentX = 0;
        g.targetX  = 0;
      } else {
        /* Desktop: extra scroll height per additional card */
        g.el.style.height = (100 + (g.panels.length - 1) * 100) + "vh";
      }
    });
  }

  /* ── Desktop: map scrollY → translateX ─────── */
  function syncGroupsDesktop() {
    const scrollY = window.scrollY;
    groups.forEach(function (g) {
      const elTop    = g.el.getBoundingClientRect().top + scrollY;
      const elH      = g.el.offsetHeight;
      const stickyH  = window.innerHeight;
      const scrolled = scrollY - elTop;

      if (scrolled < 0)               { g.targetX = 0; }
      else if (scrolled > elH - stickyH) { g.targetX = g.maxX; }
      else { g.targetX = (scrolled / (elH - stickyH)) * g.maxX; }

      if (scrolled > 10 && !g.hintHidden) {
        g.hintHidden = true;
        if (g.hint) g.hint.classList.add("is-hidden");
      }
    });
  }

  /* ── Mobile: read scroll-snap position for dots ── */
  function syncMobileDots() {
    groups.forEach(function (g) {
      const sticky = g.el.querySelector(".vp-group-sticky");
      if (!sticky) return;
      const idx = Math.round(sticky.scrollLeft / (g.panelW || 1));
      g.dots.forEach(function (d, i) { d.classList.toggle("is-active", i === idx); });

      /* Update mobile tab active state based on which group is in view */
    });
  }

  /* ── Smooth render loop (desktop translateX) ── */
  function tick() {
    if (!isMobile()) {
      groups.forEach(function (g) {
        const diff = g.targetX - g.currentX;
        g.currentX = Math.abs(diff) < 0.4 ? g.targetX : g.currentX + diff * 0.12;
        g.track.style.transform = "translateX(" + (-g.currentX) + "px)";

        const idx = Math.round(g.currentX / (g.panelW || 1));
        g.dots.forEach(function (d, i) { d.classList.toggle("is-active", i === idx); });
      });
    }

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

    if (sidebar) sidebar.classList.toggle("is-visible", anyVisible && !isMobile());
    sidebarItems.forEach(function (item) {
      item.classList.toggle("is-active", item.dataset.category === activeCat);
    });

    if (mobileTabs) mobileTabs.classList.toggle("is-visible", anyVisible && isMobile());
    mobileTabEls.forEach(function (tab) {
      tab.classList.toggle("is-active", tab.dataset.category === activeCat);
    });
  }

  /* ── Scroll to category ─────────────────────── */
  function scrollToCategory(cat) {
    const divider = document.querySelector(".vp-divider-section[data-category='" + cat + "']");
    if (divider) {
      window.scrollTo({ top: divider.getBoundingClientRect().top + window.scrollY, behavior: "smooth" });
    }
  }

  sidebarItems.forEach(function (item) {
    item.addEventListener("click", function () { scrollToCategory(item.dataset.category); });
  });
  mobileTabEls.forEach(function (tab) {
    tab.addEventListener("click", function () { scrollToCategory(tab.dataset.category); });
  });

  /* ── Mobile scroll-snap dot sync ────────────── */
  groups.forEach(function (g) {
    const sticky = g.el.querySelector(".vp-group-sticky");
    if (sticky) {
      sticky.addEventListener("scroll", function () {
        if (isMobile()) {
          const idx = Math.round(sticky.scrollLeft / (g.panelW || 1));
          g.dots.forEach(function (d, i) { d.classList.toggle("is-active", i === idx); });
        }
      }, { passive: true });
    }
  });

  /* ── Listeners ──────────────────────────────── */
  window.addEventListener("scroll", function () {
    if (!isMobile()) syncGroupsDesktop();
  }, { passive: true });

  window.addEventListener("resize", function () {
    setup();
    if (!isMobile()) syncGroupsDesktop();
  });

  /* ── Init ───────────────────────────────────── */
  setup();
  if (!isMobile()) syncGroupsDesktop();
  requestAnimationFrame(tick);

})();