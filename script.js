(function () {
  const portal = document.getElementById('portal');
  const img = document.getElementById('scare');
  const audio = document.getElementById('sound');
  const btn = document.getElementById('connect');
  const check = document.getElementById('check');
  const accept = document.getElementById('accept');
  const clock = document.getElementById('clock');
  let started = false, revealed = false;

  audio.loop = true;
  audio.volume = 1.0;

  // Live "Philippine Standard Time" clock
  function tick() {
    try {
      clock.textContent = new Date().toLocaleString('en-US', {
        timeZone: 'Asia/Manila', weekday: 'long', year: 'numeric', month: 'long',
        day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric'
      });
    } catch (e) { clock.textContent = new Date().toLocaleString(); }
  }
  tick(); setInterval(tick, 1000);

  // Missing image: plain black screen instead of a broken icon
  img.addEventListener('error', function () { img.style.display = 'none'; });

  // Fallback in case a browser ignores the loop attribute
  audio.addEventListener('ended', function () { audio.currentTime = 0; audio.play().catch(function () {}); });

  function reveal() {
    if (revealed) return;
    revealed = true;
    document.body.classList.add('scared');
    portal.remove();
    img.classList.add('show');
    audio.muted = false;
    audio.volume = 1.0;
    if (audio.paused) audio.play().catch(function () {});
  }

  btn.addEventListener('click', function () {
    if (started) return;
    if (!check.checked) {
      accept.classList.remove('shake'); void accept.offsetWidth; accept.classList.add('shake');
      return;
    }
    started = true;
    btn.disabled = true;
    btn.innerHTML = '<span class="spin"></span>Connecting...';

    // Start audio silently now (inside the click) so the browser allows it, unmute at reveal
    audio.muted = true;
    audio.play().catch(function () {});

    // Go fullscreen if the browser allows it
    try {
      const el = document.documentElement;
      (el.requestFullscreen || el.webkitRequestFullscreen || function () {}).call(el);
    } catch (e) {}

    setTimeout(reveal, 2200);
  });

  // Resume audio if the tab was backgrounded
  document.addEventListener('visibilitychange', function () {
    if (revealed && !document.hidden && audio.paused) audio.play().catch(function () {});
  });
})();
