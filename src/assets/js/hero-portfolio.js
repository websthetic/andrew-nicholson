(function () {

  var videos = document.querySelectorAll('#portfolio .cs-video');
  if (!videos.length) return;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      var video = entry.target;
      if (entry.isIntersecting) {
        if (video.readyState === 0) {
          video.load();
        }
        video.play().catch(function () {});
      } else {
        video.pause();
      }
    });
  }, {
    threshold: 0.2
  });

  videos.forEach(function (video) {
    observer.observe(video);
  });

})();