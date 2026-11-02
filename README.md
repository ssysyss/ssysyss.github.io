# Shiyuan Sheng / A little map of me

A personal portfolio disguised as an enchanted map. Hover, focus, click, or tap
one of four destinations to light it up, move a broom-riding ghost, and reveal
the corresponding chapter: About, Resume, Side Quests (hobbies), or Fun Facts.

The ghost in **SH[ghost]YUAN** is an SVG adapted from the supplied visual reference,
preserving its wide floating silhouette rather than reshaping it into an I.
The map and its architectural illustrations are original SVG
artwork, not reproductions of an official Harry Potter map.

## Local preview

No build step, packages, or external services are required. From this directory:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Open <http://127.0.0.1:8000>. Stop the server with Ctrl+C.

## Personalize

- **Content:** edit the four `.story-section` elements in `index.html`. Bracketed
  personal details are placeholders, not actual experience or interests.
- **Resume:** replace the sample entries and the PDF-not-added note with your
  real information. To provide a PDF, add your file and a link to it.
- **Ghost:** edit `assets/ghost.svg`; it is shared by the wordmark and traveler.
- **Map:** edit the inline SVG and `.map-location` buttons. Each button's `--x`
  and `--y` values position its label. `data-x` and `data-y` set the ghost's
  destination, as percentages of the map surface.
- **Themes:** edit the dark and light custom properties in `styles.css`.
  Dark is the default. The Lumos/Nox button switches themes and remembers the
  choice when browser storage is available.

The map uses native buttons for keyboard and touch access. The selected chapter
remains open when the pointer leaves a location. Reduced-motion preferences
disable ghost travel and decorative animation. Without JavaScript, all chapters
remain readable. Fonts and artwork are served locally or provided by the system.

## Domain and deployment

No deployment-specific configuration (`CNAME`, DNS settings, or GitHub Pages
workflow) has been added. Configure deployment separately if needed.
