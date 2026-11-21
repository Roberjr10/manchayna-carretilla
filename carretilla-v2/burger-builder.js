/* ==========================================================================
   Monta tu Manchayna — configurador.
   Datos y precios tomados del póster "Crea tu propia Manchayna",
   con la base actualizada a 8,00 € (confirmado por el negocio).
   Independiente de shared/app.js: no toca la carta ni los pedidos actuales.
   ========================================================================== */
(() => {
  const BASE = 8, EXTRA_PROTE = 3, TOPPING = 1, SALSA = 0.5;

  // color = capa dibujada en el montaje (mientras no haya fotos recortadas)
  const PROTES = [
    { name: 'Carne de ternera', color: '#6B3A21' },
    { name: 'Pollo crispy', color: '#C98A2E' },
    { name: 'Pulled pork', color: '#A44F2A' },
    { name: 'Pulled de pollo', color: '#D1A03F' }
  ];
  const TOPPINGS = [
    { name: 'Cebolla caramelizada', color: '#B5712F' },
    { name: 'Cebolla frita', color: '#D79A42' },
    { name: 'Cebolla morada cruda', color: '#8E4FA8' },
    { name: 'Pimiento caramelizado', color: '#C8381F' },
    { name: 'Bacón', color: '#C0442C' },
    { name: 'Huevo', color: '#F4D35E' },
    { name: 'Boniato en láminas', color: '#E08A3C' },
    { name: 'Queso brie', color: '#F0E2B6' },
    { name: 'Queso de cabra', color: '#F5EFE2' },
    { name: 'Cheddar en salsa', color: '#F2A42B' },
    { name: 'Cheddar en loncha', color: '#F6B829' },
    { name: 'Queso ahumado', color: '#E8C06A' }
  ];
  const SALSAS = [
    { name: 'Salsa rosa', color: '#E88FA0' },
    { name: 'BBQ', color: '#7A3B1E' },
    { name: 'Ají amarillo', color: '#F2B705' },
    { name: 'Mayonesa de trufa', color: '#EDE3CB' },
    { name: '????', color: '#BFD3A0' }, // pendiente: tapada en el póster
    { name: 'Salsa de pimiento', color: '#D4451F' },
    { name: 'Guacamole', color: '#7FA64B' }
  ];

  const eur = n => n.toFixed(2).replace('.', ',') + ' €';
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];

  const picked = { prote: [], topping: [], salsa: [] };
  const GROUPS = { prote: PROTES, topping: TOPPINGS, salsa: SALSAS };

  /* ---------- Pintar las opciones ---------- */
  const extraLabel = g => g === 'topping' ? `+${eur(TOPPING)}` : g === 'salsa' ? `+${eur(SALSA)}` : '';
  $$('[data-group]').forEach(box => {
    const g = box.dataset.group;
    box.innerHTML = GROUPS[g].map(i => `
      <button type="button" class="opt" data-pick="${g}" data-name="${esc(i.name)}" aria-pressed="false">
        <span class="opt-dot" style="--c:${i.color}" aria-hidden="true"></span>
        <span class="opt-name">${esc(i.name)}</span>
        <span class="opt-price">${g === 'prote' ? 'incluida' : extraLabel(g)}</span>
      </button>`).join('');
  });

  /* ---------- Precio ---------- */
  const total = () => BASE
    + Math.max(0, picked.prote.length - 1) * EXTRA_PROTE
    + picked.topping.length * TOPPING
    + picked.salsa.length * SALSA;

  const colorOf = (g, name) => GROUPS[g].find(i => i.name === name).color;

  /* ---------- Montaje visual ---------- */
  function renderStack() {
    const layers = [
      ...picked.prote.map(n => ['prote', n]),
      ...picked.topping.map(n => ['topping', n]),
      ...picked.salsa.map(n => ['salsa', n])
    ];
    $('[data-stack-layers]').innerHTML = layers.map(([g, n], x) => `
      <span class="layer l-${g}" style="--c:${colorOf(g, n)};--x:${x % 2 ? 1 : -1}" title="${esc(n)}"></span>`).join('');
    $('[data-stack]').classList.toggle('is-empty', !layers.length);
  }

  /* ---------- Resumen y botón ---------- */
  function renderSummary() {
    const line = (label, arr, price) => arr.length
      ? `<li><span>${label}</span><b>${esc(arr.join(', '))}</b><i>${price}</i></li>` : '';
    const extras = picked.prote.length - 1;
    $('[data-summary]').innerHTML = `
      <li><span>Base</span><b>Pan brioche, lechuga y tomate</b><i>${eur(BASE)}</i></li>
      ${line('Proteína', picked.prote.slice(0, 1), 'incluida')}
      ${extras > 0 ? line(`Proteína extra (${extras})`, picked.prote.slice(1), `+${eur(extras * EXTRA_PROTE)}`) : ''}
      ${line(`Toppings (${picked.topping.length})`, picked.topping, `+${eur(picked.topping.length * TOPPING)}`)}
      ${line(`Salsas (${picked.salsa.length})`, picked.salsa, `+${eur(picked.salsa.length * SALSA)}`)}`;

    const t = eur(total());
    $$('[data-total]').forEach(el => {
      if (el.textContent !== t) { el.textContent = t; el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump'); }
    });
    const ready = picked.prote.length > 0;
    $('[data-send]').setAttribute('aria-disabled', !ready);
    $('[data-hint]').hidden = ready;
  }

  // La burger montada entra en el carrito como un plato más
  function addToCart() {
    const desc = [
      'Pan brioche, lechuga y tomate',
      'Proteína: ' + picked.prote.join(', '),
      picked.topping.length ? 'Toppings: ' + picked.topping.join(', ') : '',
      picked.salsa.length ? 'Salsas: ' + picked.salsa.join(', ') : ''
    ].filter(Boolean).join('. ') + '.';
    const name = window.addCustomBurger({ desc, price: eur(total()) });
    // el carrito de app.js escucha los clics en [data-add]
    const ghost = document.createElement('button');
    ghost.dataset.add = name;
    ghost.hidden = true;
    document.body.append(ghost);
    ghost.click();
    ghost.remove();
    document.getElementById('cart')?.showModal();
  }

  const render = () => { renderStack(); renderSummary(); };

  /* ---------- Interacción ---------- */
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-pick]');
    if (b) {
      const g = b.dataset.pick, n = b.dataset.name, arr = picked[g];
      const i = arr.indexOf(n);
      i < 0 ? arr.push(n) : arr.splice(i, 1);
      $$(`[data-pick="${g}"]`).forEach(x => {
        const on = arr.includes(x.dataset.name);
        x.setAttribute('aria-pressed', on);
        // la primera proteína va incluida; las demás suman
        if (g === 'prote') x.querySelector('.opt-price').textContent =
          on && arr.indexOf(x.dataset.name) === 0 ? 'incluida' : `+${eur(EXTRA_PROTE)}`;
      });
      render();
    }
    if (e.target.closest('[data-random]')) {
      const pick = (list, n) => [...list].sort(() => Math.random() - .5).slice(0, n).map(i => i.name);
      picked.prote = pick(PROTES, 1);
      picked.topping = pick(TOPPINGS, 2 + Math.floor(Math.random() * 3));
      picked.salsa = pick(SALSAS.filter(s => s.name !== '????'), 1 + Math.floor(Math.random() * 2));
      $$('[data-pick]').forEach(x => {
        const on = picked[x.dataset.pick].includes(x.dataset.name);
        x.setAttribute('aria-pressed', on);
        if (x.dataset.pick === 'prote') x.querySelector('.opt-price').textContent = on ? 'incluida' : `+${eur(EXTRA_PROTE)}`;
      });
      render();
      $('[data-stack]').scrollIntoView({ block: 'center' });
    }
    if (e.target.closest('[data-reset]')) {
      Object.keys(picked).forEach(k => { picked[k] = []; });
      $$('[data-pick]').forEach(x => {
        x.setAttribute('aria-pressed', 'false');
        if (x.dataset.pick === 'prote') x.querySelector('.opt-price').textContent = 'incluida';
      });
      render();
    }
    const send = e.target.closest('[data-send]');
    if (send) {
      // sin proteína no hay burger
      if (send.getAttribute('aria-disabled') === 'true') return $('#paso-base').scrollIntoView({ behavior: 'smooth', block: 'start' });
      addToCart();
      Object.keys(picked).forEach(k => { picked[k] = []; });  // listo para montar otra
      $$('[data-pick]').forEach(x => {
        x.setAttribute('aria-pressed', 'false');
        if (x.dataset.pick === 'prote') x.querySelector('.opt-price').textContent = 'incluida';
      });
      render();
    }
  });

  render();
})();
