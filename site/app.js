(function () {
  'use strict';
  var root = document.documentElement;
  var themeBtn = document.getElementById('theme-toggle');
  function renderTheme() {
    var dark = root.classList.contains('dark');
    themeBtn.textContent = dark ? '○' : '●';
    themeBtn.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
    themeBtn.setAttribute('aria-pressed', String(dark));
  }
  themeBtn.addEventListener('click', function () {
    var dark = root.classList.toggle('dark');
    try { localStorage.setItem('theme', dark ? 'dark' : 'light'); } catch (e) {}
    renderTheme();
  });
  renderTheme();

  var menuBtn = document.getElementById('menu-toggle');
  var panel = document.getElementById('menu-panel');
  var backdrop = document.getElementById('menu-backdrop');
  var main = document.getElementById('whitepaper');
  var links = Array.from(panel.querySelectorAll('a'));
  function setMenu(open, restoreFocus) {
    panel.inert = !open;
    panel.classList.toggle('open', open);
    backdrop.classList.toggle('open', open);
    document.body.classList.toggle('menu-open', open);
    panel.setAttribute('aria-hidden', String(!open));
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close contents' : 'Open contents');
    menuBtn.textContent = open ? '×' : '≡';
    main.inert = open;
    themeBtn.inert = open;
    links.forEach(function (a) { a.tabIndex = open ? 0 : -1; });
    if (open) links[0].focus();
    else if (restoreFocus !== false) menuBtn.focus();
  }
  menuBtn.addEventListener('click', function () { setMenu(!panel.classList.contains('open')); });
  backdrop.addEventListener('click', function () { setMenu(false); });
  document.addEventListener('keydown', function (e) {
    if (!panel.classList.contains('open')) return;
    if (e.key === 'Escape') { e.preventDefault(); setMenu(false); }
    if (e.key === 'Tab') {
      var focusable = [menuBtn].concat(links);
      var index = focusable.indexOf(document.activeElement);
      if (e.shiftKey && index <= 0) { e.preventDefault(); focusable[focusable.length - 1].focus(); }
      else if (!e.shiftKey && index === focusable.length - 1) { e.preventDefault(); menuBtn.focus(); }
    }
  });
  links.forEach(function (a) {
    a.addEventListener('click', function () {
      setMenu(false, false);
      var target = document.getElementById(a.hash.slice(1));
      if (target) target.focus({preventScroll: true});
    });
  });
})();
