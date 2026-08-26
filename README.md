# Automonie - Marketing site

A single, self-contained static landing page (`index.html`) — green-on-navy, PiggyVest-inspired, Josefin Sans, SVG icons, scroll animations. No build step.

## Run / deploy
- Open `index.html`, or `npx serve .`
- Deploy free on Vercel (`npx vercel`) or Netlify (drag the folder). Static, no config.

## Update links / images
- App links: edit the `LINKS` object in the inline `<script>` at the bottom of `index.html` (update `apk` after each Android build).
- Screenshots: drop real PNGs into an `assets/` folder and replace the `.shot .ph` placeholder blocks with `<img>` tags.
