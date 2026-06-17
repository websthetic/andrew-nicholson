/**
 * Hero Section
 */
(function () {
    var canvas = document.querySelector('.cs-grain');
    if (!canvas) return;

    var ctx      = canvas.getContext('2d');
    var grainFrame;
    var lastTime = 0;

    function resizeCanvas() {
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    function drawGrain(timestamp) {
        if (timestamp - lastTime > 1000 / 24) {
            var w         = canvas.width;
            var h         = canvas.height;
            var imageData = ctx.createImageData(w, h);
            var buffer    = imageData.data;

            for (var i = 0; i < buffer.length; i += 4) {
                var val     = Math.random() * 255 | 0;
                buffer[i]   = val;
                buffer[i+1] = val;
                buffer[i+2] = val;
                buffer[i+3] = 255;
            }

            ctx.putImageData(imageData, 0, 0);
            lastTime = timestamp;
        }

        grainFrame = requestAnimationFrame(drawGrain);
    }

    grainFrame = requestAnimationFrame(drawGrain);

    /* ---- Pause grain when tab is hidden ---- */
    document.addEventListener('visibilitychange', function () {
        if (document.hidden) {
            cancelAnimationFrame(grainFrame);
        } else {
            grainFrame = requestAnimationFrame(drawGrain);
        }
    });

    /* ---- Sound Toggle ---- */
    var hero  = document.getElementById('hero');
    var video = hero.querySelector('video.cs-background');
    var btn   = hero.querySelector('.cs-sound-btn');
    var label = hero.querySelector('.cs-sound-label');

    if (!btn || !video) return;

    btn.addEventListener('click', function () {
        var isOn = hero.classList.toggle('cs-sound-on');
        video.muted = !isOn;
        btn.setAttribute('aria-pressed', isOn ? 'true' : 'false');
        btn.setAttribute('aria-label',   isOn ? 'Mute sound' : 'Unmute sound');
        label.textContent = isOn ? 'Mute' : 'Sound';
    });
})();

/**
 * Who is Andrew Section
 */
(function () {
  "use strict";

  function init() {
    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
      console.warn("who-is-andrew.js: GSAP or ScrollTrigger not loaded.");
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const section       = document.getElementById("who-is-andrew");
    const sticky        = section && section.querySelector(".cs-who-sticky");
    const brandText     = section && section.querySelector(".cs-who-text");
    const portraitWrap  = section && section.querySelector(".cs-portrait-wrapper");
    const portraitOver  = section && section.querySelector(".cs-portrait-overlay");
    const portraitLabel = section && section.querySelector(".cs-portrait-overlay-text");
    const mosaic        = section && section.querySelector(".cs-mosaic");
    const mosaicSlot    = section && section.querySelector(".cs-mosaic-portrait-slot");
    const mosaicTiles   = section ? Array.from(section.querySelectorAll("[data-mosaic]")) : [];

    if (!section || !sticky || !brandText || !portraitWrap || !mosaic || !mosaicSlot) {
      console.warn("who-is-andrew.js: required elements not found.");
      return;
    }

    // ── Dimensions ────────────────────────────────────────────────────────────
    const SW     = sticky.offsetWidth;
    const SH     = sticky.offsetHeight;
    const mobile = SW < 768;

    // Safety check — bail and retry if dimensions aren't ready
    if (SW === 0 || SH === 0) {
      console.warn("who-is-andrew.js: dimensions not ready, retrying.");
      window.addEventListener("load", function () {
        requestAnimationFrame(function () {
          requestAnimationFrame(init);
        });
      });
      return;
    }

    // ── Tile opacity ──────────────────────────────────────────────────────────
    const TILE_OPACITY = 0.8;

    // ── Tile stagger: closest to center pops first ────────────────────────────
    const CENTER_COL = mobile ? 1 : 2;
    const CENTER_ROW = 1;
    const tilePositions = mobile
      ? [
          [0,0],[1,0],[2,0],
          [0,1],      [2,1],
          [0,2],[1,2],[2,2],
        ]
      : [
          [0,0],[1,0],[2,0],[3,0],[4,0],
          [0,1],[1,1],      [3,1],[4,1],
          [0,2],[1,2],[2,2],[3,2],[4,2],
        ];

    function tileDist(p) {
      return Math.sqrt(Math.pow(p[0]-CENTER_COL,2) + Math.pow(p[1]-CENTER_ROW,2));
    }
    const maxDist    = tileDist([0,0]);
    const tileDelays = tilePositions.map(p => tileDist(p) / maxDist);

    // ── Helpers ───────────────────────────────────────────────────────────────
    function clamp(v,lo,hi) { return Math.max(lo, Math.min(hi, v)); }
    function invLerp(a,b,v) { return b===a ? 0 : clamp((v-a)/(b-a), 0, 1); }
    function lerp(a,b,t)    { return a + (b-a)*t; }
    function easeInOut(t)   { return t<0.5 ? 4*t*t*t : 1-Math.pow(-2*t+2,3)/2; }
    function easeOutBack(t) {
      const c1=1.70158, c3=c1+1;
      return 1 + c3*Math.pow(t-1,3) + c1*Math.pow(t-1,2);
    }

    // ── Mobile ────────────────────────────────────────────────────────────────
    if (mobile) {
      gsap.set([brandText, portraitWrap, portraitOver, mosaic], { clearProps: "all" });

      // All tiles start hidden
      gsap.set(mosaicTiles, { scale: 0, opacity: 0 });

      // Center slot starts at normal size (no jump)
      gsap.set(mosaicSlot, { scale: 1, opacity: 1, zIndex: 10 });

      const slotLabel = mosaicSlot.querySelector(".cs-mosaic-slot-label");
      if (slotLabel) slotLabel.innerHTML = 'Built for<br><span class="cs-accent">Impact</span>';

      ScrollTrigger.create({
        trigger: section,
        start:   "top 60%",
        once:    true,
        onEnter: function () {
          mosaicTiles.forEach(function (tile, i) {
            gsap.to(tile, {
              scale:    1,
              opacity:  TILE_OPACITY,
              duration: 0.6,
              delay:    tileDelays[i] * 0.25,
              ease:     "back.out(1.4)",
            });
          });
        },
      });

      return;
    }

    // ── Desktop only from here ─────────────────────────────────────────────────
    const PW       = Math.round(SW * 0.30);
    const PH       = Math.round(PW * 1.45);
    const FW       = Math.round(SW * 0.42);
    const FH       = SH;
    const FX       = SW / 2 - FW / 2;
    const FY       = 0;
    const TEXT_GAP = 84;

    gsap.set(brandText, {
      clearProps: "all",
      position:   "absolute",
      top:        0,
      left:       0,
      width:      "100%",
      textAlign:  "center",
      zIndex:     10,
    });

    const brandTextH = brandText.offsetHeight;
    const TEXT_TOP   = SH * 0.18;
    const PX         = SW / 2 - PW / 2;
    const PY         = TEXT_TOP + brandTextH + TEXT_GAP;

    gsap.set(brandText, { y: TEXT_TOP });

    gsap.set(portraitWrap, {
      clearProps: "transform",
      position:   "absolute",
      top:        0,
      left:       0,
      x:          PX,
      y:          PY,
      width:      PW,
      height:     PH,
      zIndex:     5,
    });

    gsap.set(mosaic,      { opacity: 0 });
    gsap.set(mosaicTiles, { scale: 0, opacity: 0 });

    syncOverlay(PX, PY, PW, PH);

    // ── Slot rect — cached to avoid per-frame reflow ──────────────────────────
    let cachedSlotRect = null;

    function getSlotRect() {
      if (cachedSlotRect) return cachedSlotRect;
      const a = mosaicSlot.getBoundingClientRect();
      const b = sticky.getBoundingClientRect();
      cachedSlotRect = { top: a.top-b.top, left: a.left-b.left, width: a.width, height: a.height };
      return cachedSlotRect;
    }

    function syncOverlay(x, y, w, h) {
      if (!portraitOver) return;
      gsap.set(portraitOver, {
        position: "absolute",
        top: 0, left: 0,
        x: x, y: y,
        width: w, height: h,
        zIndex: 7,
        overflow: "hidden",
      });
      if (portraitLabel) {
        portraitLabel.style.fontSize = Math.max(9, Math.round(w * 0.07)) + "px";
      }
    }

    let labelState = "large";
    function setLabel(state) {
      if (!portraitLabel || labelState === state) return;
      portraitLabel.innerHTML = state === "large"
        ? '<span class="cs-accent">More</span> Than an Athlete'
        : 'Built for<br><span class="cs-accent">Impact</span>';
      labelState = state;
    }

    // ── Progress driver (0 → 1) ───────────────────────────────────────────────
    //  0.00–0.55  Phase 2  — expand portrait, text pushed up
    //  0.55–0.75  Phase 3a — portrait shrinks into slot, label swaps
    //  0.75–1.00  Phase 3b — tiles burst out (wider range = linger longer)
    function applyProgress(p) {
      const e2     = easeInOut(clamp(invLerp(0,    0.55, p), 0, 1));
      const shrink = easeInOut(clamp(invLerp(0.55, 0.75, p), 0, 1));

      if (p < 0.55) {
        gsap.set(mosaic,      { opacity: 0 });
        gsap.set(mosaicTiles, { scale: 0, opacity: 0 });

        const curX = lerp(PX, FX, e2);
        const curY = lerp(PY, FY, e2);
        const curW = lerp(PW, FW, e2);
        const curH = lerp(PH, FH, e2);

        gsap.set(portraitWrap, { x: curX, y: curY, width: curW, height: curH });
        syncOverlay(curX, curY, curW, curH);

        const textY = curY - TEXT_GAP - brandTextH;
        gsap.set(brandText, {
          y:       textY,
          opacity: (textY + brandTextH) <= 0 ? 0 : 1,
        });

        setLabel("large");

      } else if (p < 0.75) {
        gsap.set(mosaic,      { opacity: 1 });
        gsap.set(mosaicTiles, { scale: 0, opacity: 0 });
        gsap.set(brandText,   { opacity: 0 });

        const s    = getSlotRect();
        const curX = lerp(FX, s.left,   shrink);
        const curY = lerp(FY, s.top,    shrink);
        const curW = lerp(FW, s.width,  shrink);
        const curH = lerp(FH, s.height, shrink);

        gsap.set(portraitWrap, { x: curX, y: curY, width: curW, height: curH, zIndex: 6 });
        syncOverlay(curX, curY, curW, curH);
        setLabel("small");

      } else {
        gsap.set(mosaic,    { opacity: 1 });
        gsap.set(brandText, { opacity: 0 });

        const s = getSlotRect();
        gsap.set(portraitWrap, { x: s.left, y: s.top, width: s.width, height: s.height, zIndex: 6 });
        syncOverlay(s.left, s.top, s.width, s.height);

        // Wider window (0.65) + smaller start offset (0.25) = tiles linger longer
        const popP = invLerp(0.75, 1.0, p);
        mosaicTiles.forEach(function (tile, i) {
          const start = tileDelays[i] * 0.25;
          const tp    = clamp(invLerp(start, start + 0.65, popP), 0, 1);
          gsap.set(tile, { scale: easeOutBack(tp), opacity: TILE_OPACITY });
        });
      }
    }

    // ── ScrollTrigger ─────────────────────────────────────────────────────────
    ScrollTrigger.create({
      trigger:  section,
      start:    "top top",
      end:      () => "+=" + (section.offsetHeight - window.innerHeight),
      scrub:    1.5,
      onUpdate: function (self) {
        applyProgress(self.progress);
      },
    });

    applyProgress(0);
    ScrollTrigger.refresh();

    window.addEventListener("resize", function () {
      cachedSlotRect = null;
      ScrollTrigger.refresh();
    });
  }

  // ── Boot ───────────────────────────────────────────────────────────────────
  window.addEventListener("load", function () {
    requestAnimationFrame(function () {
      requestAnimationFrame(init);
    });
  });

})();

/**
 * Brand Statement Section
 */
(function () {

    /* ── 1. Marquee ── */
    const logos = [
        { text: "Recess Athletic Club",   cls: "" },
        { text: "Rise Up",                cls: "cs-upper" },
        { text: "44Hoops Foundation",     cls: "" },
        { text: "Revibe",                 cls: "cs-script" },
        { text: "Fuel Nutrition Co.",     cls: "" },
        { text: "MoveFit Performance",    cls: "cs-upper" },
        { text: "Crumbl Cookies Ontario", cls: "cs-serif" },
        { text: "Canurta Therapeutics",   cls: "" },
    ];

    const track = document.getElementById("cs-marquee-track");
    if (track) {
        [...logos, ...logos, ...logos, ...logos].forEach(function (logo) {
            const span = document.createElement("span");
            span.className = "cs-logo-item" + (logo.cls ? " " + logo.cls : "");
            span.textContent = logo.text;
            track.appendChild(span);
        });
    }

    /* ── 2. Word splitting ── */
    const headline = document.getElementById("cs-brand-headline");
    if (!headline) return;

    const fullText = "Built through years of discipline in sport and expanded through a thoughtful approach to business. Defined by a lasting commitment to impact, community, and opportunities beyond the game.";

    fullText.split(/(\s+)/).forEach(function (token) {
        const span = document.createElement("span");
        span.className = token.trim() === "" ? "cs-word-space" : "cs-word";
        span.textContent = token;
        headline.appendChild(span);
    });

    /* ── 3. ScrollTrigger ── */
    const wrapper = document.getElementById("brand-statement-wrapper");
    const words   = document.querySelectorAll("#cs-brand-headline .cs-word");

    if (!wrapper || !words.length) return;

    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
        console.warn("brand-statement.js: GSAP or ScrollTrigger not loaded.");
        return;
    }

    gsap.registerPlugin(ScrollTrigger);

    ScrollTrigger.create({
        trigger : wrapper,
        start   : "top top",
        end     : "bottom bottom",
        scrub   : 0.6,
        onUpdate: function (self) {
            var litCount = Math.round(self.progress * words.length);
            for (var i = 0; i < words.length; i++) {
                words[i].classList.toggle("cs-lit", i < litCount);
            }
        }
    });

})();

