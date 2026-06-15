/**
 * Hero Section
 */
(function initAnHero() {
    "use strict";

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { return; }

    gsap.registerPlugin(ScrollTrigger);

    var hero = document.querySelector("#an-hero");
    if (!hero) { return; }

    var title     = hero.querySelector(".cs-title");
    var text      = hero.querySelector(".cs-text");
    var meta      = hero.querySelector(".cs-meta");
    var scrollCue = hero.querySelector(".cs-scroll-cue");
    var bgImg     = hero.querySelector(".cs-background img");

    gsap.set([title, text, meta], { opacity: 0, y: 28 });
    gsap.set(scrollCue, { opacity: 0 });

    var tl = gsap.timeline({ delay: 0.2 });

    tl.to(title,     { opacity: 1, y: 0, duration: 0.9, ease: "power2.out" }, 0.1)
      .to(text,      { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }, "-=0.5")
      .to(meta,      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, "-=0.4")
      .to(scrollCue, { opacity: 1,       duration: 0.6, ease: "power2.out" }, "-=0.2");

    /* Parallax — image drifts up as user scrolls away */
    ScrollTrigger.create({
        trigger: hero,
        start: "top top",
        end: "bottom top",
        onUpdate: function (self) {
            if (bgImg) {
                gsap.set(bgImg, { y: self.progress * -60 });
            }
        }
    });

}());

/**
 * Portfolio Section
 */

   (function initAnPortfolio() {
  "use strict";

  const sidebar      = document.getElementById("vp-sidebar");
  const mobileTabs   = document.getElementById("vp-mobile-tabs");
  const sidebarItems = sidebar    ? Array.from(sidebar.querySelectorAll(".vp-sidebar-item"))    : [];
  const mobileTabEls = mobileTabs ? Array.from(mobileTabs.querySelectorAll(".vp-mobile-tab")) : [];
  const groups       = [];

  /* ── Build group objects ───────────────────── */
  document.querySelectorAll(".vp-group").forEach(function (groupEl) {
    const cat      = groupEl.dataset.category;
    const track    = groupEl.querySelector(".vp-track");
    const panels   = Array.from(groupEl.querySelectorAll(".vp-panel"));
    const dots     = Array.from(groupEl.querySelectorAll(".vp-dot"));
    const hint     = groupEl.querySelector(".vp-scroll-hint");
    const progress = groupEl.querySelector(".vp-progress-fill");

    groups.push({
      el: groupEl, track, panels, dots, hint, progress, cat,
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
        g.el.style.height       = "100vh";
        g.track.style.transform = "none";
        g.currentX              = 0;
        g.targetX               = 0;
      } else {
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

      if (scrolled < 0)                  { g.targetX = 0; }
      else if (scrolled > elH - stickyH) { g.targetX = g.maxX; }
      else { g.targetX = (scrolled / (elH - stickyH)) * g.maxX; }

      if (scrolled > 10 && !g.hintHidden) {
        g.hintHidden = true;
        if (g.hint) g.hint.classList.add("is-hidden");
      }
    });
  }

  /* ── Smooth render loop (desktop translateX) ── */
  function tick() {
    if (!isMobile()) {
      groups.forEach(function (g) {
        const diff = g.targetX - g.currentX;
        g.currentX = Math.abs(diff) < 0.4 ? g.targetX : g.currentX + diff * 0.12;
        g.track.style.transform = "translateX(" + (-g.currentX) + "px)";

        /* Active dot index */
        const idx = Math.round(g.currentX / (g.panelW || 1));
        g.dots.forEach(function (d, i) { d.classList.toggle("is-active", i === idx); });

        /* Progress bar */
        if (g.progress && g.maxX > 0) {
          const pct = (g.currentX / g.maxX) * 100;
          g.progress.style.width = Math.min(100, Math.max(0, pct)) + "%";
        }
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

    if (sidebar)    sidebar.classList.toggle("is-visible",    anyVisible && !isMobile());
    if (mobileTabs) mobileTabs.classList.toggle("is-visible", anyVisible &&  isMobile());

    sidebarItems.forEach(function (item) {
      item.classList.toggle("is-active", item.dataset.category === activeCat);
    });
    mobileTabEls.forEach(function (tab) {
      tab.classList.toggle("is-active", tab.dataset.category === activeCat);
    });
  }

  /* ── Scroll to category ─────────────────────── */
  function scrollToCategory(cat) {
    var divider = document.querySelector(".vp-divider-section[data-category='" + cat + "']");
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

  /* ── Mobile scroll-snap dot sync ────────────── */
  groups.forEach(function (g) {
    var sticky = g.el.querySelector(".vp-group-sticky");
    if (sticky) {
      sticky.addEventListener("scroll", function () {
        if (isMobile()) {
          var idx = Math.round(sticky.scrollLeft / (g.panelW || 1));
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

}());