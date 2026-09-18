/* Rodriguez Drywall — interacciones */
(function () {
  'use strict';

  /* --- cabecera solida al hacer scroll --- */
  var nav = document.querySelector('.nav');
  function onScroll() {
    if (nav) nav.classList.toggle('solid', window.scrollY > 40);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* --- menu movil --- */
  var burger = document.querySelector('.burger');
  var movil = document.querySelector('.movil');
  if (burger && movil) {
    burger.addEventListener('click', function () {
      var abierto = movil.classList.toggle('open');
      burger.setAttribute('aria-expanded', abierto ? 'true' : 'false');
      document.body.style.overflow = abierto ? 'hidden' : '';
    });
    movil.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        movil.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  /* --- aparicion progresiva --- */
  var rv = document.querySelectorAll('.rv');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px' });
    rv.forEach(function (el, i) {
      el.style.transitionDelay = (i % 4) * 70 + 'ms';
      io.observe(el);
    });
  } else {
    rv.forEach(function (el) { el.classList.add('in'); });
  }

  /* --- contadores de la barra de datos --- */
  var nums = document.querySelectorAll('[data-contar]');
  if (nums.length && 'IntersectionObserver' in window) {
    var io2 = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target, fin = parseInt(el.dataset.contar, 10), t0 = null;
        function paso(t) {
          if (!t0) t0 = t;
          var p = Math.min((t - t0) / 1100, 1);
          el.textContent = Math.round(fin * (1 - Math.pow(1 - p, 3)));
          if (p < 1) requestAnimationFrame(paso);
        }
        requestAnimationFrame(paso);
        io2.unobserve(el);
      });
    }, { threshold: 0.6 });
    nums.forEach(function (n) { io2.observe(n); });
  }

  /* --- filtros de galeria --- */
  var filtros = document.querySelectorAll('.filtros button');
  if (filtros.length) {
    filtros.forEach(function (b) {
      b.addEventListener('click', function () {
        filtros.forEach(function (x) { x.classList.remove('on'); });
        b.classList.add('on');
        var f = b.dataset.filtro;
        document.querySelectorAll('.gal').forEach(function (g) {
          g.hidden = !(f === 'todo' || g.dataset.cat === f);
        });
      });
    });
  }

  /* --- formulario: compone el mensaje y lo abre en WhatsApp --- */
  var form = document.querySelector('#form-presupuesto');
  if (form) {
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var d = new FormData(form);
      var txt =
        'Hola Rodriguez Drywall, quiero pedir presupuesto.\n\n' +
        'Nombre: ' + (d.get('nombre') || '-') + '\n' +
        'Teléfono: ' + (d.get('telefono') || '-') + '\n' +
        'Localidad: ' + (d.get('localidad') || '-') + '\n' +
        'Servicio: ' + (d.get('servicio') || '-') + '\n' +
        'Detalles: ' + (d.get('mensaje') || '-');
      window.open('https://wa.me/34600958851?text=' + encodeURIComponent(txt), '_blank', 'noopener');
      var ok = form.querySelector('.form-ok');
      if (ok) ok.hidden = false;
    });
  }

  /* --- ano en curso en el pie --- */
  var y = document.querySelector('#ano');
  if (y) y.textContent = new Date().getFullYear();
})();

/* Comparador antes / despues -------------------------------------------- */
(function () {
  'use strict';
  document.querySelectorAll('[data-ba]').forEach(function (ba) {
    var range = ba.querySelector('.ba__range');
    if (!range) return;

    function pintar() {
      ba.style.setProperty('--pos', range.value + '%');
    }
    range.addEventListener('input', pintar);
    pintar();

    /* arrastre directo sobre la imagen, mas natural que mover el input */
    var arrastrando = false;
    function desdeEvento(e) {
      var r = ba.getBoundingClientRect();
      var x = (e.touches ? e.touches[0].clientX : e.clientX) - r.left;
      var p = Math.max(0, Math.min(100, (x / r.width) * 100));
      range.value = p;
      pintar();
    }
    ba.addEventListener('pointerdown', function (e) {
      arrastrando = true;
      ba.setPointerCapture(e.pointerId);
      desdeEvento(e);
    });
    ba.addEventListener('pointermove', function (e) {
      if (arrastrando) desdeEvento(e);
    });
    ['pointerup', 'pointercancel'].forEach(function (ev) {
      ba.addEventListener(ev, function () { arrastrando = false; });
    });

    /* insinuacion al entrar en pantalla: se abre un poco y vuelve */
    if ('IntersectionObserver' in window &&
        !window.matchMedia('(prefers-reduced-motion:reduce)').matches) {
      var visto = false;
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (!e.isIntersecting || visto) return;
          visto = true;
          var t0 = null;
          function anim(t) {
            if (!t0) t0 = t;
            var p = Math.min((t - t0) / 1600, 1);
            var e2 = p < .5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
            range.value = 50 + Math.sin(e2 * Math.PI) * 26;
            pintar();
            if (p < 1) requestAnimationFrame(anim);
          }
          requestAnimationFrame(anim);
        });
      }, { threshold: .45 });
      io.observe(ba);
    }
  });
})();

/* Corte interactivo del tabique ----------------------------------------- */
(function () {
  'use strict';
  var anat = document.querySelector('.anat');
  if (!anat) return;

  var botones = anat.querySelectorAll('.anat__btn');
  var textos = anat.querySelectorAll('.anat__txt');
  var piezas = anat.querySelectorAll('.pieza');

  function mostrar(capa) {
    anat.classList.add('activa');
    botones.forEach(function (b) { b.classList.toggle('on', b.dataset.capa === capa); });
    textos.forEach(function (t) { t.classList.toggle('on', t.dataset.capa === capa); });
    piezas.forEach(function (p) { p.classList.toggle('destacada', p.dataset.capa === capa); });
  }

  botones.forEach(function (b) {
    ['mouseenter', 'focus', 'click'].forEach(function (ev) {
      b.addEventListener(ev, function () { mostrar(b.dataset.capa); });
    });
  });
  piezas.forEach(function (p) {
    p.addEventListener('mouseenter', function () { mostrar(p.dataset.capa); });
  });

  mostrar(botones[0].dataset.capa);
})();

/* Ajustes del corte del tabique en pantallas pequenas ------------------- */
(function () {
  'use strict';
  var svg = document.querySelector('.anat__svg');
  if (!svg) return;

  var completo = '0 0 980 520';
  var recorte = '96 46 700 450';   /* enfoca placa, montantes y lana */

  function encuadre() {
    svg.setAttribute('viewBox', window.innerWidth <= 760 ? recorte : completo);
  }
  encuadre();
  window.addEventListener('resize', encuadre);

  /* en tactil no hay hover: que tocar una pieza tambien la seleccione */
  svg.querySelectorAll('.pieza').forEach(function (p) {
    p.style.cursor = 'pointer';
    p.addEventListener('click', function () {
      var btn = document.querySelector('.anat__btn[data-capa="' + p.dataset.capa + '"]');
      if (btn) btn.click();
    });
  });
})();

/* En movil: encoger el boton de WhatsApp mientras se hace scroll ---------- */
(function () {
  'use strict';
  var wa = document.querySelector('.wa');
  if (!wa) return;
  var t;
  window.addEventListener('scroll', function () {
    if (window.innerWidth > 760) return;
    wa.classList.add('wa--min');
    clearTimeout(t);
    t = setTimeout(function () { wa.classList.remove('wa--min'); }, 850);
  }, { passive: true });
})();
