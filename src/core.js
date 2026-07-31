/* ═══════════════════════════════════════════════════════════════
   VANT — comportamiento compartido.
   Todo se desactiva si el sistema pide movimiento reducido.
   ═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  var quieto = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Vigía de scroll ──────────────────────────────────────────
     Un solo barrido, sincronizado con requestAnimationFrame, decide
     qué ha entrado en pantalla. Se hizo así, y no con
     IntersectionObserver, porque el observador entrega sus avisos
     por muestreo: con un scroll rápido, o saltando con el teclado,
     los elementos que cruzan la pantalla entre dos muestras nunca se
     anuncian y se quedan invisibles para siempre. Un barrido mide la
     posición real en cada fotograma, así que no puede perder ninguno. */
  var vigilados = [];
  function vigila(el, margen, fn) { vigilados.push({ el: el, m: margen, fn: fn }); }
  function barre() {
    var alto = window.innerHeight;
    for (var i = vigilados.length - 1; i >= 0; i--) {
      var v = vigilados[i];
      var r = v.el.getBoundingClientRect();
      /* Ha entrado si su borde superior ya subió del umbral, o si el
         elemento quedó por encima de la pantalla (scroll rápido). */
      if (r.top < alto * v.m && r.bottom > -alto) {
        v.fn(v.el);
        vigilados.splice(i, 1);
      } else if (r.bottom <= 0) {
        v.fn(v.el);
        vigilados.splice(i, 1);
      }
    }
  }

  /* ── Entradas al hacer scroll, escalonadas entre hermanos ── */
  function entradas() {
    var els = document.querySelectorAll('.rise');
    if (quieto) {
      els.forEach(function (e) { e.classList.add('in'); });
      return;
    }
    els.forEach(function (el) {
      vigila(el, 0.92, function (e) {
        var hermanos = Array.prototype.filter.call(e.parentNode.children, function (n) {
          return n.classList && n.classList.contains('rise');
        });
        e.style.transitionDelay = (Math.min(hermanos.indexOf(e), 6) * 90) + 'ms';
        e.classList.add('in');
      });
    });
  }

  /* ── Barra de progreso de scroll ──────────────────────────── */
  var barraProg;
  function progreso() {
    barraProg = document.querySelector('.progreso i');
  }
  function pintaProgreso() {
    if (!barraProg) return;
    var alto = document.documentElement.scrollHeight - window.innerHeight;
    barraProg.style.height = (alto > 0 ? (window.scrollY / alto) * 100 : 0) + '%';
  }

  /* ── Contadores numéricos ─────────────────────────────────── */
  function contadores() {
    var nums = document.querySelectorAll('[data-contador]');
    if (!nums.length) return;
    /* El valor final vive en el HTML, no en el JS: si la animación no
       llega a ocurrir (sin JS, movimiento reducido, o el elemento nunca
       entra en pantalla) lo que se lee es el dato correcto y no un cero
       que mentiría sobre la medición. */
    function anima(el) {
      var fin = parseFloat(el.dataset.contador);
      var suf = el.dataset.sufijo || '';
      if (quieto) { el.textContent = fin + suf; return; }
      var t0 = null, dur = 1500;
      requestAnimationFrame(function paso(t) {
        if (!t0) t0 = t;
        var p = Math.min((t - t0) / dur, 1);
        el.textContent = Math.round((1 - Math.pow(1 - p, 3)) * fin) + suf;
        if (p < 1) requestAnimationFrame(paso);
      });
    }
    nums.forEach(function (n) {
      if (!quieto) n.textContent = '0' + (n.dataset.sufijo || '');
      vigila(n, 0.85, anima);
    });
  }

  /* ── Barras de la maqueta de medición ─────────────────────── */
  function barras() {
    var fichas = document.querySelectorAll('.ficha');
    if (!fichas.length) return;
    function llena(f) {
      f.querySelectorAll('.barra i').forEach(function (b, k) {
        setTimeout(function () { b.style.width = b.dataset.w + '%'; }, quieto ? 0 : 110 * k);
      });
    }
    fichas.forEach(function (f) { vigila(f, 0.8, llena); });
  }

  /* ── Consulta de paciente que se teclea sola ──────────────── */
  function tecleo() {
    var el = document.querySelector('[data-tecleo]');
    if (!el) return;
    var frases = JSON.parse(el.dataset.tecleo);
    if (quieto) { el.textContent = frases[0]; return; }
    var caret = document.createElement('span');
    caret.className = 'caret';
    caret.setAttribute('aria-hidden', 'true');
    var txt = document.createTextNode('');
    el.textContent = '';
    el.appendChild(txt);
    el.appendChild(caret);
    var i = 0, j = 0, borrando = false;
    (function tick() {
      var f = frases[i];
      j += borrando ? -1 : 1;
      txt.nodeValue = f.slice(0, j);
      var d = borrando ? 20 : 44;
      if (!borrando && j === f.length) { borrando = true; d = 2300; }
      else if (borrando && j === 0) { borrando = false; i = (i + 1) % frases.length; d = 340; }
      setTimeout(tick, d);
    })();
  }

  /* ── Vídeo del hero: diferido, silencioso, con imagen de respaldo ──
     No se carga si el sistema pide movimiento reducido, si la conexión
     es lenta o si el ahorro de datos está activo. Hasta que el vídeo no
     puede reproducirse, lo que se ve es el póster estático. */
  function video() {
    var v = document.querySelector('video[data-src]');
    if (!v) return;
    /* El póster se pone siempre: es el respaldo estático en móvil, con
       conexión lenta y con movimiento reducido. */
    if (v.dataset.poster) v.poster = v.dataset.poster;
    if (!v.dataset.src) return;          /* aún sin assets: se ve .placa */
    var con = navigator.connection || {};
    var lenta = con.saveData === true || /2g/.test(con.effectiveType || '');
    if (quieto || lenta || window.innerWidth < 720) return;
    function carga() {
      v.src = v.dataset.src;
      v.load();
      var p = v.play();
      if (p && p.catch) p.catch(function () { /* sin autoplay: se queda el póster */ });
      v.addEventListener('playing', function () { v.classList.add('visible'); }, { once: true });
    }
    if ('requestIdleCallback' in window) requestIdleCallback(carga, { timeout: 2200 });
    else setTimeout(carga, 1200);
  }

  /* ── Formulario ───────────────────────────────────────────────
     TODO(webhook): conectar aquí el envío real. Sustituir el bloque
     marcado por un fetch() al endpoint que reciba los datos, p. ej.:

       fetch('https://ENDPOINT/auditoria', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(datos)
       })

     Mientras no exista endpoint, el formulario no envía nada a ningún
     sitio: solo valida y muestra el acuse en pantalla. */
  function formulario() {
    var f = document.querySelector('form[data-auditoria]');
    if (!f) return;
    var acuse = f.querySelector('[data-acuse]');
    f.addEventListener('submit', function (ev) {
      ev.preventDefault();
      if (!f.reportValidity()) return;
      var datos = Object.fromEntries(new FormData(f).entries());

      /* ── TODO(webhook): aquí va el envío. ─────────────────── */
      console.info('[VANT] Formulario listo para enviar:', datos);
      /* ─────────────────────────────────────────────────────── */

      acuse.hidden = false;
      acuse.textContent = 'Recibido, ' + (datos.nombre || '').split(' ')[0] +
        '. Le escribimos a ' + datos.email + ' en menos de 24 h laborables para cerrar los 15 minutos.';
      acuse.focus();
      f.querySelector('button[type=submit]').disabled = true;
    });
  }

  /* ── Un único bucle para todo lo que depende del scroll ───── */
  function bucle() {
    var pendiente = false;
    function fotograma() { pintaProgreso(); barre(); pendiente = false; }
    function pide() { if (!pendiente) { pendiente = true; requestAnimationFrame(fotograma); } }
    addEventListener('scroll', pide, { passive: true });
    addEventListener('resize', pide, { passive: true });
    /* Red de seguridad para saltos que no emiten scroll (anclas, buscar
       en la página, restauración de posición al recargar). */
    setInterval(function () { if (vigilados.length) pide(); }, 400);
    fotograma();
  }

  function arranca() {
    entradas(); progreso(); contadores(); barras(); tecleo(); video(); formulario(); bucle();
  }
  if (document.readyState === 'loading') addEventListener('DOMContentLoaded', arranca);
  else arranca();
})();
