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

/* ========================================================================
   Presentacion del emblema: se ensambla al cargar
   ======================================================================== */
(function () {
  'use strict';
  var intro = document.getElementById('intro');
  if (!intro) return;

  /* solo la primera vez por sesion: molesta ver la intro en cada pagina */
  var visto = false;
  try { visto = sessionStorage.getItem('rd-intro') === '1'; } catch (e) {}
  var reduce = window.matchMedia('(prefers-reduced-motion:reduce)').matches;

  function salir() {
    intro.classList.add('fuera');
    try { sessionStorage.setItem('rd-intro', '1'); } catch (e) {}
    setTimeout(function () { if (intro.parentNode) intro.parentNode.removeChild(intro); }, 600);
  }

  if (visto || reduce) { salir(); return; }
  document.documentElement.style.overflow = 'hidden';
  setTimeout(function () {
    document.documentElement.style.overflow = '';
    salir();
  }, 3450);
  /* por si algo falla, nunca dejar la pantalla bloqueada */
  setTimeout(function () {
    document.documentElement.style.overflow = '';
    if (intro.parentNode) salir();
  }, 5200);
})();

/* ========================================================================
   Lightbox de la galeria
   ======================================================================== */
(function () {
  'use strict';
  var figs = [].slice.call(document.querySelectorAll('.gal'));
  if (!figs.length) return;

  var caja = document.createElement('div');
  caja.className = 'lb';
  caja.setAttribute('role', 'dialog');
  caja.setAttribute('aria-modal', 'true');
  caja.setAttribute('aria-label', 'Imagen ampliada');
  caja.innerHTML =
    '<button class="lb__x" type="button" aria-label="Cerrar">&times;</button>' +
    '<button class="lb__nav lb__nav--ant" type="button" aria-label="Anterior">&#8249;</button>' +
    '<button class="lb__nav lb__nav--sig" type="button" aria-label="Siguiente">&#8250;</button>' +
    '<img class="lb__img" alt="">' +
    '<p class="lb__pie"></p>';
  document.body.appendChild(caja);

  var img = caja.querySelector('.lb__img');
  var pie = caja.querySelector('.lb__pie');
  var i = 0, ultimoFoco = null;

  function visibles() {
    return figs.filter(function (f) { return !f.hidden; });
  }

  function pinta() {
    var lista = visibles();
    if (!lista.length) return;
    if (i < 0) i = lista.length - 1;
    if (i >= lista.length) i = 0;
    var f = lista[i];
    var im = f.querySelector('img');
    var cap = f.querySelector('figcaption');
    img.src = im.getAttribute('src');
    img.alt = im.getAttribute('alt') || '';
    pie.innerHTML = cap ? cap.innerHTML : '';
  }

  function abre(fig) {
    var lista = visibles();
    i = lista.indexOf(fig);
    if (i < 0) i = 0;
    ultimoFoco = document.activeElement;
    pinta();
    caja.classList.add('abierto');
    document.body.style.overflow = 'hidden';
    caja.querySelector('.lb__x').focus();
  }

  function cierra() {
    caja.classList.remove('abierto');
    document.body.style.overflow = '';
    if (ultimoFoco && ultimoFoco.focus) ultimoFoco.focus();
  }

  figs.forEach(function (f) {
    f.setAttribute('tabindex', '0');
    f.setAttribute('role', 'button');
    f.addEventListener('click', function () { abre(f); });
    f.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); abre(f); }
    });
  });

  caja.querySelector('.lb__x').addEventListener('click', cierra);
  caja.querySelector('.lb__nav--ant').addEventListener('click', function () { i--; pinta(); });
  caja.querySelector('.lb__nav--sig').addEventListener('click', function () { i++; pinta(); });
  caja.addEventListener('click', function (e) { if (e.target === caja) cierra(); });
  document.addEventListener('keydown', function (e) {
    if (!caja.classList.contains('abierto')) return;
    if (e.key === 'Escape') cierra();
    if (e.key === 'ArrowLeft') { i--; pinta(); }
    if (e.key === 'ArrowRight') { i++; pinta(); }
  });

  /* deslizar con el dedo */
  var x0 = null;
  caja.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
  caja.addEventListener('touchend', function (e) {
    if (x0 === null) return;
    var d = e.changedTouches[0].clientX - x0;
    if (Math.abs(d) > 45) { i += d < 0 ? 1 : -1; pinta(); }
    x0 = null;
  });
})();

