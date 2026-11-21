# Lanzamiento en manchayna.es (principio de diciembre)

Pasos para sustituir la web de WordPress por esta. En orden.

## Antes de tocar nada
- [ ] **Copia de seguridad del WordPress actual**: exporta la base de datos y la carpeta
      `wp-content/uploads`. Las fotos de la web nueva ya están guardadas aquí
      (`shared/img/menu/`), pero puede haber más material que interese conservar.
- [ ] Anota en qué URLs está posicionada la web actual (Search Console o Analytics).
      Las más visitadas deberían seguir existiendo o redirigir.
- [ ] Comprueba quién gestiona el dominio y dónde están los DNS.

## Estructura (recomendado hacerlo antes de publicar)
Hoy las páginas viven en `/carretilla-v2/`. En el dominio definitivo deberían estar
en la raíz, para que las direcciones queden limpias:

| Ahora | Al publicar |
|---|---|
| manchayna.es/carretilla-v2/ | manchayna.es/ |
| manchayna.es/carretilla-v2/carta.html | manchayna.es/carta/ |
| manchayna.es/carretilla-v2/crea-tu-burger.html | manchayna.es/crea-tu-burger/ |

Son 10 minutos de trabajo: mover los archivos y ajustar las rutas. Pídemelo y lo hago.

## Cambios obligatorios en el código antes de publicar
- [ ] **Quitar el bloqueo a Google**: borrar `<meta name="robots" content="noindex, nofollow">`
      de las tres páginas. Mientras esté puesto, Google no indexa nada.
- [ ] **Direcciones absolutas**: `og:image` y el campo `image` de la ficha de restaurante
      apuntan hoy a `roberjr10.github.io`. Cambiar a `https://manchayna.es/...`.
- [ ] Añadir `<link rel="canonical">` en cada página con su dirección definitiva.
- [ ] Revisar `robots.txt` y `sitemap.xml` (ya preparados en la raíz del repo).

## Publicación
- [ ] Apuntar el dominio a GitHub Pages (registro A/CNAME) y crear el archivo `CNAME`
      con `manchayna.es`.
- [ ] Activar HTTPS en GitHub Pages.
- [ ] Comprobar que `manchayna.es` y `www.manchayna.es` llevan al mismo sitio.

## Justo después
- [ ] Dar de alta la web en **Google Search Console** y enviar el `sitemap.xml`.
- [ ] Actualizar el enlace de la web en la **ficha de Google Business**, en Instagram
      y en Facebook.
- [ ] Revisar que en la ficha de Google coinciden dirección, teléfono y horario
      con los de la web (Google compara y penaliza si no cuadran).
- [ ] Probar un pedido real de principio a fin desde un móvil.

## Pendiente de datos vuestros
- [ ] La salsa que en el configurador aparece como **«????»** (quedó tapada en el póster).
- [ ] Fecha de fin de la promoción de «Crea tu propia Manchayna», si se quiere avisar.
- [ ] Zona de reparto y coste del envío, si queréis que salgan escritos en la web.
      Ahora mismo dice que se confirman por WhatsApp.
- [ ] El póster que circula pone 6,00 € de base y la web dice 8,00 €. Conviene
      retirar o corregir el póster.
