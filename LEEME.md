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

- **Comparador antes / después** (portada y `proyectos.html`): se arrastra con el
  ratón, con el dedo o con las flechas del teclado. Al entrar en pantalla se
  mueve solo un instante para que el visitante entienda que puede tocarlo.
  Las imágenes están en `assets/img/ba/` y van por pares
  (`*-antes.jpg` / `*-despues.jpg`). Para añadir un par nuevo basta con
  duplicar la llamada al componente.
- **Corte interactivo del tabique** (`drywall.html`): SVG dibujado a medida, no
  es una imagen. Al pasar el ratón por cada capa — placa, perfilería, lana,
  banda elástica, refuerzo y juntas — se resalta en el dibujo y cambia el texto.
  Es el argumento técnico de la web: enseña que sabe lo que hay dentro.

Los enlaces a CSS y JS llevan `?v=4`. Si cambias esos archivos, sube el número
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