/* ========================================================================
   Comparador drywall / ladrillo
   ======================================================================== */
(function () {
  'use strict';
  var filas = [].slice.call(document.querySelectorAll('.cmp__fila'));
  if (!filas.length) return;

  /* el concepto tambien se ve en escritorio, dentro de la primera columna */
  filas.forEach(function (f) {
    var cab = f.querySelector('.cmp__cab');
    var barras = f.querySelector('.cmp__barras');
    var concepto = f.querySelector('.cmp__concepto');
    if (concepto && barras && window.innerWidth > 760) {
      var copia = document.createElement('span');
      copia.className = 'cmp__concepto-esc';
      copia.textContent = concepto.textContent;
      barras.insertBefore(copia, barras.firstChild);
    }
    if (cab) {
      cab.addEventListener('click', function () {
        var abierta = f.classList.toggle('abierta');
        cab.setAttribute('aria-expanded', abierta ? 'true' : 'false');
      });
    }
  });

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: .4 });
    filas.forEach(function (f) { io.observe(f); });
  } else {
    filas.forEach(function (f) { f.classList.add('in'); });
  }
})();

/* ========================================================================
   Diagnostico de ruido en 3 preguntas
   ======================================================================== */
(function () {
  'use strict';
  var dg = document.getElementById('diagnostico');
  if (!dg) return;

  var elegido = { origen: null, tipo: null, recinto: null };

  var SOL = {
    medianera: {
      titulo: 'Trasdosado acústico autoportante',
      desc: 'Montamos una segunda pared por delante de la medianera, sin tocarla y sin contacto con ella: banda elástica en todo el perímetro, lana mineral en la cámara y cierre con doble placa. El ruido deja de tener por dónde pasar.',
      mejora: 'Alta',
      espacio: '7 – 10 cm',
      plazo: '3 – 5 días',
      incluye: [
        'Montantes autoportantes, separados del muro existente',
        'Banda elástica en suelo, techo y laterales',
        'Lana mineral de alta densidad en la cámara',
        'Doble placa y sellado acústico de cajas y pasos'
      ]
    },
    arriba: {
      titulo: 'Techo acústico desacoplado',
      desc: 'Colgamos un techo independiente del forjado con amortiguadores elásticos y cámara rellena de lana. El objetivo es cortar el puente por el que baja el ruido, no taparlo.',
      mejora: 'Media – alta',
      espacio: '10 – 15 cm de altura',
      plazo: '4 – 7 días',
      incluye: [
        'Amortiguadores acústicos en lugar de cuelgue rígido',
        'Cámara rellena de lana mineral',
        'Doble placa con juntas desfasadas',
        'Sellado perimetral y de luminarias'
      ]
    },
    calle: {
      titulo: 'Trasdosado de fachada con aislamiento',
      desc: 'Forramos la fachada por dentro con lana mineral y doble placa. Mejora el ruido y, de paso, la temperatura de la habitación.',
      mejora: 'Media',
      espacio: '6 – 9 cm',
      plazo: '3 – 5 días',
      incluye: [
        'Trasdosado con cámara rellena',
        'Tratamiento de la caja de persiana, que suele ser la fuga principal',
        'Sellado de encuentros con ventana',
        'Mejora térmica añadida'
      ]
    },
    dentro: {
      titulo: 'Sala desacoplada, caja dentro de caja',
      desc: 'Construimos un recinto independiente dentro del existente: paredes, techo y encuentros desolidarizados, para que la energía sonora no llegue a la estructura del edificio.',
      mejora: 'Alta',
      espacio: '10 – 18 cm por lado',
      plazo: '1 – 3 semanas',
      incluye: [
        'Trasdosados y techo totalmente desacoplados',
        'Doble o triple placa según objetivo',
        'Sellado integral de pasos de instalación',
        'Tratamiento de puerta acústica'
      ]
    }
  };

  var MATIZ_TIPO = {
    graves: 'Los graves son lo más difícil: atraviesan la estructura. Para que la solución funcione hay que aumentar masa y separación, y desacoplar sin ningún punto rígido. Es el caso en el que menos conviene escatimar en centímetros.',
    impacto: 'El ruido de impacto (pisadas, sillas, golpes) viaja por la estructura, no por el aire. Desde abajo se reduce, pero la solución que de verdad lo elimina es actuar en el suelo de arriba. Te lo decimos antes de empezar, no después.',
    maquina: 'Si el origen es una máquina, lo primero es comprobar si vibra contra la estructura. A veces se resuelve con antivibratorios y sin obra: si es el caso, te lo diremos aunque nos quedemos sin trabajo.',
    voces: ''
  };

  var MATIZ_RECINTO = {
    local: 'Al tratarse de un local con actividad, el ayuntamiento puede exigir ensayo acústico y limitador. Nosotros ejecutamos la solución y nos coordinamos con el técnico que firme el estudio.',
    vivienda: '',
    oficina: 'En oficinas, la clave suele ser subir las divisiones hasta el forjado y no solo hasta el falso techo: por encima del techo registrable el sonido pasa de una sala a otra sin obstáculo.'
  };

  var ficha = dg.querySelector('.dg__ficha');
  var vacio = dg.querySelector('.dg__vacio');

  function texto(id) { return dg.querySelector(id); }

  function pinta() {
    if (!elegido.origen || !elegido.tipo || !elegido.recinto) return;
    var s = SOL[elegido.origen];

    texto('.dg__tit').textContent = s.titulo;
    texto('.dg__desc').textContent = s.desc;
    texto('.dg__mejora').textContent = s.mejora;
    texto('.dg__espacio').textContent = s.espacio;
    texto('.dg__plazo').textContent = s.plazo;

    var ul = texto('.dg__incluye');
    ul.innerHTML = '';
    s.incluye.forEach(function (t) {
      var li = document.createElement('li');
      li.textContent = t;
      ul.appendChild(li);
    });

    var aviso = [MATIZ_TIPO[elegido.tipo], MATIZ_RECINTO[elegido.recinto]]
      .filter(Boolean).join(' ');
    texto('.dg__aviso').textContent = aviso;

    var etiquetas = {
      medianera: 'del piso o local de al lado', arriba: 'de arriba',
      calle: 'de la calle', dentro: 'lo generamos nosotros',
      voces: 'voces y televisión', graves: 'música con graves',
      impacto: 'golpes y pisadas', maquina: 'maquinaria',
      vivienda: 'una vivienda', local: 'un local o negocio', oficina: 'una oficina o consulta'
    };
    var msg = 'Hola, he usado el diagnóstico de ruido de vuestra web.\n\n' +
      'El ruido viene: ' + etiquetas[elegido.origen] + '\n' +
      'Tipo de ruido: ' + etiquetas[elegido.tipo] + '\n' +
      'Se trata de: ' + etiquetas[elegido.recinto] + '\n' +
      'Solución que me ha salido: ' + s.titulo + '\n\n' +
      '¿Podéis pasarme presupuesto?';
    texto('.dg__wa').href = 'https://wa.me/34600958851?text=' + encodeURIComponent(msg);

    vacio.hidden = true;
    ficha.hidden = false;
  }

  dg.querySelectorAll('.dg__op').forEach(function (b) {
    b.addEventListener('click', function () {
      var campo = b.dataset.campo;
      dg.querySelectorAll('.dg__op[data-campo="' + campo + '"]').forEach(function (o) {
        o.classList.remove('on');
        o.setAttribute('aria-pressed', 'false');
      });
      b.classList.add('on');
      b.setAttribute('aria-pressed', 'true');
      elegido[campo] = b.dataset.valor;
      pinta();
    });
  });
})();
