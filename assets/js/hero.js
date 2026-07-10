(function () {
  'use strict';

  // Generic open/close wiring shared by the trailer + letter overlays:
  // click to open, then close button / click-outside / Escape.
  function setupModal(opts) {
    if (!opts.trigger || !opts.modal) return;
    var modal = opts.modal;
    var closeBtn = modal.querySelector(opts.closeSelector);

    opts.trigger.addEventListener('click', function (e) {
      e.preventDefault();
      if (opts.onOpen) opts.onOpen();
      modal.hidden = false;
      document.body.classList.add(opts.openClass);
    });

    function close() {
      modal.hidden = true;
      if (opts.onClose) opts.onClose();
      document.body.classList.remove(opts.openClass);
    }

    if (closeBtn) closeBtn.addEventListener('click', close);
    modal.addEventListener('click', function (e) {
      if (e.target === modal) close();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !modal.hidden) close();
    });
  }

  // Full trailer overlay (YouTube embed injected on open, cleared on close).
  var trailerTrigger = document.querySelector('.js-trailer-trigger');
  var trailerModal = document.querySelector('.monaco-trailer');
  if (trailerTrigger && trailerModal) {
    var videoBox = trailerModal.querySelector('.monaco-trailer__video');
    setupModal({
      trigger: trailerTrigger,
      modal: trailerModal,
      closeSelector: '.monaco-trailer__close',
      openClass: 'monaco-trailer-open',
      onOpen: function () { videoBox.innerHTML = buildEmbed(trailerTrigger.getAttribute('href')); },
      onClose: function () { videoBox.innerHTML = ''; }, // stops playback
    });
  }

  // Developers' letter overlay (static content already in the DOM).
  setupModal({
    trigger: document.querySelector('.js-letter-trigger'),
    modal: document.querySelector('.monaco-letter'),
    closeSelector: '.monaco-letter__close',
    openClass: 'monaco-letter-open',
  });

  function buildEmbed(url) {
    var id = youtubeId(url);
    if (id) {
      var src = 'https://www.youtube-nocookie.com/embed/' + id +
        '?autoplay=1&rel=0&playsinline=1';
      return '<iframe src="' + src + '" allow="autoplay; encrypted-media; fullscreen" allowfullscreen></iframe>';
    }
    return '<iframe src="' + url + '" allow="autoplay; fullscreen" allowfullscreen></iframe>';
  }

  function youtubeId(url) {
    var m = String(url).match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/);
    return m ? m[1] : '';
  }

  // Self-hosted MP4 looping behind the CLUTCH letterforms: loops natively (no
  // UI, no YouTube bot-check), we just fade the cover out once it starts.
  var video = document.querySelector('.monaco-hero__clutch-video');
  if (video) {
    var clutch = video.closest('.monaco-hero__clutch');
    video.addEventListener('playing', function () {
      if (clutch) clutch.classList.add('is-playing');
    });
  }
})();
