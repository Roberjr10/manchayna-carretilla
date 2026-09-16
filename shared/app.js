/* Comportamiento común de las tres propuestas.
   Todo se activa con atributos data-* en el HTML; si un atributo no está, esa parte no hace nada. */
(() => {
  const M = window.MANCHAYNA;
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const num = p => parseFloat(p.replace(/[^\d,]/g, '').replace(',', '.'));
  const eur = n => n.toFixed(2).replace('.', ',') + ' €';
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const wa = text => M.wa + '?text=' + encodeURIComponent(text);
  const ALL = MENU_DATA.flatMap(c => c.items);
  const byName = n => ALL.find(i => i.name === n);
  const body = document.body;
  const cartMode = body.dataset.mode === 'cart';
  const showOrigin = 'origins' in body.dataset;
  const TAGS = { nuevo: 'Nueva', veggie: 'Veggie', picante: 'Picante' };

  /* ---------- Carta ---------- */
  const item = i => {
    const badges = (i.tags || []).filter(t => TAGS[t]).map(t => `<span class="badge b-${t}">${TAGS[t]}</span>`).join('');
    const origin = showOrigin && i.origin ? `<span class="origin">${i.origin}</span>` : '';
    const action = cartMode
      ? `<button class="add" data-add="${esc(i.name)}" aria-label="Añadir ${esc(i.name)} al pedido">+</button>`
      : `<a class="add" data-wa="${esc(i.name)}" href="#" aria-label="Pedir ${esc(i.name)} por WhatsApp">Pedir</a>`;
    return `<article class="item${i.image ? ' has-img' : ''}" data-name="${esc(i.name)}" data-tags="${(i.tags || []).join(' ')}">
      ${i.image ? `<div class="item-img"><img src="${i.image}" alt="${esc(i.name)}" loading="lazy"></div>` : ''}
      <div class="item-body">
        <div class="item-head">${origin}<h3>${esc(i.name)}</h3>${badges}</div>
        <p>${esc(i.desc)}</p>
        <div class="item-foot"><span class="price">${eur(num(i.price))}</span>${action}</div>
      </div>
    </article>`;
  };

  $$('[data-featured]').forEach(el => {
    el.innerHTML = el.dataset.featured.split('|').map(byName).filter(Boolean).map(item).join('');
  });

  const menu = document.querySelector('[data-menu]');
  if (menu) {
    menu.innerHTML = MENU_DATA.map(c => `
      <section class="cat" id="${c.id}" aria-labelledby="h-${c.id}">
        <h2 id="h-${c.id}">${c.name}</h2>
        ${c.note ? `<p class="cat-note">${c.note}</p>` : ''}
        <div class="items">${c.items.map(item).join('')}</div>
      </section>`).join('');

    const nav = document.querySelector('[data-catnav]');
    if (nav) {
      nav.innerHTML = MENU_DATA.map(c => `<a href="#${c.id}">${c.name}</a>`).join('');
      const links = $$('a', nav);
      const io = new IntersectionObserver(entries => entries.forEach(e => {
        if (!e.isIntersecting) return;
        links.forEach(l => {
          const on = l.hash === '#' + e.target.id;
          l.classList.toggle('on', on);
          on ? l.setAttribute('aria-current', 'true') : l.removeAttribute('aria-current');
          if (on) nav.scrollTo({ left: l.offsetLeft - nav.clientWidth / 2 + l.offsetWidth / 2, behavior: 'smooth' });
        });
      }), { rootMargin: '-40% 0px -55% 0px' });
      $$('.cat', menu).forEach(s => io.observe(s));
    }
  }

  /* ---------- Filtros por antojo ---------- */
  $$('[data-filters]').forEach(bar => bar.addEventListener('click', e => {
    const b = e.target.closest('button');
    if (!b) return;
    $$('button', bar).forEach(x => x.setAttribute('aria-pressed', x === b));
    const f = b.dataset.f;
    $$('.item').forEach(it => { it.hidden = f !== 'all' && !it.dataset.tags.split(' ').includes(f); });
    $$('.cat').forEach(c => { c.hidden = !c.querySelector('.item:not([hidden])'); });
  }));

  /* ---------- Enlaces ---------- */
  $$('[data-wa]').forEach(a => {
    a.href = wa(a.dataset.wa ? `¡Hola Manchayna! Quiero pedir: ${a.dataset.wa}.` : '¡Hola Manchayna! Quiero hacer un pedido.');
    a.target = '_blank';
    a.rel = 'noopener';
  });
  $$('[data-tel]').forEach(a => { a.href = 'tel:' + M.tel; });
  $$('[data-maps]').forEach(a => { a.href = M.maps; a.target = '_blank'; a.rel = 'noopener'; });
  $$('[data-map]').forEach(f => { f.src = M.mapEmbed; });

  /* ---------- Abierto / cerrado ---------- */
  const hh = m => `${Math.floor(m / 60)}:${String(m % 60).padStart(2, '0')}`;
  const d = new Date();
  const mins = d.getHours() * 60 + d.getMinutes();
  const openDay = M.days.includes(d.getDay());
  const now = openDay && M.slots.find(([a, b]) => mins >= a && mins < b);
  const next = openDay && M.slots.find(([a]) => mins < a);
  const status = now ? `<b>Abierto</b><span class="more"> · hasta las ${hh(now[1])}</span>` : `<b>Cerrado</b><span class="more"> · ${next ? `abre a las ${hh(next[0])}` : 'abrimos mié–dom'}</span>`;
  $$('[data-open]').forEach(el => { el.innerHTML = `<i class="dot${now ? ' on' : ''}" aria-hidden="true"></i>${status}`; });
  $$('[data-today]').forEach(el => {
    el.textContent = openDay ? `Hoy: ${M.slots.map(([a, b]) => `${hh(a)}–${hh(b)}`).join(' y ')}` : 'Hoy cerrado · abrimos de miércoles a domingo';
  });

  /* ---------- Menú móvil ---------- */
  const toggle = document.querySelector('[data-nav-toggle]');
  const setNav = open => { body.classList.toggle('nav-open', open); toggle?.setAttribute('aria-expanded', open); };
  toggle?.addEventListener('click', () => setNav(!body.classList.contains('nav-open')));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setNav(false); });
  $$('.site-nav a').forEach(a => a.addEventListener('click', () => setNav(false)));

  /* ---------- Pedido (solo data-mode="cart") ---------- */
  const cart = new Map();
  try { JSON.parse(sessionStorage.getItem('manchayna-cart') || '[]').forEach(([k, v]) => byName(k) && cart.set(k, v)); } catch {}
  const lines = () => [...cart].map(([n, q]) => [byName(n), q]);
  const total = () => lines().reduce((a, [i, q]) => a + num(i.price) * q, 0);

  function renderCart(bump) {
    try { sessionStorage.setItem('manchayna-cart', JSON.stringify([...cart])); } catch {}
    const count = lines().reduce((a, [, q]) => a + q, 0);
    $$('[data-cart-count]').forEach(n => {
      n.textContent = count;
      if (bump) { n.classList.remove('bump'); void n.offsetWidth; n.classList.add('bump'); }
    });
    $$('[data-cart-total]').forEach(n => { n.textContent = eur(total()); });
    $$('[data-cart-summary]').forEach(n => { n.textContent = count ? lines().map(([i, q]) => `${q}× ${i.name}`).join(', ') : 'Añade platos con el botón +'; });
    $$('[data-cart-bar]').forEach(n => n.classList.toggle('is-empty', !count));
    $$('[data-cart-list]').forEach(list => {
      list.innerHTML = count ? lines().map(([i, q]) => `
        <li><span class="l-name">${esc(i.name)}</span>
          <span class="qty"><button type="button" data-dec="${esc(i.name)}" aria-label="Quitar un ${esc(i.name)}">−</button><b>${q}</b><button type="button" data-add="${esc(i.name)}" aria-label="Añadir un ${esc(i.name)}">+</button></span>
          <span class="l-price">${eur(num(i.price) * q)}</span></li>`).join('')
        : '<li class="empty">Tu pedido está vacío. Añade algo de la carta.</li>';
    });
    $$('[data-order] [type=submit]').forEach(b => { b.disabled = !count; });
  }

  document.addEventListener('click', e => {
    const add = e.target.closest('[data-add]');
    const dec = e.target.closest('[data-dec]');
    if (add) { cart.set(add.dataset.add, (cart.get(add.dataset.add) || 0) + 1); renderCart(true); }
    if (dec) {
      const q = cart.get(dec.dataset.dec) - 1;
      q > 0 ? cart.set(dec.dataset.dec, q) : cart.delete(dec.dataset.dec);
      renderCart();
    }
    if (e.target.closest('[data-cart-open]')) document.getElementById('cart')?.showModal();
    if (e.target.closest('[data-close]')) e.target.closest('dialog').close();
    if (e.target.tagName === 'DIALOG') e.target.close(); // clic en el fondo
  });

  // Mostrar la dirección solo si es a domicilio
  $$('[data-order]').forEach(form => form.addEventListener('change', () => {
    const home = form.elements.entrega.value === 'A domicilio';
    form.querySelector('[data-address]').hidden = !home;
    form.elements.direccion.required = home;
  }));

  document.addEventListener('submit', e => {
    const form = e.target;
    if (form.matches('[data-order]')) {
      e.preventDefault();
      const f = form.elements;
      const msg = [
        '¡Hola Manchayna! Quiero hacer este pedido:',
        ...lines().map(([i, q]) => `• ${q} × ${i.name} (${eur(num(i.price) * q)})`),
        '', `Total: ${eur(total())}`,
        `Entrega: ${f.entrega.value}`,
        f.entrega.value === 'A domicilio' ? `Dirección: ${f.direccion.value}` : '',
        `Nombre: ${f.nombre.value}`,
        f.notas.value ? `Notas: ${f.notas.value}` : ''
      ].filter(Boolean).join('\n');
      window.open(wa(msg), '_blank', 'noopener');
    }
    if (form.matches('[data-wa-form]')) {
      e.preventDefault();
      const fields = [...form.elements].filter(el => el.name && el.value && (el.type !== 'radio' || el.checked));
      const msg = [form.dataset.waForm, ...fields.map(el => `${el.labels[0].textContent.trim()}: ${el.value}`)].join('\n');
      window.open(wa(msg), '_blank', 'noopener');
    }
  });

  /* ---------- Zoom de fotos ---------- */
  const zoom = document.createElement('dialog');
  zoom.className = 'zoom';
  zoom.setAttribute('aria-label', 'Foto ampliada');
  zoom.innerHTML = '<button class="zoom-close" data-close aria-label="Cerrar">×</button><div class="zoom-inner"><div class="zoom-ph"><img alt=""></div><div class="zoom-info"></div></div>';
  body.append(zoom);
  const zImg = zoom.querySelector('img');
  const zInfo = zoom.querySelector('.zoom-info');
  const zInner = zoom.querySelector('.zoom-inner');

  // Icono por ingrediente (el primero que coincide gana)
  const ICONS = [
    [/pimiento|ají|brava|pico de gallo|picante/, '🌶️'], [/trufa|setas/, '🍄'], [/aceituna/, '🫒'],
    [/vacuno|carne|costilla/, '🥩'], [/pollo|alitas/, '🍗'], [/pork|panceta|bacon|jamón/, '🥓'],
    [/queso|mozzarella|cheddar|brie/, '🧀'], [/huevo/, '🍳'], [/tomate/, '🍅'], [/lechuga|rúcula/, '🥬'],
    [/cebolla/, '🧅'], [/guacamole/, '🥑'], [/patata/, '🍟'], [/boniato/, '🍠'], [/maíz/, '🌽'],
    [/yuca/, '🥔'], [/taco/, '🌮'], [/bizcocho/, '🍰'], [/leche|nata/, '🥛'], [/canela/, '🌿'],
    [/fruta|frutos/, '🍓'], [/salsa|mayonesa|bbq|sirope/, '🥫']
  ];
  const icon = t => (ICONS.find(([re]) => re.test(t.toLowerCase())) || [, '•'])[1];

  const zoomables = () => $$('.item-img img, [data-zoom]');
  zoomables().forEach(img => {
    img.tabIndex = 0;
    img.setAttribute('role', 'button');
    img.setAttribute('aria-label', `Ampliar foto: ${img.alt}`);
  });
  const openZoom = img => {
    const it = img.closest('.item');
    const d = it && byName(it.dataset.name);
    zImg.src = img.currentSrc || img.src;
    zImg.alt = img.alt;
    zInner.classList.toggle('solo', !d);
    zInfo.innerHTML = d ? `
      ${d.spec ? `<span class="z-spec">${esc(d.spec)}</span>` : ''}
      <h2 class="z-name">${esc(d.name)}</h2>
      <div class="z-badges">${it.querySelector('.item-head').innerHTML.replace(/<h3[\s\S]*?<\/h3>/, '')}</div>
      ${d.ing ? `
        <h3 class="z-title">Ingredientes</h3>
        <ul class="z-ing">${d.ing.map((x, n) => `<li style="--n:${n}"><span aria-hidden="true">${icon(x)}</span>${esc(x)}</li>`).join('')}</ul>`
      : `<p class="z-desc">${esc(d.desc)}</p>`}
      <div class="z-foot"><span class="z-price">${eur(num(d.price))}</span></div>`
      : `<h2 class="z-name">${esc(img.alt)}</h2>`;
    const action = it?.querySelector('.add');
    if (action) zInfo.querySelector('.z-foot').append(action.cloneNode(true)); // pedir sin cerrar la foto
    zoom.showModal();
    zoom.scrollTop = 0;
    zoom.querySelector('.zoom-close').focus();
  };
  document.addEventListener('click', e => {
    const img = e.target.closest('.item-img img, [data-zoom]');
    if (img) openZoom(img);
  });
  document.addEventListener('keydown', e => {
    if ((e.key === 'Enter' || e.key === ' ') && e.target.matches?.('.item-img img, [data-zoom]')) {
      e.preventDefault();
      openZoom(e.target);
    }
  });
  zoom.addEventListener('click', e => { if (e.target === zoom || e.target === zInner || e.target.classList.contains('zoom-ph')) zoom.close(); });

  // Fecha mínima de reserva = hoy
  $$('input[type=date]').forEach(i => { i.min = new Date().toISOString().slice(0, 10); });

  renderCart();
})();
