# VANT · Landing

Web premium para **VANT**, agencia de visibilidad en IA para clínicas privadas de
implantología. Dirección de marca: *"autoridad discreta / lujo callado"* — sobria,
con mucho aire, sin estética startup.

## Stack

Estático, sin dependencias ni build. Se sirve tal cual.

```
index.html            Página única (hero, por qué, método, casos, contacto, footer)
assets/css/styles.css Sistema de estilos (tokens de marca, 60/30/10)
assets/js/script.js   Reveals al hacer scroll, navbar, menú móvil, contadores, form
```

## Marca

Paleta y tipografía tomadas del *VANT Brand Kit*:

| Rol | Color |
|-----|-------|
| Primary (petróleo-tinta) | `#0E3A3A` |
| Texto autoridad | `#101E1E` |
| Accent (latón mate) | `#B08D57` |
| Fondo (papel cálido) | `#FAF8F3` |
| Surface | `#FFFFFF` |
| Border | `#E4E0D7` |
| Texto secundario | `#5A6360` |

Tipografía: **Fraunces** (display serif), **Inter** (texto), **IBM Plex Mono** (datos),
cargadas desde Google Fonts. Reparto de color 60 papel / 30 petróleo / 10 latón.

## Pendiente de completar

- **Imágenes:** los bloques `.ph` (marcados con `[Foto ...]`) son placeholders a la
  espera de fotos reales de clínica, equipo y pacientes.
- **Testimonios:** son de ejemplo, marcados como tales; se sustituirán por casos reales.
- **Formulario:** valida en cliente y muestra confirmación, pero no envía a ningún
  backend todavía. Falta conectar endpoint o calendario (p. ej. Calendly) en
  `assets/js/script.js` (`#auditForm`).
- **Contacto:** `hola@vant.example` es un placeholder de correo.

## Vista local

Abrir `index.html` en el navegador, o servir la carpeta:

```
python3 -m http.server 8000
```