/**
 * Brand Pillar Section
 */
(function () {
    const section = document.getElementById('brand-pillars');
    if (!section) return;

    const words  = section.querySelectorAll('.cs-pillar-word');
    const texts  = section.querySelectorAll('.cs-pillar-text');
    const images = section.querySelectorAll('.cs-pillar-img-wrapper');
    const spacer = section.querySelector('.cs-pillars-spacer');
    const bar    = document.getElementById('cs-progress-bar');
    let current  = -1;

    function activateAll() {
        [words, texts, images].forEach(function (list) {
            list.forEach(function (el) {
                el.classList.add('is-active');
            });
        });
        if (bar) bar.style.width = '100%';
    }

    function activate(i) {
        if (i === current) return;
        current = i;
        [words, texts, images].forEach(function (list) {
            list.forEach(function (el) {
                el.classList.toggle('is-active', +el.dataset.pillar === i);
            });
        });
    }

    function onScroll() {
        if (!spacer || window.innerWidth < 1025) {
            activateAll();
            return;
        }

        const rect     = section.getBoundingClientRect();
        const total    = section.offsetHeight - window.innerHeight;
        const progress = Math.max(0, Math.min(1, -rect.top / total));
        const index    = Math.min(2, Math.floor(progress * 3));

        activate(index);

        // Drive bar from raw progress so it fills continuously across all slides
        if (bar) bar.style.width = (progress * 100) + '%';
    }

    // Init
    if (window.innerWidth < 1025) {
        activateAll();
    } else {
        words[0]  && words[0].classList.add('is-active');
        texts[0]  && texts[0].classList.add('is-active');
        images[0] && images[0].classList.add('is-active');
        current = 0;
        if (bar) bar.style.width = '0%';
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
})();

