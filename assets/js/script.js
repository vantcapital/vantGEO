/* ============================================================
   VANT · Interacciones
   Sobrias y respetuosas con prefers-reduced-motion.
   ============================================================ */
(function () {
  'use strict';

  // Marca que hay JS (activa animaciones progresivas)
  document.documentElement.classList.remove('no-js');

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Año dinámico en el footer ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------- Navbar: estado tras scroll ---------- */
  var nav = document.getElementById('nav');
  var scrolled = false;
  function onScroll() {
    var past = window.scrollY > 24;
    if (past !== scrolled) {
      scrolled = past;
      nav.classList.toggle('is-scrolled', past);
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Menú móvil ---------- */
  var toggle = document.getElementById('navToggle');
  var mobile = document.getElementById('mobileMenu');
  if (toggle && mobile) {
    function closeMenu() {
      mobile.classList.remove('is-open');
      mobile.hidden = true;
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Abrir menú');
    }
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      if (open) {
        closeMenu();
      } else {
        mobile.hidden = false;
        // Forzar reflow para la transición
        void mobile.offsetWidth;
        mobile.classList.add('is-open');
        toggle.setAttribute('aria-expanded', 'true');
        toggle.setAttribute('aria-label', 'Cerrar menú');
      }
    });
    mobile.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeMenu);
    });
    window.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });
  }

  /* ---------- Reveal on scroll ---------- */
  var reveals = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  if (reduceMotion || !('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var io = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.16, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Tarjeta de IA: animación de líneas ---------- */
  var aiCard = document.getElementById('aiCard');
  if (aiCard) {
    if (reduceMotion || !('IntersectionObserver' in window)) {
      aiCard.classList.add('is-animated');
    } else {
      var aiObs = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-animated');
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.4 });
      aiObs.observe(aiCard);
    }
  }

  /* ---------- Contador animado en estadísticas ---------- */
  function animateCount(el) {
    var target = parseFloat(el.getAttribute('data-count-to'));
    if (isNaN(target)) return;
    var prefix = el.getAttribute('data-prefix') || '';
    var suffix = el.getAttribute('data-suffix') || '';
    if (reduceMotion) { el.textContent = prefix + formatEs(target) + suffix; return; }
    var duration = 1400;
    var start = null;
    function frame(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      // easeOutExpo
      var eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
      var val = Math.round(target * eased);
      el.textContent = prefix + formatEs(val) + suffix;
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
  function formatEs(n) {
    return n.toLocaleString('es-ES');
  }
  var counters = Array.prototype.slice.call(document.querySelectorAll('[data-count-to]'));
  if (counters.length) {
    if (!('IntersectionObserver' in window)) {
      counters.forEach(animateCount);
    } else {
      var cObs = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.6 });
      counters.forEach(function (el) { cObs.observe(el); });
    }
  }

  /* ---------- Formulario (placeholder, sin backend) ---------- */
  var form = document.getElementById('auditForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      var done = document.getElementById('formDone');
      var btn = form.querySelector('button[type="submit"]');
      if (btn) { btn.disabled = true; btn.textContent = 'Solicitud enviada'; }
      if (done) { done.hidden = false; }
      // Aquí se conectará el endpoint / calendario real más adelante.
    });
  }
})();
