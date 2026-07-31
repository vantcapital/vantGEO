# VANT — web

Página única. Mide y mejora la visibilidad de clínicas privadas en las
respuestas de los asistentes de IA.

## Archivos

| Archivo | Qué es |
|---|---|
| `index.html` | **El sitio.** Compilado, autocontenido, sin dependencias ni red. Es lo que se publica. |
| `src/index.html` | Fuente del sitio: marcado y CSS propio de la página. |
| `src/core.css`, `src/core.js` | Base compartida: tokens, componentes y movimiento. |
| `src/hero.html`, `src/hero.css` | El hero «Velo». |
| `src/ajustes.html` | Barra de ajustes flotante. Solo en desarrollo. |
| `previews/` | Exploraciones de diseño ya decididas, conservadas como referencia. |
| `tools/build.py` | Compila las fuentes en un único archivo. |

## Compilar

```sh
python3 tools/build.py src/index.html index.html --produccion   # el sitio
python3 tools/build.py src/index.html previews/index.html       # con barra de ajustes
```

El build incrusta las tipografías (Fraunces, Inter, IBM Plex Mono; subconjunto
latino, woff2) como data URI, así que la página no pide nada a ninguna red.
Se cachean en `tools/.fonts-cache.css`; borra ese archivo para volver a bajarlas.

`--produccion` deja fuera la barra de ajustes.

## Pendiente

- **Assets del hero.** `src/hero.html` tiene un `<video>` con `data-src` y
  `data-poster` vacíos. Al rellenarlos con `assets/clinica-loop.mp4` y
  `assets/clinica-poster.jpg`, el vídeo se activa solo — diferido, silencioso,
  y con el póster como respaldo en móvil, conexión lenta o movimiento reducido.
  Mientras estén vacíos se ve una composición CSS con el mismo tratamiento
  duotono y ninguna petición de red.
- **Webhook del formulario.** Ver `TODO(webhook)` en `src/core.js`: hoy el
  formulario valida y muestra el acuse, pero no envía nada a ningún sitio.
- **Testimonios.** Los tres son ejemplos ilustrativos, no clientes reales, y
  están marcados como tales en pantalla y en un comentario del código.
  Sustituir por citas reales con permiso por escrito, o eliminar la sección.
- **Aviso legal y privacidad.** Los dos enlaces del pie no apuntan a nada.

## Criterios que no se negocian

- Nunca se promete un puesto ni un ranking en las respuestas de la IA.
- Ninguna cifra se presenta como dato de mercado: las del informe de ejemplo
  van etiquetadas como ilustrativas en la propia tarjeta.
- El latón se ve, no se lee: `--acento` es para filetes, puntos y rellenos;
  el texto usa `--acento-txt`, que cumple AA sobre papel y sobre crema.
- Un solo CTA en toda la página: todo lleva a la auditoría gratuita.
