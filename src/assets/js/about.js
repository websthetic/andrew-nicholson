(function () {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    const section = document.querySelector('#about-timeline');
    if (!section) return;

    const lineFill = document.getElementById('tl-line-fill');
    const rows = section.querySelectorAll('.tl-row');

    gsap.to(lineFill, {
        height: '100%',
        ease: 'none',
        scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            end: 'bottom 60%',
            scrub: 1,
        },
    });

    rows.forEach((row) => {
        ScrollTrigger.create({
            trigger: row,
            start: 'top 80%',
            onEnter: () => row.classList.add('is-visible'),
            onLeaveBack: () => row.classList.remove('is-visible'),
        });
    });

    setTimeout(() => {
        rows.forEach((row) => {
            const rect = row.getBoundingClientRect();
            if (rect.top < window.innerHeight) {
                row.classList.add('is-visible');
            }
        });
        ScrollTrigger.refresh();
    }, 100);

})();