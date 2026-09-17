# GMG_ALEJO7

## Panel de administración (nuevo)

Panel en español en `/admin/`, preparado para Netlify y el repositorio privado `Yostin0R/gmg-alejo`. **Falta conectar Netlify y activar GitHub OAuth en las cuentas del propietario; el acceso y el despliegue no están activos todavía.**

Permite subir portada, perfil e imágenes (5 MB), añadir/quitar/ordenar juegos y videos, y configurar redes sociales. Los videos aceptan enlaces HTTPS o archivos MP4/WebM hasta 20 MB. YouTube se reproduce dentro de la página; las demás plataformas se abren por enlace. Visualizaciones y duración se editan manualmente.

Los cambios se guardan en `dist/content/site.json`, y las subidas en `dist/assets/uploads`. Publicar crea commits en `main`; Netlify los desplegará automáticamente una vez conectado. El contenido ya no se edita en `app.js`.

### Activación

1. Importa este repositorio en Netlify, rama `main`. `netlify.toml` indica carpeta `dist` y comando `node scripts/validate-content.cjs`.
2. Registra una OAuth App en GitHub: Homepage con la URL final; callback `https://api.netlify.com/auth/done`.
3. Netlify → Project configuration → Access & security → OAuth → Install provider → GitHub. Introduce Client ID y Client Secret allí, nunca en el repositorio o el chat.
4. Invita a tu amigo como colaborador. Ese permiso permite editar contenido y código; Decap necesita permiso de escritura.
5. Prueba `/admin/` en producción, publica un cambio pequeño y verifica commit y despliegue. OAuth no se valida con el servidor local.

La página será pública al desplegarla aunque el repositorio sea privado. No subas contenido privado a `dist`. No hay una contraseña compartida ni un modo local que permita escribir sin autenticación.

[Guía del editor](dist/admin/guia.html) · [OAuth Netlify](https://docs.netlify.com/manage/security/secure-access-to-sites/oauth-provider-tokens/) · [GitHub Decap](https://decapcms.org/docs/github-backend/).

### Comprobaciones

```sh
node scripts/validate-content.cjs
node --test scripts/content.test.cjs
```

La validación impide IDs repetidos, videos sin juego o fuente, enlaces inseguros y archivos locales ausentes o demasiado grandes. Se ejecuta antes de guardar y antes del despliegue. Si falla en Netlify, la última versión publicada sigue disponible. Evita ediciones simultáneas del mismo formulario; restaura contenido revirtiendo su commit.

Responsive gaming and streamer landing page built with HTML, CSS and JavaScript.

## Local preview

Run from the repository root:

```sh
python -m http.server 4173 --directory dist
```

Then open http://localhost:4173.

## Site files

- `dist/index.html`: page structure and content.
- `dist/style.css`: responsive styles and animation.
- `dist/app.js`: game filtering, navigation and preview dialogs.
- `dist/assets/hero.png`: original generated gaming setup artwork.

The `dist` directory can be served by any static web host. No build or dependencies are required.

## Content to personalize

Video titles, view counts and profile stats are illustrative and marked in the interface. Add the official video and social profile URLs before launching the site for viewers. Game images are referenced from their publishers' or stores' external servers; Google Fonts also requires network access.

## Interaction

Game cards filter the content grid. Video and social controls currently display explanatory preview dialogs. The layout includes mobile navigation and respects reduced-motion preferences.
