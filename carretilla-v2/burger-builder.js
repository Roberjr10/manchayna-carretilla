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

  const INCLUIDO = [
    { name: "Lechuga", color: "#79C43E", badge: "incluida" },
    { name: "Tomate", color: "#E04A2F", badge: "incluido" }
  ];

  const eur = n => n.toFixed(2).replace('.', ',') + ' €';
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];

  const picked = { incluido: ['Lechuga', 'Tomate'], prote: [], topping: [], salsa: [] };  // lechuga y tomate vienen puestos
  const GROUPS = { incluido: INCLUIDO, prote: PROTES, topping: TOPPINGS, salsa: SALSAS };

  /* ---------- Pintar las opciones ---------- */
  const extraLabel = g => g === 'topping' ? `+${eur(TOPPING)}` : g === 'salsa' ? `+${eur(SALSA)}` : '';
  $$('[data-group]').forEach(box => {
    const g = box.dataset.group;
    box.innerHTML = GROUPS[g].map(i => `
      <button type="button" class="opt" data-pick="${g}" data-name="${esc(i.name)}" aria-pressed="${picked[g].includes(i.name)}">
        <span class="opt-dot" style="--c:${i.color}" aria-hidden="true"></span>
        <span class="opt-name">${esc(i.name)}</span>
        <span class="opt-price">${g === 'incluido' ? i.badge : g === 'prote' ? 'incluida' : extraLabel(g)}</span>
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
      ...picked.incluido.map(n => ['incluido', n]),
      ...picked.prote.map(n => ['prote', n]),
      ...picked.topping.map(n => ['topping', n]),
      ...picked.salsa.map(n => ['salsa', n])
    ];
    $('[data-stack-layers]').innerHTML = layers.map(([g, n], x) => `
      <span class="layer l-${g}" style="--c:${colorOf(g, n)};--x:${x % 2 ? 1 : -1}" title="${esc(n)}"></span>`).join('');
    $('[data-stack]').classList.toggle('is-empty', !layers.length);
  }

  // "Pan brioche con lechuga y tomate" · "Pan brioche con tomate (sin lechuga)"
  const textoBase = () => {
    const dentro = picked.incluido.map(n => n.toLowerCase());
    const fuera = INCLUIDO.filter(i => !picked.incluido.includes(i.name)).map(i => i.name.toLowerCase());
    return 'Pan brioche'
      + (dentro.length ? ' con ' + dentro.join(' y ') : '')
      + (fuera.length ? ' (sin ' + fuera.join(' ni ') + ')' : '');
  };

  /* ---------- Resumen y botón ---------- */
  function renderSummary() {
    const line = (label, arr, price) => arr.length
      ? `<li><span>${label}</span><b>${esc(arr.join(', '))}</b><i>${price}</i></li>` : '';
    const extras = picked.prote.length - 1;
    $('[data-summary]').innerHTML = `
      <li><span>Base</span><b>${esc(textoBase())}</b><i>${eur(BASE)}</i></li>
      ${line('Proteína', picked.prote.slice(0, 1), 'incluida')}
      ${extras > 0 ? line(`Proteína extra (${extras})`, picked.prote.slice(1), `+${eur(extras * EXTRA_PROTE)}`) : ''}
      ${line(`Toppings (${picked.topping.length})`, picked.topping, `+${eur(picked.topping.length * TOPPING)}`)}
      ${line(`Salsas (${picked.salsa.length})`, picked.salsa, `+${eur(picked.salsa.length * SALSA)}`)}`;

    const t = eur(total());
    $$('[data-total]').forEach(el => {
      if (el.textContent !== t) { el.textContent = t; el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump'); }
    });
    // cuenta en el título de cada paso, para saber qué llevas con el paso plegado
    $$('[data-count]').forEach(el => {
      const n = picked[el.dataset.count].length;
      const [sing, plur] = el.dataset.label.split('|');
      el.textContent = n ? `${n} ${n === 1 ? sing : plur}` : '';
    });

    const ready = picked.prote.length > 0;
    $('[data-send]').setAttribute('aria-disabled', !ready);
    $('[data-hint]').hidden = ready;
  }

  // La burger montada entra en el carrito como un plato más
  function addToCart() {
    const desc = [
      textoBase(),
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

  // deja el configurador como al entrar: con lechuga y tomate puestos
  function limpiar() {
    Object.keys(picked).forEach(k => { picked[k] = []; });
    picked.incluido = INCLUIDO.map(i => i.name);
    $$('[data-pick]').forEach(x => {
      const g = x.dataset.pick;
      const on = picked[g].includes(x.dataset.name);
      x.setAttribute('aria-pressed', on);
      if (g === 'prote') x.querySelector('.opt-price').textContent = 'incluida';
      if (g === 'incluido') x.querySelector('.opt-price').textContent = INCLUIDO.find(i => i.name === x.dataset.name).badge;
    });
    render();
  }

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
        // lechuga y tomate: puestos o quitados, nunca suman
        if (g === 'incluido') {
          const dato = INCLUIDO.find(i => i.name === x.dataset.name);
          x.querySelector('.opt-price').textContent = on ? dato.badge : `sin ${dato.name.toLowerCase()}`;
        }
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
    if (e.target.closest('[data-reset]')) limpiar();
    const send = e.target.closest('[data-send]');
    if (send) {
      // sin proteína no hay burger
      if (send.getAttribute('aria-disabled') === 'true') return $('#paso-base').scrollIntoView({ behavior: 'smooth', block: 'start' });
      addToCart();
      limpiar();   // listo para montar otra
    }
  });

  render();
})();
