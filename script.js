(function () {
  const img = document.getElementById('scare');
  const audio = document.getElementById('sound');
  const entry = document.getElementById('entry');
  let revealed = false;

  audio.loop = true;
  audio.volume = 1.0;

  function reveal() {
    if (revealed) return;
    revealed = true;
    entry.remove();
    img.classList.add('show');
  }

  function tryPlay(fromClick) {
    let result;
    try { result = audio.play(); } catch (e) {}
    Promise.resolve(result)
      .then(reveal)
      .catch(function () {
        // Autoplay blocked: keep the entry screen.
        // Click with a missing/broken MP3: still show the image.
        if (fromClick) reveal();
      });
  }

  // Missing image: stay on plain black instead of showing a broken icon.
  img.addEventListener('error', function () { img.style.display = 'none'; });

  // Fallback in case a browser ignores the loop attribute.
  audio.addEventListener('ended', function () {
    audio.currentTime = 0;
    audio.play().catch(function () {});
  });

  // Resume audio if the browser paused it while the tab was in the background.
  document.addEventListener('visibilitychange', function () {
    if (revealed && !document.hidden && audio.paused) audio.play().catch(function () {});
  });

  entry.addEventListener('click', function () { tryPlay(true); });
  window.addEventListener('load', function () { tryPlay(false); });
})();
