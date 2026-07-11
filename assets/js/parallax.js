// V1.0.0
(function () {
  'use strict';

  // Each [data-parallax] element drifts vertically at its own speed as its
  // container moves through the viewport, so the polaroids parallax and spill
  // across section boundaries. Driven by a requestAnimationFrame loop that
  // reads getBoundingClientRect (input-agnostic: wheel, touch, scrollbar) and
  // eases each element toward its target, so stepped wheel scrolling still
  // produces smooth motion. Runs on all screen sizes; only reduced-motion off.
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  var EASE = 0.08;
  var items = [];
  var reference = null;

  function disabled() {
    return reduceMotion.matches;
  }

  function init() {
    items = Array.prototype.slice
      .call(document.querySelectorAll('[data-parallax]'))
      .map(function (el) {
        return { el: el, speed: parseFloat(el.getAttribute('data-parallax')) || 0, current: 0 };
      });
    if (!items.length) return;

    // A non-transformed anchor whose viewport position reflects the scroll.
    reference = document.querySelector('.monaco-about__photos') || items[0].el.parentNode;

    requestAnimationFrame(loop);
  }

  function loop() {
    if (disabled()) {
      items.forEach(function (it) {
        it.current = 0;
        it.el.style.transform = '';
      });
    } else {
      var rect = reference.getBoundingClientRect();
      var delta = rect.top + rect.height / 2 - window.innerHeight / 2;
      items.forEach(function (it) {
        var target = -delta * it.speed;
        it.current += (target - it.current) * EASE;
        it.el.style.transform = 'translate3d(0,' + it.current.toFixed(2) + 'px,0)';
      });
    }
    requestAnimationFrame(loop);
  }

  if (document.readyState !== 'loading') {
    init();
  } else {
    document.addEventListener('DOMContentLoaded', init);
  }
})();
