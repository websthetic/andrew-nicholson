/* ============================================
   44 Hoops Foundation — Page Scripts
   Single named IIFE, boots on DOMContentLoaded.
   GSAP + ScrollTrigger loaded globally in base.html.
   ============================================ */
(function initHoopsFoundation() {
    "use strict";

    var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* ── Hero ───────────────────────────────────────────────── */
    (function initHero() {
        var hero = document.querySelector("#hoops-hero");
        if (!hero) { return; }

        var title     = hero.querySelector(".cs-title");
        var text      = hero.querySelector(".cs-text");
        var meta      = hero.querySelector(".cs-meta");
        var scrollCue = hero.querySelector(".cs-scroll-cue");
        var bgImg     = hero.querySelector(".cs-background img");

        if (!prefersReducedMotion) {
            gsap.registerPlugin(ScrollTrigger);

            gsap.set([title, text, meta], { opacity: 0, y: 28 });
            gsap.set(scrollCue, { opacity: 0 });

            var tl = gsap.timeline({ delay: 0.2 });
            tl.to(title,     { opacity: 1, y: 0, duration: 0.9, ease: "power2.out" }, 0.1)
              .to(text,      { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }, "-=0.5")
              .to(meta,      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, "-=0.4")
              .to(scrollCue, { opacity: 1,       duration: 0.6, ease: "power2.out" }, "-=0.2");

            ScrollTrigger.create({
                trigger: hero,
                start: "top top",
                end: "bottom top",
                onUpdate: function (self) {
                    if (bgImg) { gsap.set(bgImg, { y: self.progress * -60 }); }
                }
            });
        }
    }());

    /* ── Stats ──────────────────────────────────────────────── */
    (function initStats() {
        var section = document.querySelector("#hoops-stats");
        if (!section) { return; }

        var cards = section.querySelectorAll(".cs-item");

        if (!prefersReducedMotion) {
            gsap.set(cards, { opacity: 0, y: 40 });

            ScrollTrigger.create({
                trigger: section,
                start: "top 80%",
                once: true,
                onEnter: function () {
                    gsap.to(cards, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out", stagger: 0.15 });
                }
            });
        }

        var counters = [
            { el: cards[0] && cards[0].querySelector(".cs-number"), target: 4400, prefix: "",  suffix: "+" },
            { el: cards[1] && cards[1].querySelector(".cs-number"), target: 20,   prefix: "",  suffix: "+" },
            { el: cards[2] && cards[2].querySelector(".cs-number"), target: 25,   prefix: "$", suffix: "K+" }
        ];

        counters.forEach(function (counter) {
            if (!counter.el) { return; }
            var em = counter.el.querySelector("em");

            ScrollTrigger.create({
                trigger: counter.el,
                start: "top 85%",
                once: true,
                onEnter: function () {
                    var obj = { val: 0 };
                    gsap.to(obj, {
                        val: counter.target,
                        duration: 1.6,
                        ease: "power2.out",
                        onUpdate: function () {
                            counter.el.textContent = counter.prefix + Math.round(obj.val).toLocaleString();
                            if (em) { em.textContent = counter.suffix; counter.el.appendChild(em); }
                        }
                    });
                }
            });
        });
    }());

    /* ── Origin ─────────────────────────────────────────────── */
    (function initOrigin() {
        if (prefersReducedMotion) { return; }

        var section = document.querySelector("#hoops-origin");
        if (!section) { return; }

        var top    = section.querySelector(".cs-top");
        var bottom = section.querySelector(".cs-bottom");

        gsap.set([top, bottom], { opacity: 0, y: 28 });

        ScrollTrigger.create({
            trigger: section,
            start: "top 75%",
            once: true,
            onEnter: function () {
                gsap.to(top,    { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" });
                gsap.to(bottom, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out", delay: 0.15 });
            }
        });
    }());

    /* ── Timeline drag ──────────────────────────────────────── */
    (function initTimeline() {
        var section = document.querySelector("#hoops-timeline");
        if (!section) { return; }

        var track  = document.getElementById("hoopsTimelineTrack");
        var items  = section.querySelectorAll(".cs-item");
        var isDragging = false;
        var startX     = 0;
        var scrollStart = 0;
        var didDrag    = false;
        var dragThreshold = 4;

        track.addEventListener("mousedown", function (e) {
            isDragging  = true;
            didDrag     = false;
            startX      = e.pageX;
            scrollStart = track.scrollLeft;
            track.classList.add("is-dragging");
        });

        document.addEventListener("mouseup", function () {
            isDragging = false;
            track.classList.remove("is-dragging");
        });

        document.addEventListener("mousemove", function (e) {
            if (!isDragging) { return; }
            var delta = e.pageX - startX;
            if (Math.abs(delta) > dragThreshold) { didDrag = true; }
            track.scrollLeft = scrollStart - delta;
        });

        track.addEventListener("click", function (e) {
            if (didDrag) { e.preventDefault(); }
        }, true);

        if (prefersReducedMotion) { return; }

        gsap.set(items, { opacity: 0, x: 40 });

        ScrollTrigger.create({
            trigger: section,
            start: "top 80%",
            once: true,
            onEnter: function () {
                gsap.to(items, { opacity: 1, x: 0, duration: 0.7, ease: "power2.out", stagger: 0.10 });
            }
        });
    }());

    /* ── 4 Fours ────────────────────────────────────────────── */
    (function initFours() {
        if (prefersReducedMotion) { return; }

        var section = document.querySelector("#hoops-fours");
        if (!section) { return; }

        var header = section.querySelector(".cs-header");
        var cards  = section.querySelectorAll(".cs-item");

        gsap.set(header, { opacity: 0, y: 24 });
        gsap.set(cards,  { opacity: 0, y: 36 });

        ScrollTrigger.create({
            trigger: header,
            start: "top 82%",
            once: true,
            onEnter: function () {
                gsap.to(header, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" });
            }
        });

        ScrollTrigger.create({
            trigger: section.querySelector(".cs-card-group"),
            start: "top 85%",
            once: true,
            onEnter: function () {
                gsap.to(cards, { opacity: 1, y: 0, duration: 0.7, ease: "power2.out", stagger: 0.12 });
            }
        });
    }());

    /* ── CTA ────────────────────────────────────────────────── */
    (function initCta() {
        if (prefersReducedMotion) { return; }

        var section  = document.querySelector("#hoops-partners");
        if (!section) { return; }

        var ctaBlock = section.querySelector(".cs-cta-block");

        gsap.set(ctaBlock, { opacity: 0, y: 28 });

        ScrollTrigger.create({
            trigger: section,
            start: "top 80%",
            once: true,
            onEnter: function () {
                gsap.to(ctaBlock, { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" });
            }
        });
    }());

}());