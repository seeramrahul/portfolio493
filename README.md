# Rahul Seeram — Design after dark

An interactive product-design portfolio with an original neon voxel city, four verified case studies, and a playable district-exploration mode.

## Run locally

No installation or build step is needed. From this directory:

```sh
python3 -m http.server 8000 --directory public
```

Open http://localhost:8000. Serve the `public` folder as the website root; opening the HTML directly as a file will not resolve its root-relative asset paths.

## Files

- `public/index.html` — portfolio layout and city interface
- `public/style.css` — responsive styling and motion preferences
- `public/app.js` — case studies, filtering, dialogs, and contact interactions
- `public/game.js` — travel, missions, collectibles, XP, saved progress, and sound
- `public/` image and PDF assets — original city artwork, portfolio images, portrait, and résumé

## Game controls

Choose **Enter the district**, then use the arrow keys or WASD to travel. Press Enter to open a mission and Escape to exit game mode. On phones, use the previous/next and Open mission buttons. Collect an insight at the end of each case study to earn 100 XP. Four insights unlock the District Architect badge.

Progress is stored only in the visitor's browser. Sound is off by default. Motion respects the operating system preference and can be disabled in the interface. Case studies are also accessible without game mode.

## Hosting

The current site is hosted at https://rahul-seeram-the.hatchable.site. At export, Hatchable project `proj_1kbpagEiAUNn` was on version 5 with private visibility.

Any static host can serve the contents of `public/`. No backend, database, API keys, or environment variables are required. Google Fonts are loaded externally, with system-font fallbacks. This repository is a source backup; pushing to GitHub does not automatically update the Hatchable deployment.

If hosting beneath a repository subpath (for example GitHub Pages at `/repository-name/`), first adapt the root-relative asset URLs in HTML and JavaScript. The existing files expect hosting at `/`.

## Content and artwork

Portfolio content and product imagery come from https://rahulseeramportfolio.lovable.app/. Case studies distinguish shipped work from planned capabilities and retain the source's outcome limitations. The city artwork was generated for this portfolio, with visual inspiration from The 9th Dragon. No game artwork was copied. This portfolio is not affiliated with the game's creators.

The files include Rahul's publicly listed contact email and résumé. No license granting reuse of portfolio or product imagery is included.

## Verification

The exported website files were checked against Hatchable's SHA-256 file hashes. Browser checks covered all four mission rewards, duplicate-reward prevention, saved progress, restart and undo, keyboard travel, project filtering, and phone layouts at 390px and 320px.
