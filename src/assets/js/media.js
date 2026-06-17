/* =============================================================
   MEDIA PAGE — media.js
   Vanilla JS — no GSAP dependency
   1. Hero entrance animation (immediate on load)
   2. Scroll-triggered fade-up for all sections below
   ============================================================= */

/* -------------------------------------------------------------
   01 — HERO ENTRANCE
   Staggered fade + translate-up on page load
   ------------------------------------------------------------- */
(function initAmHero() {
    "use strict";

    const hero = document.getElementById("am-hero");
    if (!hero) return;

    const topper = hero.querySelector(".cs-topper");
    const title  = hero.querySelector(".am-hero-title");
    const sub    = hero.querySelector(".am-hero-sub");
    const ctas   = hero.querySelector(".am-hero-ctas");

    const items = [topper, title, sub, ctas];

    items.forEach((el, i) => {
        if (!el) return;
        el.style.opacity   = "0";
        el.style.transform = "translateY(1.5rem)";
        el.style.transition = `opacity 0.7s ease ${i * 0.12}s, transform 0.7s ease ${i * 0.12}s`;
    });

    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            items.forEach(el => {
                if (!el) return;
                el.style.opacity   = "1";
                el.style.transform = "translateY(0)";
            });
        });
    });

}());

/* -------------------------------------------------------------
   02 — SCROLL FADE-UP
   IntersectionObserver watches elements with [data-reveal]
   and adds .is-visible when they enter the viewport.
   CSS handles the actual transition.
   ------------------------------------------------------------- */
(function initAmReveal() {
    "use strict";

    // Inject the base reveal styles
    const style = document.createElement("style");
    style.textContent = `
        [data-reveal] {
            opacity: 0;
            transform: translateY(2rem);
            transition: opacity 0.65s ease, transform 0.65s ease;
        }
        [data-reveal].is-visible {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);

    // Elements to reveal — grouped by section for stagger
    const revealGroups = [

        // Speaking Topics — header then each row
        { selector: ".am-topics-header",    delay: 0 },
        { selector: ".am-topics-row--2 .am-topic-card", stagger: 0.1 },
        { selector: ".am-topics-row--3 .am-topic-card", stagger: 0.1 },

        // Speaking Experience — header then cards
        { selector: ".am-experience-header", delay: 0 },
        { selector: ".am-experience-card",   stagger: 0.1 },

        // Podcast & Media — header, podcast rows, press cards
        { selector: ".am-media-header",      delay: 0 },
        { selector: ".am-media-block-label", delay: 0 },
        { selector: ".am-media-block-intro", delay: 0.1 },
        { selector: ".am-podcast-row",       stagger: 0.08 },
        { selector: ".am-press-card",        stagger: 0.08 },

        // Press Kit
        { selector: ".am-presskit-container", delay: 0 },

        // Closing CTA
        { selector: ".am-closing-container",  delay: 0 },
    ];

    // Apply data-reveal + delay to each element
    revealGroups.forEach(group => {
        const els = document.querySelectorAll(group.selector);
        els.forEach((el, i) => {
            el.setAttribute("data-reveal", "");
            const delay = group.stagger != null
                ? group.stagger * i
                : (group.delay || 0);
            el.style.transitionDelay = `${delay}s`;
        });
    });

    // Observe all [data-reveal] elements
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
    });

    document.querySelectorAll("[data-reveal]").forEach(el => {
        observer.observe(el);
    });

}());