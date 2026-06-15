/* ============================================
   AN About — Chapter Scroll
   Drop inside homepage.js within the
   window.load + double rAF boot wrapper.
   ============================================ */
(function initAnAbout() {
    "use strict";

    /* ── Build chapter objects ──────────────────────────────── */
    var chapters = [];

    document.querySelectorAll(".an-chapter").forEach(function (el) {
        var sticky    = el.querySelector(".an-sticky");
        var track     = el.querySelector(".an-track");
        var hint      = el.querySelector(".an-scroll-hint");
        var progFill  = el.querySelector(".an-progress-fill");
        var pairCount = parseInt(el.dataset.pairs, 10) || el.querySelectorAll(".an-pair").length;

        chapters.push({
            el        : el,
            sticky    : sticky,
            track     : track,
            hint      : hint,
            progFill  : progFill,
            pairCount : pairCount,
            targetX   : 0,
            currentX  : 0,
            maxX      : 0,
            hintHidden: false
        });
    });

    function isMobile() {
        return window.innerWidth < 768;
    }

    function isMobile() { return window.innerWidth < 768; }

    /* ── Setup dimensions ───────────────────────────────────── */
    function setup() {
        var vw = window.innerWidth;
        var mobile = isMobile();

        chapters.forEach(function (c) {
            // Mobile: title(1vw) + each pair splits into 2 slides(2vw each)
            // Desktop: title(1vw) + each pair(1vw)
            var totalW = mobile
                ? vw + c.pairCount * vw * 2
                : vw + c.pairCount * vw;

            c.track.style.width = totalW + "px";
            c.el.style.height   = (1 + c.pairCount * (mobile ? 2 : 1)) * 100 + "vh";
            c.maxX = totalW - vw;
        });
    }

    /* ── Map scrollY → targetX (all screen sizes) ───────────── */
    function syncScroll() {
        var scrollY = window.scrollY;

        chapters.forEach(function (c) {
            var elTop    = c.el.getBoundingClientRect().top + scrollY;
            var elH      = c.el.offsetHeight;
            var vH       = window.innerHeight;
            var scrolled = scrollY - elTop;

            if (scrolled < 0) {
                c.targetX = 0;
            } else if (scrolled > elH - vH) {
                c.targetX = c.maxX;
            } else {
                c.targetX = (scrolled / (elH - vH)) * c.maxX;
            }

            if (scrolled > 10 && !c.hintHidden) {
                c.hintHidden = true;
                if (c.hint) { c.hint.classList.add("is-hidden"); }
            }
        });
    }

    /* ── RAF render loop ────────────────────────────────────── */
    function tick() {
        chapters.forEach(function (c) {
            var diff = c.targetX - c.currentX;

            c.currentX = Math.abs(diff) < 0.4
                ? c.targetX
                : c.currentX + diff * 0.1;

            c.track.style.transform = "translateX(" + (-c.currentX) + "px)";

            if (c.progFill && c.maxX > 0) {
                var pct = (c.currentX / c.maxX) * 100;
                c.progFill.style.width = Math.min(100, Math.max(0, pct)) + "%";
            }
        });

        requestAnimationFrame(tick);
    }

    /* ── Listeners ──────────────────────────────────────────── */
    window.addEventListener("scroll", syncScroll, { passive: true });

    window.addEventListener("resize", function () {
        setup();
        syncScroll();
    });

    /* ── Init ───────────────────────────────────────────────── */
    setup();
    if (!isMobile()) { syncScroll(); }
    requestAnimationFrame(tick);

}());