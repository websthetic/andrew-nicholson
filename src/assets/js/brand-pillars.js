(function () {
  const section  = document.getElementById('brand-pillars');
  if (!section) return;

  const words    = section.querySelectorAll('.cs-pillar-word');
  const texts    = section.querySelectorAll('.cs-pillar-text');
  const images   = section.querySelectorAll('.cs-pillar-img-wrapper');
  const spacer   = section.querySelector('.cs-pillars-spacer');
  const bar      = document.getElementById('cs-progress-bar');
  let current    = -1;

  function activateAll() {
    [words, texts, images].forEach(list => {
      list.forEach(el => el.classList.add('is-active'));
    });
    if (bar) bar.style.width = '0%';
  }

  function activate(i) {
    if (i === current) return;
    current = i;
    [words, texts, images].forEach(list => {
      list.forEach(el => {
        el.classList.toggle('is-active', +el.dataset.pillar === i);
      });
    });
    if (bar) bar.style.width = ((i + 1) / 3 * 100) + '%';
  }

  function onScroll() {
    if (!spacer || window.innerWidth < 1024) {
      activateAll();
      return;
    }

    const rect     = section.getBoundingClientRect();
    const total    = section.offsetHeight - window.innerHeight;
    const progress = Math.max(0, Math.min(1, -rect.top / total));
    const index    = Math.min(2, Math.floor(progress * 3));

    activate(index);
  }

  // init
  if (window.innerWidth < 1024) {
    activateAll();
  } else {
    activate(0);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
})();

// ── Scroll throttle (both directions) ────────────────────────────────────
let lastProgress = 0;
const MAX_REVERSE_STEP = 0.02;
const MAX_FORWARD_STEP = 0.02;
const PHASE1_END = 0.55;

ScrollTrigger.create({
  trigger:  section,
  start:    "top top",
  end: () => "+=" + (section.offsetHeight - window.innerHeight),
  scrub:    4,
  onUpdate: function (self) {
    let p = self.progress;

    if (p < lastProgress) {
      p = Math.max(p, lastProgress - MAX_REVERSE_STEP);
    } else if (p > lastProgress && lastProgress < PHASE1_END) {
      p = Math.min(p, lastProgress + MAX_FORWARD_STEP);
    }

    lastProgress = p;
    applyProgress(p);
  },
});