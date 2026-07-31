# Assets del hero

Suelta aquí los dos archivos del hero, con estos nombres exactos:

| Archivo | Qué es |
|---|---|
| `clinica-poster.jpg` | La fotografía del interior de la clínica. Es el único archivo necesario. |
| `clinica-loop.mp4` | Bucle corto y silencioso. Opcional, y hoy no existe: generar vídeo en Higgsfield exige plan de pago. |

**El movimiento no depende del vídeo.** El travelling lento lo hace la
animación `travelling` de `.placa` en `src/hero.css`, que arrastra despacio
todo lo que haya dentro — incluida una imagen fija. Con solo el JPG, el hero
ya se mueve como estaba previsto, pesa una fracción de lo que pesaría un vídeo
y se detiene solo si el sistema pide movimiento reducido.

Con la imagen puesta, hay que descomentar la línea `<img>` de `src/hero.html`
(el vídeo tiene su propio par `data-src` / `data-poster`) y recompilar:

```sh
python3 tools/build.py src/index.html index.html --produccion
```

No hace falta editarlos antes de subirlos: el tratamiento duotono
—blanco y negro más velo petróleo— lo aplica el CSS sobre la imagen original.
