/**
 * Brand Pillars — Parallax
 */
(function () {
    'use strict';

    const STRENGTH = 30;
    const mq = window.matchMedia('(min-width: 64rem)');

    function applyParallax() {
        if (!mq.matches) return;

        const wrappers = document.querySelectorAll('#brand-pillars .cs-pillar-img-wrapper');
        const vh = window.innerHeight;

        wrappers.forEach(function (wrapper) {
            const img = wrapper.querySelector('img');
            if (!img) return;

            const rect = wrapper.getBoundingClientRect();
            const center = rect.top + rect.height / 2;
            const progress = (vh / 2 - center) / vh;
            const offset = progress * STRENGTH;

            img.style.transform = 'translateY(' + offset + 'px)';
        });
    }

    function reset() {
        const wrappers = document.querySelectorAll('#brand-pillars .cs-pillar-img-wrapper');
        wrappers.forEach(function (wrapper) {
            const img = wrapper.querySelector('img');
            if (img) img.style.transform = '';
        });
    }

    function onScroll() {
        mq.matches ? applyParallax() : reset();
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    // Run on load
    document.addEventListener('DOMContentLoaded', applyParallax);
}());