# GMG_ALEJO

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
