(function () {
  'use strict';
  var layer = document.querySelector('.ascii-waves');
  if (!layer) return;
  var left = layer.querySelector('.ascii-wave-left');
  var right = layer.querySelector('.ascii-wave-right');
  var desktop = window.matchMedia('(min-width: 1280px) and (hover: hover) and (pointer: fine)');
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var rows = 128;
  var lineHeight = 12;
  var period = rows * lineHeight;
  var repeats = 0;
  var pending = false;

  function makeWave(phase, mirror) {
    var offsets = [-5, -3, -1, 0, 1, 3, 5];
    var lines = [];
    for (var row = 0; row < rows; row++) {
      var t = row / rows * Math.PI * 2 + phase;
      var center = Math.round(11 + Math.sin(t) * 4);
      if (mirror) center = 22 - center;
      var line = Array(23).fill(' ');
      var marks = ['.', ':', '~', Math.cos(t) > 0 ? '/' : '\\', '~', ':', '.'];
      offsets.forEach(function (offset, index) { line[center + offset] = marks[index]; });
      lines.push(line.join(''));
    }
    return lines.join('\n') + '\n';
  }

  var leftTile = makeWave(.25, false);
  var rightTile = makeWave(2.4, true);
  function paint() {
    pending = false;
    if (!desktop.matches) return;
    var nextRepeats = Math.ceil(window.innerHeight / period) + 2;
    if (nextRepeats !== repeats) {
      repeats = nextRepeats;
      left.textContent = leftTile.repeat(repeats);
      right.textContent = rightTile.repeat(repeats);
    }
    // A fixed layer moves by 0.2px for each 1px of document scrolling.
    // Repeated identical tiles keep the design continuous on long pages.
    var offset = reducedMotion.matches ? 0 : (Math.max(0, window.scrollY) * .2) % period;
    left.style.transform = 'translate3d(0,' + (-offset) + 'px,0)';
    right.style.transform = 'translate3d(0,' + (-offset) + 'px,0)';
  }
  function schedule() {
    if (!desktop.matches) return;
    if (pending) return;
    pending = true;
    window.requestAnimationFrame(paint);
  }
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
  desktop.addEventListener('change', schedule);
  reducedMotion.addEventListener('change', schedule);
  paint();
})();
