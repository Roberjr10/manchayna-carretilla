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
    { name: 'Carne de ternera', color: '#6B3A21', kind: 'patty' },
    { name: 'Pollo crispy', color: '#C98A2E', kind: 'crispy' },
    { name: 'Pulled pork', color: '#A44F2A', kind: 'shredded' },
    { name: 'Pulled de pollo', color: '#D1A03F', kind: 'shredded' }
  ];
  const TOPPINGS = [
    { name: 'Cebolla caramelizada', color: '#B5712F', kind: 'strands' },
    { name: 'Cebolla frita', color: '#D79A42', kind: 'strands' },
    { name: 'Cebolla morada cruda', color: '#8E4FA8', kind: 'rings' },
    { name: 'Pimiento caramelizado', color: '#C8381F', kind: 'strands' },
    { name: 'Bacón', color: '#C0442C', kind: 'bacon' },
    { name: 'Huevo', color: '#F4D35E', kind: 'egg' },
    { name: 'Boniato en láminas', color: '#E08A3C', kind: 'slices' },
    { name: 'Queso brie', color: '#F0E2B6', kind: 'cheese' },
    { name: 'Queso de cabra', color: '#F5EFE2', kind: 'cheese' },
    { name: 'Cheddar en salsa', color: '#F2A42B', kind: 'melted' },
    { name: 'Cheddar en loncha', color: '#F6B829', kind: 'cheese' },
    { name: 'Queso ahumado', color: '#E8C06A', kind: 'cheese' }
  ];
  const SALSAS = [
    { name: 'Salsa rosa', color: '#E88FA0', kind: 'drizzle' },
    { name: 'BBQ', color: '#7A3B1E', kind: 'drizzle' },
    { name: 'Ají amarillo', color: '#F2B705', kind: 'drizzle' },
    { name: 'Mayonesa de trufa', color: '#EDE3CB', kind: 'drizzle' },
    { name: '????', color: '#BFD3A0', kind: 'drizzle' }, // pendiente: tapada en el póster
    { name: 'Salsa de pimiento', color: '#D4451F', kind: 'drizzle' },
    { name: 'Guacamole', color: '#7FA64B', kind: 'drizzle' }
  ];

  const INCLUIDO = [
    { name: "Lechuga", color: "#79C43E", kind: 'frills', badge: "incluida" },
    { name: "Tomate", color: "#E04A2F", kind: 'slices', badge: "incluido" }
  ];

  /* ---------- Dibujo de cada ingrediente ----------
     Cada forma devuelve [alto del dibujo, contenido SVG] sobre un lienzo de 200 de ancho. */
  const svg = (h, inner) => `<svg viewBox="0 0 200 ${h}" aria-hidden="true">${inner}</svg>`;
  const SHAPES = {
    // filete grueso con su veteado
    patty: c => svg(26, `<rect x="4" y="2" width="192" height="22" rx="11" fill="${c}"/>
      <rect x="5" y="3" width="190" height="20" rx="10" fill="none" stroke="#fff" stroke-opacity=".16" stroke-width="1.5"/>
      <g fill="#fff" fill-opacity=".16"><ellipse cx="54" cy="10" rx="14" ry="2.6"/><ellipse cx="120" cy="16" rx="18" ry="2.4"/><ellipse cx="160" cy="9" rx="10" ry="2.2"/></g>`),
    // rebozado con sus picos crujientes
    crispy: c => svg(24, `<path d="M8 20c-4-3-3-8 2-9 1-5 7-7 11-4 3-5 10-5 13-1 4-5 11-4 13 1 4-4 10-3 12 2 5-3 11 0 11 5 5 1 6 6 2 9z" fill="${c}" transform="translate(0,1) scale(1.02,1)"/>
      <path d="M4 21h192a4 4 0 0 1-4 3H8a4 4 0 0 1-4-3z" fill="${c}"/>
      <g fill="${c}"><ellipse cx="40" cy="12" rx="22" ry="9"/><ellipse cx="86" cy="10" rx="24" ry="9"/><ellipse cx="132" cy="12" rx="22" ry="9"/><ellipse cx="172" cy="13" rx="20" ry="8"/></g>
      <g fill="#fff" fill-opacity=".22"><circle cx="46" cy="9" r="2.4"/><circle cx="92" cy="7" r="2.2"/><circle cx="138" cy="10" r="2.2"/><circle cx="170" cy="9" r="2"/></g>`),
    // carne deshilachada
    shredded: c => svg(22, `<g stroke="${c}" stroke-width="5" stroke-linecap="round" fill="none">
      <path d="M12 8c18-4 36 3 54-1"/><path d="M74 7c20-3 38 4 58 0"/><path d="M138 9c18-3 34 2 50-1"/>
      <path d="M8 16c22 3 40-3 60 1"/><path d="M76 17c20 3 36-3 56 1"/><path d="M140 16c16 3 30-2 48 1"/></g>`),
    // hojas rizadas que asoman
    frills: c => svg(18, `<rect x="10" y="0" width="180" height="10" fill="${c}"/>
      <g fill="${c}"><circle cx="24" cy="9" r="8"/><circle cx="48" cy="8" r="10"/><circle cx="72" cy="10" r="8"/><circle cx="96" cy="8" r="10"/><circle cx="120" cy="9" r="8"/><circle cx="146" cy="8" r="10"/><circle cx="170" cy="9" r="8"/></g>
      <g fill="#000" fill-opacity=".16"><circle cx="48" cy="12" r="4"/><circle cx="96" cy="12" r="4"/><circle cx="146" cy="12" r="4"/></g>`),
    // rodajas
    slices: c => svg(16, `<g fill="${c}"><ellipse cx="46" cy="8" rx="38" ry="7"/><ellipse cx="100" cy="8" rx="38" ry="7"/><ellipse cx="154" cy="8" rx="38" ry="7"/></g>
      <g fill="#fff" fill-opacity=".25"><ellipse cx="46" cy="8" rx="22" ry="3"/><ellipse cx="100" cy="8" rx="22" ry="3"/><ellipse cx="154" cy="8" rx="22" ry="3"/></g>`),
    // aros
    rings: c => svg(18, `<g fill="none" stroke="${c}" stroke-width="4">
      <ellipse cx="48" cy="9" rx="30" ry="7"/><ellipse cx="104" cy="9" rx="26" ry="7"/><ellipse cx="156" cy="9" rx="28" ry="7"/></g>`),
    // tiras finas
    strands: c => svg(16, `<g stroke="${c}" stroke-width="4" stroke-linecap="round" fill="none">
      <path d="M10 6c16 6 30-4 46 2s28-4 44 2 30-4 46 2 28-3 44 1"/>
      <path d="M12 12c18-5 30 4 48-1s30 5 46 0 28 5 44 0 26 3 38 1"/></g>`),
    // lonchas onduladas con su veta
    bacon: c => svg(16, `<path d="M6 4c22-6 34 8 56 2s36 8 56 2 36 7 58 1v7c-22 6-36-7-58-1s-36-8-56-2-34-8-56-2z" fill="${c}"/>
      <path d="M8 7c22-5 34 8 56 2s36 8 56 2 36 7 58 1" fill="none" stroke="#F6C9A8" stroke-opacity=".75" stroke-width="2.4"/>`),
    // huevo con su yema
    egg: () => svg(22, `<path d="M20 14c-8-12 10-14 20-8 6-9 22-8 26 1 10-7 26-2 26 7 10-5 22 1 20 8z" fill="#FFF6E4" transform="translate(18,0)"/>
      <ellipse cx="100" cy="13" rx="78" ry="8" fill="#FFF6E4"/>
      <circle cx="88" cy="11" r="7.5" fill="#F7B61E"/><circle cx="86" cy="9" r="2.6" fill="#FFD96B"/>`),
    // loncha de queso con esquinas caídas
    cheese: c => svg(15, `<path d="M8 2h184v6c0 3-2 5-5 5H13c-3 0-5-2-5-5z" fill="${c}"/>
      <path d="M8 2h184v3H8z" fill="#fff" fill-opacity=".3"/>`),
    // queso fundido que gotea
    melted: c => svg(22, `<path d="M6 2h188v7c0 3-2 5-5 5l-4 6c-1 2-3 2-4 0l-4-6h-18l-5 8c-1 2-3 2-4 0l-5-8H88l-5 7c-1 2-3 2-4 0l-5-7H46l-5 7c-1 2-3 2-4 0l-5-7c-3 0-5-2-5-5z" fill="${c}"/>
      <path d="M6 2h188v3H6z" fill="#fff" fill-opacity=".35"/>`),
    // hilo de salsa
    drizzle: c => svg(12, `<path d="M10 7c14-6 24 4 38-1s24 5 38 0 24 5 38 0 22 4 36 1" fill="none" stroke="${c}" stroke-width="5" stroke-linecap="round"/>`)
  };
  const dibujo = (kind, color) => (SHAPES[kind] || SHAPES.drizzle)(color);

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
    $('[data-stack-layers]').innerHTML = layers.map(([g, n], x) => {
      const d = GROUPS[g].find(i => i.name === n);
      return `<span class="layer l-${g}" style="--x:${x % 2 ? 1 : -1}">
        <span class="ly-art">${dibujo(d.kind, d.color)}</span>
        <span class="ly-tag">${esc(n)}</span>
      </span>`;
    }).join('');
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
    // cada ingrediente, una etiqueta suelta: se lee de un vistazo y ocupa poco
    const chips = (g, arr) => arr.map(n => {
      const c = GROUPS[g].find(i => i.name === n).color;
      return `<span class="chip"><i style="--c:${c}"></i>${esc(n)}</span>`;
    }).join('');
    const line = (label, arr, price, g) => arr.length
      ? `<li><span>${label}</span><i>${price}</i><b>${g ? chips(g, arr) : esc(arr.join(', '))}</b></li>` : '';
    const extras = picked.prote.length - 1;
    $('[data-summary]').innerHTML = `
      <li><span>Base</span><i>${eur(BASE)}</i><b>${esc(textoBase())}</b></li>
      ${line('Proteína', picked.prote.slice(0, 1), 'incluida', 'prote')}
      ${extras > 0 ? line(`Proteína extra (${extras})`, picked.prote.slice(1), `+${eur(extras * EXTRA_PROTE)}`, 'prote') : ''}
      ${line(`Toppings (${picked.topping.length})`, picked.topping, `+${eur(picked.topping.length * TOPPING)}`, 'topping')}
      ${line(`Salsas (${picked.salsa.length})`, picked.salsa, `+${eur(picked.salsa.length * SALSA)}`, 'salsa')}`;

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
