document.addEventListener('DOMContentLoaded', function () {

  /* ---- Sticky nav solid state ---- */
  var nav = document.getElementById('siteNav');
  var toTop = document.getElementById('toTop');
  function onScroll() {
    if (window.scrollY > 60) { nav.classList.add('solid'); } else { nav.classList.remove('solid'); }
    if (window.scrollY > 700) { toTop.classList.add('show'); } else { toTop.classList.remove('show'); }
    updateActiveLink();
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  toTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---- Mobile nav toggle ---- */
  var toggle = document.getElementById('navToggle');
  var links = document.getElementById('navLinks');
  toggle.addEventListener('click', function () {
    links.classList.toggle('open');
  });
  links.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () { links.classList.remove('open'); });
  });

  /* ---- Active nav link on scroll ---- */
  var navAnchors = Array.prototype.slice.call(links.querySelectorAll('a'));
  var sections = navAnchors.map(function (a) {
    return document.querySelector(a.getAttribute('href'));
  }).filter(Boolean);

  function updateActiveLink() {
    var pos = window.scrollY + 140;
    var current = null;
    sections.forEach(function (sec) {
      if (sec.offsetTop <= pos) current = sec;
    });
    navAnchors.forEach(function (a) { a.classList.remove('active'); });
    if (current) {
      var match = navAnchors.find(function (a) { return a.getAttribute('href') === '#' + current.id; });
      if (match) match.classList.add('active');
    }
  }

  /* ---- Reveal on scroll (used sparingly) ---- */
  var revealEls = document.querySelectorAll('.reveal');
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.25 });
  revealEls.forEach(function (el) { io.observe(el); });

  /* ---- Animated stat counters ---- */
  var counters = document.querySelectorAll('[data-count]');
  var counted = false;
  var statSection = document.querySelector('.sacrifice');
  var countIO = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting && !counted) {
        counted = true;
        counters.forEach(animateCount);
        countIO.disconnect();
      }
    });
  }, { threshold: 0.4 });
  if (statSection) countIO.observe(statSection);

  function animateCount(el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    var duration = 1200;
    var start = null;
    function step(ts) {
      if (!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target;
      }
    }
    requestAnimationFrame(step);
  }

  /* ---- Lightbox gallery ---- */
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxClose = document.getElementById('lightboxClose');
  document.querySelectorAll('#galleryGrid a').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      lightboxImg.src = a.getAttribute('href');
      lightboxImg.alt = a.getAttribute('data-caption') || '';
      lightbox.classList.add('show');
    });
  });
  function closeLightbox() { lightbox.classList.remove('show'); lightboxImg.src = ''; }
  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', function (e) { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeLightbox(); });

});
