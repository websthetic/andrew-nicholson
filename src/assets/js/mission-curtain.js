/**
 * Mission Section — Curtain Reveal (GSAP ScrollTrigger)
 */
(function () {
    'use strict';

    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    var mq      = window.matchMedia('(min-width: 64rem)');
    var wrapper = document.querySelector('.cs-mission-wrapper');
    var curtain = wrapper && wrapper.nextElementSibling;

    if (!wrapper || !curtain) return;

    if (!mq.matches) return;

    // Start the curtain below the viewport, slide it up to its natural position
    gsap.fromTo(curtain,
        { yPercent: 100 },
        {
            yPercent: 0,
            ease: 'none',
            scrollTrigger: {
                trigger: wrapper,
                start: 'top top',
                end: '75% top',
                scrub: true,
            }
        }
    );

    

}());

