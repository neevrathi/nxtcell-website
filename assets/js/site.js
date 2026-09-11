/* NXTCell Mobility — site behaviour. No dependencies. */
(function () {
  'use strict';

  /* --- sticky header shadow --- */
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-stuck', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* --- mobile nav --- */
  var toggle = document.querySelector('.nav__toggle');
  var links = document.getElementById('nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      links.classList.toggle('is-open', !open);
    });
    links.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        toggle.setAttribute('aria-expanded', 'false');
        links.classList.remove('is-open');
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && links.classList.contains('is-open')) {
        toggle.setAttribute('aria-expanded', 'false');
        links.classList.remove('is-open');
        toggle.focus();
      }
    });
  }

  /* --- scroll reveal --- */
  var revealables = document.querySelectorAll('.reveal');
  if (revealables.length) {
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
      revealables.forEach(function (el) { io.observe(el); });
    } else {
      revealables.forEach(function (el) { el.classList.add('in'); });
    }
  }

  /* --- current year --- */
  var y = document.getElementById('year');
  if (y) { y.textContent = new Date().getFullYear(); }


  /* --- product banner carousel --- */
  (function () {
    var banner = document.querySelector('.banner');
    if (!banner) return;
    var track = banner.querySelector('.banner__track');
    var slides = Array.prototype.slice.call(banner.querySelectorAll('.banner__slide'));
    var dotsWrap = banner.querySelector('.banner__dots');
    if (!track || slides.length < 2) return;

    var index = 0, timer = null, DELAY = 6000;

    slides.forEach(function (s, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('role', 'tab');
      b.setAttribute('aria-label', 'Show slide ' + (i + 1) + ' of ' + slides.length);
      b.addEventListener('click', function () { go(i, true); });
      dotsWrap.appendChild(b);
    });
    var dots = Array.prototype.slice.call(dotsWrap.children);

    function go(i, userInitiated) {
      index = (i + slides.length) % slides.length;
      track.style.transform = 'translateX(' + (-index * 100) + '%)';
      dots.forEach(function (d, n) { d.setAttribute('aria-selected', String(n === index)); });
      slides.forEach(function (s, n) { s.setAttribute('aria-hidden', String(n !== index)); });
      dotsWrap.classList.toggle('on-dark', slides[index].classList.contains('banner__slide--c'));
      if (userInitiated) restart();
    }
    function next() { go(index + 1); }
    function prev() { go(index - 1); }
    function start() {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      timer = setInterval(next, DELAY);
    }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }
    function restart() { stop(); start(); }

    var nextBtn = banner.querySelector('.banner__arrow--next');
    var prevBtn = banner.querySelector('.banner__arrow--prev');
    if (nextBtn) nextBtn.addEventListener('click', function () { next(); restart(); });
    if (prevBtn) prevBtn.addEventListener('click', function () { prev(); restart(); });

    banner.addEventListener('mouseenter', stop);
    banner.addEventListener('mouseleave', start);
    banner.addEventListener('focusin', stop);
    banner.addEventListener('focusout', start);

    /* touch swipe */
    var x0 = null;
    banner.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; stop(); }, { passive: true });
    banner.addEventListener('touchend', function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 45) { dx < 0 ? next() : prev(); }
      x0 = null; start();
    }, { passive: true });

    document.addEventListener('keydown', function (e) {
      if (!banner.matches(':hover') && !banner.contains(document.activeElement)) return;
      if (e.key === 'ArrowRight') { next(); restart(); }
      if (e.key === 'ArrowLeft') { prev(); restart(); }
    });

    go(0);
    start();
  })();

  /* --- enquiry form --- */
  var form = document.getElementById('enquiry-form');
  if (!form) return;

  var statusEl = form.querySelector('.form-status');
  var submitBtn = form.querySelector('button[type="submit"]');
  var endpoint = form.getAttribute('data-endpoint') || '';
  var fallbackTo = form.getAttribute('data-fallback') || '';

  function setStatus(msg, kind) {
    if (!statusEl) return;
    statusEl.textContent = msg;
    statusEl.className = 'form-status show ' + kind;
  }

  function showError(input, message) {
    input.setAttribute('aria-invalid', 'true');
    var err = input.parentElement.querySelector('.err');
    if (err) { err.textContent = message; err.classList.add('show'); }
  }
  function clearError(input) {
    input.removeAttribute('aria-invalid');
    var err = input.parentElement.querySelector('.err');
    if (err) { err.classList.remove('show'); }
  }

  var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function validate() {
    var ok = true;
    form.querySelectorAll('[data-required]').forEach(function (input) {
      clearError(input);
      var v = (input.value || '').trim();
      if (!v) { showError(input, 'This field is required.'); ok = false; return; }
      if (input.type === 'email' && !emailRe.test(v)) {
        showError(input, 'Enter a valid email address.'); ok = false;
      }
    });
    return ok;
  }

  form.addEventListener('input', function (e) {
    if (e.target.hasAttribute('data-required') && e.target.getAttribute('aria-invalid')) {
      clearError(e.target);
    }
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (form.querySelector('[name="_gotcha"]') && form.querySelector('[name="_gotcha"]').value) return;
    if (!validate()) {
      setStatus('Please correct the highlighted fields and try again.', 'bad');
      var firstBad = form.querySelector('[aria-invalid="true"]');
      if (firstBad) firstBad.focus();
      return;
    }

    var data = {};
    new FormData(form).forEach(function (v, k) { if (k.charAt(0) !== '_') data[k] = v; });
    data.page = window.location.pathname;

    /* No endpoint configured yet → open the visitor's mail client so the
       enquiry still reaches the company rather than vanishing. */
    if (!endpoint) {
      var subject = 'Business enquiry from ' + (data.name || 'website');
      var lines = Object.keys(data).map(function (k) { return k + ': ' + data[k]; });
      window.location.href = 'mailto:' + fallbackTo +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(lines.join('\n'));
      setStatus('Opening your email app to send this enquiry to ' + fallbackTo + '.', 'ok');
      return;
    }

    submitBtn.disabled = true;
    var original = submitBtn.textContent;
    submitBtn.textContent = 'Sending…';
    setStatus('Sending your enquiry…', 'ok');

    fetch(endpoint, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(data)
    }).then(function () {
      form.reset();
      setStatus('Thank you — your enquiry has been received. Our team will get back to you shortly.', 'ok');
    }).catch(function () {
      setStatus('Something went wrong. Please email us directly at ' + fallbackTo + '.', 'bad');
    }).then(function () {
      submitBtn.disabled = false;
      submitBtn.textContent = original;
    });
  });
})();
