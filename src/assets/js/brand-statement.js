(function () {
  gsap.registerPlugin(ScrollTrigger);

  var wrapper = document.getElementById("brand-statement-wrapper");
  var words   = document.querySelectorAll("#cs-brand-headline .cs-word");

  if (!wrapper || !words.length) return;

  ScrollTrigger.create({
    trigger : wrapper,
    start   : "top top",
    end     : "bottom bottom",
    scrub   : 0.6,
    onUpdate: function (self) {
      var litCount = Math.round(self.progress * words.length);
      for (var i = 0; i < words.length; i++) {
        if (i < litCount) {
          words[i].classList.add("cs-lit");
        } else {
          words[i].classList.remove("cs-lit");
        }
      }
    }
  });
})();