/* ==========================================================================
   Carta de Manchayna — ÚNICA fuente de datos para las tres propuestas.
   Textos y precios copiados de https://manchayna.es/carta/

   Cada plato:
     name   (obligatorio)
     desc   (obligatorio)
     price  (obligatorio, texto: "8,00€")
     image  (opcional, solo si hay foto real)
     tags   (opcional) nuevo · veggie · picante · queso · crujiente · compartir
     origin (opcional) etiqueta de inspiración — PROPUESTA, validar con el negocio
     spec   (opcional) cantidad destacada al ampliar la foto: "220 g", "8 uds."
     ing    (opcional) ingredientes que se muestran al ampliar la foto
   ========================================================================== */

const U = 'https://manchayna.es/wp-content/uploads/';

window.MENU_DATA = [
  {
    id: 'hamburguesas',
    name: 'Hamburguesas',
    items: [
      { name: 'Smash-Ayna', desc: '220 g de carne de vacuno, salsa BBQ, quesos mozzarella y cheddar y cebolla frita.', price: '14,90€', image: U + '2025/01/COLOR9.webp', tags: ['queso'], origin: 'USA', spec: '220 g', ing: ['Carne de vacuno', 'Salsa BBQ', 'Mozzarella', 'Cheddar', 'Cebolla frita'] },
      { name: 'La blanquirroja', desc: '180 g de vacuno, queso brie, pimiento ahumado caramelizado, mayonesa de trufa, tomate y rúcula.', price: '13,90€', image: U + '2025/01/blanquirroja-scaled.jpg', tags: ['queso'], origin: 'PERÚ', spec: '180 g', ing: ['Carne de vacuno', 'Queso brie', 'Pimiento ahumado caramelizado', 'Mayonesa de trufa', 'Tomate', 'Rúcula'] },
      { name: 'La carretillera', desc: '180 g de vacuno, queso mozzarella, lechuga, tomate, patatas paja, salsa rosa y nuestra salsa de aceitunas.', price: '13,90€', image: U + '2025/01/carritellera-scaled.jpeg', tags: ['queso', 'crujiente'], origin: 'PERÚ', spec: '180 g', ing: ['Carne de vacuno', 'Mozzarella', 'Lechuga', 'Tomate', 'Patatas paja', 'Salsa rosa', 'Salsa de aceitunas'] },
      { name: 'A lo pobre', desc: '180 g de vacuno, huevo, bacon, salsa cheddar, plátano macho maduro, lechuga y tomate.', price: '12,90€', tags: ['queso'], origin: 'PERÚ' },
      { name: 'La peruanita', desc: '120 g de vacuno, panceta de cerdo, salsa de cebolla y boniato.', price: '12,90€', origin: 'PERÚ' },
      { name: 'Loca como una cabra', desc: '180 g de vacuno, queso de cabra, cebolla caramelizada, tomate cherry, lechuga y salsa rosa.', price: '12,50€', image: U + '2025/01/loca_como_una_cabra-2-scaled.jpg', tags: ['queso'], spec: '180 g', ing: ['Carne de vacuno', 'Queso de cabra', 'Cebolla caramelizada', 'Tomate cherry', 'Lechuga', 'Salsa rosa'] },
      { name: 'Inka', desc: '180 g de vacuno, huevo, queso, tomate, lechuga y cebolla caramelizada.', price: '10,90€', tags: ['queso'], origin: 'PERÚ' },
      { name: 'Kiki', desc: 'Pollo crispy, bacon, salsa de pimiento ahumado, lechuga y tomate.', price: '10,90€', image: U + '2025/01/kiik.jpeg', tags: ['nuevo', 'crujiente'], ing: ['Pollo crispy', 'Bacon', 'Salsa de pimiento ahumado', 'Lechuga', 'Tomate'] },
      { name: 'Veggi', desc: 'Mezcla de setas, especias, guacamole, boniato, cebolla caramelizada, lechuga y tomate.', price: '10,90€', tags: ['veggie'] },
      { name: 'Chimi', desc: '180 g de vacuno, repollo, huevo y tomate. Con un toque de nuestra salsa picante.', price: '9,90€', tags: ['picante'], origin: 'R. DOMINICANA' }
    ]
  },
  {
    id: 'pulled',
    name: 'Pulled burgers',
    items: [
      { name: 'La Manchayna', desc: 'Pulled pork, guacamole, boniato y cebolla.', price: '12,80€', image: U + '2025/01/pulled_manchayna.jpeg', ing: ['Pulled pork', 'Guacamole', 'Boniato', 'Cebolla'] },
      { name: 'A la brasa', desc: 'Pulled pollo a la brasa, jamón york, queso cheddar, salsa de ají amarillo, lechuga y tomate.', price: '12,80€', image: U + '2025/01/a_la_brasa.jpeg', tags: ['queso', 'picante'], origin: 'PERÚ', ing: ['Pollo a la brasa', 'Jamón york', 'Cheddar', 'Salsa de ají amarillo', 'Lechuga', 'Tomate'] }
    ]
  },
  {
    id: 'entrantes',
    name: 'Entrantes',
    items: [
      { name: 'Tequeños', desc: 'Deditos rellenos de queso latino acompañados de guacamole.', price: '8,50€', image: U + '2025/05/Tequenos6-1024x683.png', tags: ['queso', 'crujiente', 'compartir', 'veggie'], origin: 'VENEZUELA', ing: ['Queso latino', 'Guacamole'] },
      { name: 'Yucas crocantes', desc: 'Acompañadas con mayonesa y salsa brava.', price: '8,00€', image: U + '2025/01/image1-1024x768.jpeg', tags: ['crujiente', 'compartir', 'veggie'], ing: ['Yuca', 'Mayonesa', 'Salsa brava'] },
      { name: 'Tortitas Manchayna', desc: '4 tacos crujientes rellenos de lechuga, carne mechada, guacamole y pico de gallo.', price: '10,50€', image: U + '2025/01/image2-scaled.jpeg', tags: ['crujiente', 'compartir'], spec: '4 uds.', ing: ['Tacos crujientes', 'Lechuga', 'Carne mechada', 'Guacamole', 'Pico de gallo'] },
      { name: 'Alitas BBQ o Crispy', desc: '8 alitas con salsa BBQ o crujientes. Si no te decides, combínalas.', price: '9,50€', image: U + '2025/01/image4-scaled.webp', tags: ['crujiente', 'compartir'], spec: '8 uds.', ing: ['Alitas de pollo', 'Salsa BBQ o rebozado crujiente'] },
      { name: 'Cachapas', desc: '3 tortillas de maíz dulce rellenas de queso latino.', price: '9,80€', image: U + '2025/05/Cachapas-1024x683.png', tags: ['queso', 'compartir', 'veggie'], origin: 'VENEZUELA', spec: '3 uds.', ing: ['Maíz dulce', 'Queso latino'] },
      { name: 'Nachos Crash!!', desc: 'Nachos artesanales con guacamole, chili con carne, pico de gallo y salsa de queso cheddar.', price: '12,50€', tags: ['queso', 'crujiente', 'compartir'], origin: 'MÉXICO' },
      { name: 'Palitos de mozzarella', desc: 'Acompañados con salsa BBQ.', price: '8,50€', tags: ['queso', 'crujiente', 'compartir', 'veggie'] },
      { name: 'Aros de cebolla', desc: 'Acompañados con salsa BBQ.', price: '8,00€', tags: ['crujiente', 'compartir', 'veggie'] }
    ]
  },
  {
    id: 'ensaladas',
    name: 'Ensaladas',
    items: [
      { name: 'Andina', desc: 'Mix de lechugas, maíz dulce, queso fresco, tomate cherry y tiras de pollo crispy. Con nuestra salsa cheddar.', price: '10,50€', tags: ['queso', 'crujiente'], origin: 'PERÚ' },
      { name: 'Loca como una cabra (ensalada)', desc: 'Mix de lechugas, tomate cherry, nuez, pasas y rulo de cabra. Con mermelada de tomate y sirope de frutos del bosque.', price: '11,50€', tags: ['queso', 'veggie'] }
    ]
  },
  {
    id: 'carnes',
    name: 'Carnes',
    items: [
      { name: 'Costillas a la BBQ', desc: '400 g de costillas ahumadas con patatas rejilla y salsa BBQ o sweet whisky.', price: '15,90€', image: U + '2025/05/costillas.webp', origin: 'USA', spec: '400 g', ing: ['Costillas ahumadas', 'Patatas rejilla', 'Salsa BBQ o sweet whisky'] },
      { name: 'Lomo bajo de vaca vieja', desc: '400–500 g a la parrilla con ensalada, patatas fritas y nuestra salsa de 5 pimientas.', price: '16,90€' }
    ]
  },
  {
    id: 'ninos',
    name: 'Para niños',
    items: [
      { name: 'Inka Jr', desc: '120 g de vacuno, lechuga, tomate y queso cheddar.', price: '6,90€', tags: ['queso'] },
      { name: 'Kiki Jr', desc: 'Pollo crispy, lechuga, tomate y queso cheddar.', price: '6,90€', tags: ['queso', 'crujiente'] },
      { name: 'Fingers de pollo', desc: '6 fingers de pollo con patatas fritas.', price: '7,50€', tags: ['crujiente'] },
      { name: 'Salchipapas', desc: 'Salchichas y fingers de pollo con patatas fritas.', price: '8,50€', origin: 'PERÚ' }
    ]
  },
  {
    id: 'postres',
    name: 'Postres',
    items: [
      { name: 'Tarta tres leches', desc: 'Bizcocho bañado en tres tipos de leche, cubierto de nata y canela.', price: '5,90€', image: U + '2025/05/tresLeches.jpg', origin: 'LATAM', ing: ['Bizcocho', 'Tres leches', 'Nata', 'Canela'] },
      { name: 'Tarta de queso', desc: 'Cremosa, con sirope de fruta de la pasión o de frutos del bosque.', price: '5,90€', image: U + '2025/05/CheeseCake.jpg', ing: ['Queso', 'Sirope de fruta de la pasión o de frutos del bosque'] },
      { name: 'Tarta de chocolate', desc: 'Bizcocho de chocolate casero con sirope de triple chocolate.', price: '5,90€' }
    ]
  },
  {
    id: 'batidos',
    name: 'Batidos',
    note: 'Todos los batidos se preparan con agua. Añade leche por 0,50€.',
    items: [
      { name: 'Batido de fresa', desc: 'Con agua. Con leche, +0,50€.', price: '3,50€' },
      { name: 'Batido de mango', desc: 'Con agua. Con leche, +0,50€.', price: '3,50€' },
      { name: 'Batido de maracuyá', desc: 'Con agua. Con leche, +0,50€.', price: '3,50€' },
      { name: 'Batido de mora', desc: 'Con agua. Con leche, +0,50€.', price: '3,50€' },
      { name: 'Batido de guanábana', desc: 'Con agua. Con leche, +0,50€.', price: '3,50€' }
    ]
  }
];

window.MANCHAYNA = {
  phone: '624 55 26 13',
  tel: '+34624552613',
  wa: 'https://wa.me/34624552613',
  email: 'reservas@manchayna.es',
  instagram: 'https://www.instagram.com/manchayna.burger/',
  facebook: 'https://www.facebook.com/people/Manchayna-Burger/61566364282932/',
  maps: 'https://www.google.com/maps/search/?api=1&query=Manchayna+Fuente+el+Saz+de+Jarama',
  mapEmbed: 'https://maps.google.com/maps?q=Manchayna%2C%20fuente%20el%20saz&t=m&z=16&output=embed',
  // Miércoles a domingo (0 = domingo). Minutos desde medianoche.
  days: [0, 3, 4, 5, 6],
  slots: [[720, 1020], [1140, 1410]]
};
