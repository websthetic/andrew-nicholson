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

  /* ── 3. ScrollTrigger (DOM is ready now) ── */
  const wrapper = document.getElementById("brand-statement-wrapper");
  const words   = document.querySelectorAll("#cs-brand-headline .cs-word");

  if (!wrapper || !words.length) return;

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