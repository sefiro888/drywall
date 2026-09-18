# Rodríguez Drywall · demo web

Sitio estático de 7 páginas. No necesita servidor ni instalación: se abre
`index.html` con doble clic y funciona todo (menú, filtros, formulario a WhatsApp).

## Estructura

```
index.html          Portada
drywall.html        Servicio principal
aislamiento.html    Acústico y térmico
carpinteria.html    Carpintería
electricidad.html   Marcado como "Próximamente"
proyectos.html      Galería filtrable
contacto.html       Formulario que abre WhatsApp + vías directas

assets/css/style.css   Todo el diseño (variables de color arriba del archivo)
assets/js/main.js      Menú, animaciones, filtros, formulario
assets/img/head/       Imagen de cabecera de cada página
assets/img/gal/        Galería y bloques de contenido
assets/img/logo.png    Logotipo recortado de la foto, con fondo transparente
```

## Componentes interactivos

- **Presentación del emblema**: al abrir la web, el logotipo se ensambla en
  cuatro piezas y aparece la frase de marca. Dura unos 3,5 segundos: las piezas
  entran hasta 1,85 s, la frase a 1,95 s, la localidad a 2,55 s y la pantalla se
  retira a 3,45 s. **Se muestra una sola vez por sesión**: para volver a verla hay
  que abrir una ventana nueva o una pestaña privada. Se salta entera si el
  visitante tiene activado el ahorro de animaciones. Los tiempos están en las
  animaciones `.intro__*` de `style.css` y en el temporizador del bloque
  "Presentación del emblema" de `main.js`.
- **Diagnóstico de ruido** (`aislamiento.html`): tres preguntas y devuelve la
  solución que aplicaríamos, con mejora esperable, espacio que se pierde, plazo
  y matices honestos según el caso. El botón de WhatsApp sale con el caso
  redactado. La lógica está en `assets/js/main.js`, en el objeto `SOL`.
- **Comparador drywall / ladrillo** (`drywall.html`): tabla con barras. Es
  deliberadamente honesta: el ladrillo gana en cargas e inercia térmica. En
  móvil cada fila se despliega al tocarla.
- **Fichas de obra**: `obra-*.html`. Problema, solución, materiales, plazo y
  galería. Ahora son ejemplos y llevan un aviso que lo dice; para añadir una
  nueva basta con copiar un bloque en `OBRAS` del generador.
- **Comparador antes / después** (portada, proyectos y fichas): ratón, dedo y
  teclado. Las imágenes van por pares en `assets/img/ba/`.
- **Corte interactivo del tabique** (`drywall.html`): SVG a medida; al pasar el
  ratón o tocar cada capa se resalta y cambia el texto.
- **Lightbox**: cualquier foto de galería se amplía, con flechas, Escape y
  deslizamiento con el dedo.
- **Barra fija inferior en móvil**: Llamar / WhatsApp. En móvil sustituye al
  botón flotante para no duplicar la misma acción.

## Landing del QR de la furgoneta

`furgoneta.html` es una página aparte, sin menú, pensada para quien escanee el
QR del vehículo: cuatro atajos que abren WhatsApp con el mensaje ya escrito.

El QR ya generado apunta a ella:

- `assets/img/qr-furgoneta.png` — para pantalla
- `qr-furgoneta.svg` — vectorial, para el rotulista

Si cambia el dominio, hay que regenerarlo.

Los enlaces a CSS y JS llevan `?v=15`. Si cambias esos archivos, sube el número
para que a nadie se le quede la versión antigua en caché.

## Datos que hay que confirmar con el cliente

- **Años de experiencia**: la furgoneta pone "Since 2011" (15 años) y en la
  conversación habla de 16 años de trayectoria. Ahora mismo la web dice
  "16 años" en el contador y "Desde 2011" en el pie.
- **Zona de trabajo**: puesto "Málaga y provincia". Se cambia buscando ese
  texto en los HTML.
- **Horario**: puesto L–V 8:00–19:00 como supuesto.
- **Electricidad**: la página existe pero avisa de que el servicio aún no está
  disponible. Cuando termine la formación, basta con quitar el bloque de aviso
  y la etiqueta "Próximamente" del menú.
- **Email**: no se ha puesto ninguno porque no lo tenemos. Todo el contacto va
  por WhatsApp y teléfono (600 958 851).

## Colores

Tomados del logotipo. Están al principio de `style.css`:

| Variable | Valor | Uso |
|---|---|---|
| `--rojo` | `#D32027` | rojo de marca |
| `--rojo-vivo` | `#E8402F` | acentos y hover |
| `--negro` | `#0C0E10` | fondo |
| `--grafito` | `#14171A` | tarjetas |
| `--plata` | `#C9CDD2` | acabado cromado de los titulares |
| `--madera` | `#C9A063` | avisos de "próximamente" |

## Imágenes

Las fotos actuales son de banco (Unsplash, uso libre) y son provisionales.
En `PROMPTS-IMAGENES.md` están los prompts para generarlas o las indicaciones
para sustituirlas por fotos reales de sus obras. Basta con reemplazar el
archivo manteniendo el mismo nombre.

## Publicación

Al ser HTML estático vale cualquier alojamiento. Si se va a publicar de verdad,
antes hay que: quitar la barra superior de "Demostración visual", añadir aviso
legal y política de privacidad, y sustituir las fotos de banco por obra propia.
