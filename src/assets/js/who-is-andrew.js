/**
 * Who is Andrew Section — GSAP ScrollTrigger Animation
 *
 * Desktop:
 * Phase 1  (initial)        Brand text top-center, portrait below it.
 *                           Overlay: "More Than an Athlete?"
 * Phase 2  (scroll)         Portrait grows upward to fill viewport.
 *                           Brand text rides up with portrait top edge and exits.
 * Phase 3a (scroll)         Portrait shrinks into center mosaic slot.
 *                           Overlay swaps to "Built for Impact."
 * Phase 3b (portrait lands) Tiles pop out.
 *
 * Mobile:
 * Phase 1  (initial)        Brand text above. Center portrait slot larger (1.3x),
 *                           label: "More Than an Athlete?". Surrounding tiles hidden.
 * Phase 2  (on viewport)    Surrounding tiles pop in. Center shrinks to 1x.
 *                           Label swaps to "Built for Impact."
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

      // Surrounding tiles start hidden
      gsap.set(mosaicTiles, { scale: 0, opacity: 0 });

      // Center slot starts enlarged
      gsap.set(mosaicSlot, { scale: 1.3, opacity: 1, zIndex: 10 });

      // Set question label
      const slotLabel = mosaicSlot.querySelector(".cs-mosaic-slot-label");
      if (slotLabel) slotLabel.textContent = "More Than an Athlete?";

      ScrollTrigger.create({
        trigger: section,
        start:   "top 75%",
        once:    true,
        onEnter: function () {

          // Surrounding tiles pop in with stagger
          mosaicTiles.forEach(function (tile, i) {
            gsap.to(tile, {
              scale:    1,
              opacity:  TILE_OPACITY,
              duration: 0.5,
              delay:    tileDelays[i] * 0.3,
              ease:     "back.out(1.7)",
            });
          });

          // Center slot shrinks to match grid, then swap label
          gsap.to(mosaicSlot, {
            scale:    1,
            duration: 0.5,
            delay:    0.15,
            ease:     "power2.inOut",
            onComplete: function () {
              if (slotLabel) slotLabel.textContent = "Built for Impact.";
            },
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
      portraitLabel.textContent = state === "large"
        ? "More Than an Athlete?"
        : "Built for Impact.";
      labelState = state;
    }

    // ── Progress driver (0 → 1) ───────────────────────────────────────────────
    //  0.00–0.55  Phase 2  — expand portrait, text pushed up
    //  0.55–0.82  Phase 3a — portrait shrinks into slot, label swaps
    //  0.82–1.00  Phase 3b — tiles burst out
    function applyProgress(p) {
      const e2     = easeInOut(clamp(invLerp(0,    0.55, p), 0, 1));
      const shrink = easeInOut(clamp(invLerp(0.55, 0.82, p), 0, 1));

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

      } else if (p < 0.82) {
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

        const popP = invLerp(0.82, 1.0, p);
        mosaicTiles.forEach(function (tile, i) {
          const start = tileDelays[i] * 0.35;
          const tp    = clamp(invLerp(start, start + 0.45, popP), 0, 1);
          gsap.set(tile, { scale: easeOutBack(tp), opacity: TILE_OPACITY });
        });
      }
    }

    // ── Reverse scroll throttle ───────────────────────────────────────────────
  ScrollTrigger.create({
      trigger:  section,
      start:    "top top",
      end: () => "+=" + (section.offsetHeight - window.innerHeight),
      scrub:    1.5,
      onUpdate: function (self) {
        applyProgress(self.progress);
      },
    });

    applyProgress(0);

    window.addEventListener("resize", function () {
      cachedSlotRect = null;
      ScrollTrigger.refresh();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

})();