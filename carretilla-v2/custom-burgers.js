/* Burgers montadas en el configurador.
   Se guardan en la sesión y se registran como categoría oculta de MENU_DATA,
   para que el carrito de shared/app.js las trate como un plato más.
   Debe cargarse DESPUÉS de menu-data.js y ANTES de app.js. */
(() => {
  const KEY = 'manchayna-custom';
  const cat = { id: 'custom', name: 'Tus creaciones', hidden: true, items: [] };
  window.MENU_DATA.push(cat);

  const save = () => { try { sessionStorage.setItem(KEY, JSON.stringify(cat.items)); } catch {} };
  try { JSON.parse(sessionStorage.getItem(KEY) || '[]').forEach(i => cat.items.push(i)); } catch {}

  // Devuelve el nombre con el que queda registrada (único dentro de la sesión)
  window.addCustomBurger = ({ desc, price }) => {
    const n = cat.items.length + 1;
    const item = { name: `Mi Manchayna #${n}`, desc, price, tags: [], custom: true };
    cat.items.push(item);
    save();
    return item.name;
  };
})();
