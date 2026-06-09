(function () {
    var canvas = document.querySelector('.cs-grain');
    var ctx    = canvas.getContext('2d');

    function resizeCanvas() {
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    function drawGrain() {
        var w         = canvas.width;
        var h         = canvas.height;
        var imageData = ctx.createImageData(w, h);
        var buffer    = imageData.data;

        for (var i = 0; i < buffer.length; i += 4) {
            var val   = Math.random() * 255 | 0;
            buffer[i]   = val;
            buffer[i+1] = val;
            buffer[i+2] = val;
            buffer[i+3] = 255;
        }

        ctx.putImageData(imageData, 0, 0);
        requestAnimationFrame(drawGrain);
    }

    drawGrain();

    var hero  = document.getElementById('hero');
    var video = hero.querySelector('video.cs-background');
    var btn   = hero.querySelector('.cs-sound-btn');
    var label = hero.querySelector('.cs-sound-label');

    if (!btn || !video) return;

    btn.addEventListener('click', function () {
        var isOn = hero.classList.toggle('cs-sound-on');
        video.muted = !isOn;
        btn.setAttribute('aria-pressed', isOn ? 'true' : 'false');
        btn.setAttribute('aria-label', isOn ? 'Mute sound' : 'Unmute sound');
        label.textContent = isOn ? 'Mute' : 'Sound';
    });
})();