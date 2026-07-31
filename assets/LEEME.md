# Assets del hero

Suelta aquí los dos archivos del hero, con estos nombres exactos:

| Archivo | Qué es |
|---|---|
| `clinica-poster.jpg` | Imagen fija del interior de la clínica. Es lo que se ve en móvil, con conexión lenta y con movimiento reducido. |
| `clinica-loop.mp4` | Bucle corto y silencioso con el travelling lento. Opcional: sin él, el hero se queda con la imagen fija. |

En cuanto estén, hay que rellenar `data-src` y `data-poster` en `src/hero.html`
y recompilar:

```sh
python3 tools/build.py src/index.html index.html --produccion
```

No hace falta editarlos antes de subirlos: el tratamiento duotono
—blanco y negro más velo petróleo— lo aplica el CSS sobre la imagen original.
