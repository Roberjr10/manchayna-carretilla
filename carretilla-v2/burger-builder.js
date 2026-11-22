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
  // aclarar / oscurecer un color para dar volumen
  const mix = (hex, amt) => '#' + [1, 3, 5].map(i => {
    const v = parseInt(hex.substr(i, 2), 16);
    return Math.round(amt > 0 ? v + (255 - v) * amt : v * (1 + amt)).toString(16).padStart(2, '0');
  }).join('');

  let gid = 0;
  const svg = (h, inner) => `<svg viewBox="0 0 200 ${h}" aria-hidden="true">${inner}</svg>`;
  // degradado propio de cada capa: claro arriba, oscuro abajo
  const vol = c => {
    const id = 'g' + (++gid);
    return [id, `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${mix(c, .26)}"/><stop offset=".55" stop-color="${c}"/><stop offset="1" stop-color="${mix(c, -.3)}"/></linearGradient>`];
  };
  const SHAPES = {
    // filete grueso con su veteado y el borde marcado de la plancha
    patty: c => { const [id, def] = vol(c); return svg(26, `<defs>${def}</defs>
      <rect x="4" y="2" width="192" height="22" rx="11" fill="url(#${id})"/>
      <path d="M16 6h168" stroke="${mix(c, .3)}" stroke-opacity=".5" stroke-width="2.5" stroke-linecap="round"/>
      <g fill="${mix(c, .28)}" fill-opacity=".55"><ellipse cx="54" cy="11" rx="14" ry="2.6"/><ellipse cx="120" cy="16" rx="18" ry="2.4"/><ellipse cx="160" cy="10" rx="10" ry="2.2"/></g>
      <g fill="${mix(c, -.45)}" fill-opacity=".5"><ellipse cx="88" cy="20" rx="20" ry="2"/><ellipse cx="150" cy="19" rx="12" ry="1.8"/></g>`); },
    // filete de pollo rebozado: silueta irregular, escamas de costra y migas sueltas
    crispy: c => {
      const [id, def] = vol(c), claro = mix(c, .34), oscuro = mix(c, -.3), tostado = mix(c, -.52);
      const oval = (x, y, rx, ry, rot, fill, op) =>
        `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" transform="rotate(${rot} ${x} ${y})" fill="${fill}" fill-opacity="${op}"/>`;
      const migas = [[22,7,2.6],[46,8,2],[63,5,2.4],[88,6,2.2],[118,6,2.6],[144,7,2],[168,6,2.4],[184,9,2]]
        .map(v => `<circle cx="${v[0]}" cy="${v[1]}" r="${v[2]}" fill="${mix(c, .12)}"/>`).join('');
      const escamas = [[28,12,6,3.4,-18],[52,14,5,3,12],[74,11,6.5,3.6,-8],[100,13,5.5,3.2,16],[124,12,6,3.4,-14],[148,14,5,3,10],[172,13,5.5,3.2,-12]]
        .map(v => oval(v[0], v[1], v[2], v[3], v[4], claro, '.85')).join('');
      const sombras = [[40,18,7,3,8],[88,19,8,3.2,-6],[136,18,7,3,10],[180,18,5,2.6,-8]]
        .map(v => oval(v[0], v[1], v[2], v[3], v[4], oscuro, '.5')).join('');
      const tostaditos = [[34,16,2.4],[66,17,2],[108,16,2.6],[142,17,2.2],[166,16,2]]
        .map(v => `<circle cx="${v[0]}" cy="${v[1]}" r="${v[2]}" fill="${tostado}" fill-opacity=".5"/>`).join('');
      return svg(30, `<defs>${def}</defs>${migas}
        <path d="M8 18C8 12 12 8 18 9 22 4 30 4 34 9 40 5 48 6 52 11 58 5 66 3 72 9 78 4 86 5 92 10 98 4 106 4 112 9 118 5 126 6 132 11 138 5 146 4 152 9 158 6 166 5 172 10 178 7 186 9 190 14 194 18 192 22 186 23 170 26 140 21 110 24 80 27 50 22 22 24 13 25 8 22 8 18Z" fill="url(#${id})"/>
        <path d="M10 21c26 5 52-2 78 1s52 4 82-3c4 3 6 5 4 6-28 6-56 0-84 2s-56 3-80-3c-2-1 0-2 0-3z" fill="${tostado}" fill-opacity=".45"/>
        ${sombras}${escamas}${tostaditos}`);
    },
    // carne deshilachada
    shredded: c => svg(22, `<g stroke-linecap="round" fill="none">
      <g stroke="${mix(c, -.3)}" stroke-width="6"><path d="M12 10c18-4 36 3 54-1"/><path d="M74 9c20-3 38 4 58 0"/><path d="M138 11c18-3 34 2 50-1"/></g>
      <g stroke="${c}" stroke-width="5"><path d="M10 8c18-4 36 3 54-1"/><path d="M72 7c20-3 38 4 58 0"/><path d="M136 9c18-3 34 2 50-1"/>
        <path d="M8 16c22 3 40-3 60 1"/><path d="M76 17c20 3 36-3 56 1"/><path d="M140 16c16 3 30-2 48 1"/></g>
      <g stroke="${mix(c, .34)}" stroke-width="2"><path d="M16 7c16-3 32 2 48-1"/><path d="M84 15c18 2 32-2 48 1"/></g></g>`),
    // hojas rizadas que asoman
    frills: c => svg(18, `<rect x="10" y="0" width="180" height="10" fill="${c}"/>
      <g fill="${c}"><circle cx="24" cy="9" r="8"/><circle cx="48" cy="8" r="10"/><circle cx="72" cy="10" r="8"/><circle cx="96" cy="8" r="10"/><circle cx="120" cy="9" r="8"/><circle cx="146" cy="8" r="10"/><circle cx="170" cy="9" r="8"/></g>
      <g fill="#000" fill-opacity=".16"><circle cx="48" cy="12" r="4"/><circle cx="96" cy="12" r="4"/><circle cx="146" cy="12" r="4"/></g>`),
    // rodajas
    slices: c => svg(17, `<g fill="${mix(c, -.32)}"><ellipse cx="46" cy="9" rx="38" ry="7.5"/><ellipse cx="100" cy="9" rx="38" ry="7.5"/><ellipse cx="154" cy="9" rx="38" ry="7.5"/></g>
      <g fill="${c}"><ellipse cx="46" cy="8" rx="35" ry="6.4"/><ellipse cx="100" cy="8" rx="35" ry="6.4"/><ellipse cx="154" cy="8" rx="35" ry="6.4"/></g>
      <g fill="${mix(c, .36)}" fill-opacity=".9"><ellipse cx="46" cy="7.6" rx="20" ry="3"/><ellipse cx="100" cy="7.6" rx="20" ry="3"/><ellipse cx="154" cy="7.6" rx="20" ry="3"/></g>
      <g fill="#fff" fill-opacity=".3"><ellipse cx="38" cy="6" rx="8" ry="1.6"/><ellipse cx="92" cy="6" rx="8" ry="1.6"/><ellipse cx="146" cy="6" rx="8" ry="1.6"/></g>`),
    // aros
    rings: c => svg(19, `<g fill="none" stroke="${mix(c, -.32)}" stroke-width="5.5"><ellipse cx="48" cy="10" rx="30" ry="7"/><ellipse cx="104" cy="10" rx="26" ry="7"/><ellipse cx="156" cy="10" rx="28" ry="7"/></g>
      <g fill="none" stroke="${c}" stroke-width="4"><ellipse cx="48" cy="9" rx="30" ry="7"/><ellipse cx="104" cy="9" rx="26" ry="7"/><ellipse cx="156" cy="9" rx="28" ry="7"/></g>
      <g fill="none" stroke="${mix(c, .42)}" stroke-width="1.6" stroke-opacity=".85" stroke-linecap="round"><path d="M26 6c8-3 20-4 30-2"/><path d="M84 6c7-3 17-4 26-2"/><path d="M134 6c8-3 19-4 28-2"/></g>`),
    // tiras finas
    strands: c => svg(16, `<g stroke="${c}" stroke-width="4" stroke-linecap="round" fill="none">
      <path d="M10 6c16 6 30-4 46 2s28-4 44 2 30-4 46 2 28-3 44 1"/>
      <path d="M12 12c18-5 30 4 48-1s30 5 46 0 28 5 44 0 26 3 38 1"/></g>`),
    // lonchas onduladas con su veta
    bacon: c => svg(18, `<path d="M6 5c22-6 34 8 56 2s36 8 56 2 36 7 58 1v8c-22 6-36-7-58-1s-36-8-56-2-34-8-56-2z" fill="${mix(c, -.35)}"/>
      <path d="M6 4c22-6 34 8 56 2s36 8 56 2 36 7 58 1v6c-22 6-36-7-58-1s-36-8-56-2-34-8-56-2z" fill="${c}"/>
      <path d="M8 6.5c22-5 34 8 56 2s36 8 56 2 36 7 58 1" fill="none" stroke="#F8D3B4" stroke-opacity=".85" stroke-width="2.6"/>
      <path d="M9 9.5c22-5 34 8 56 2s36 8 56 2 36 7 58 1" fill="none" stroke="${mix(c, -.45)}" stroke-opacity=".45" stroke-width="1.6"/>`),
    // huevo con su yema
    egg: () => svg(24, `<ellipse cx="100" cy="15" rx="80" ry="8.5" fill="#EADCC4"/>
      <path d="M24 15c-6-8 2-12 10-9 2-7 12-9 18-4 5-8 18-8 23-1 7-6 19-4 21 4 9-3 18 2 16 10z" fill="#FFF8EA"/>
      <ellipse cx="100" cy="14" rx="78" ry="7.5" fill="#FFF8EA"/>
      <ellipse cx="88" cy="13" rx="9" ry="7.5" fill="#E8A20F"/>
      <ellipse cx="88" cy="12" rx="7.5" ry="6.2" fill="#F9C132"/>
      <ellipse cx="85" cy="10" rx="2.8" ry="2" fill="#FFE49A"/>`),
    // loncha de queso con esquinas caídas
    cheese: c => svg(16, `<path d="M8 3h184v7c0 3-2 5-5 5H13c-3 0-5-2-5-5z" fill="${mix(c, -.3)}"/>
      <path d="M8 2h184v6c0 3-2 5-5 5H13c-3 0-5-2-5-5z" fill="${c}"/>
      <path d="M8 2h184v3H8z" fill="#fff" fill-opacity=".35"/>
      <path d="M22 11h156" stroke="${mix(c, -.35)}" stroke-opacity=".45" stroke-width="1.6" stroke-linecap="round"/>`),
    // queso fundido que gotea
    melted: c => svg(22, `<path d="M6 2h188v7c0 3-2 5-5 5l-4 6c-1 2-3 2-4 0l-4-6h-18l-5 8c-1 2-3 2-4 0l-5-8H88l-5 7c-1 2-3 2-4 0l-5-7H46l-5 7c-1 2-3 2-4 0l-5-7c-3 0-5-2-5-5z" fill="${c}"/>
      <path d="M6 2h188v3H6z" fill="#fff" fill-opacity=".35"/>`),
    // hilo de salsa
    drizzle: c => svg(14, `<path d="M10 9c14-6 24 4 38-1s24 5 38 0 24 5 38 0 22 4 36 1" fill="none" stroke="${mix(c, -.35)}" stroke-width="6" stroke-linecap="round"/>
      <path d="M10 8c14-6 24 4 38-1s24 5 38 0 24 5 38 0 22 4 36 1" fill="none" stroke="${c}" stroke-width="5" stroke-linecap="round"/>
      <path d="M14 6c12-4 22 3 34-1" fill="none" stroke="${mix(c, .4)}" stroke-opacity=".8" stroke-width="1.6" stroke-linecap="round"/>`)
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
