# Chef Cinnamon’s Reading Adventure

This branch contains the React, TypeScript, and Vite rebuild of **Chef Cinnamon’s Reading Adventure**, set in **The Storybook Kingdom**. Production `main` remains unchanged.

## Application entry points

- `index.html` mounts the Vite application from `src/main.tsx`.
- `src/main.tsx` mounts the React application and loads the TypeScript/CSS source tree.
- `public/manifest.webmanifest` is the PWA manifest copied by Vite.
- `public/sw.js` is the service worker registered by the React entry point.

No root-level prototype JavaScript, stylesheet, manifest, or service worker is used.

## Local development

Use Node.js 22 and pnpm.

```sh
pnpm install --frozen-lockfile
pnpm run dev
```

For a production-style preview:

```sh
pnpm run build
pnpm run preview
```

For browser journeys, install Chromium and run:

```sh
pnpm exec playwright install --with-deps chromium
pnpm run test:e2e
```

The `Application verification` GitHub Actions workflow runs type checking, ESLint, automated tests, the production build, and Playwright on desktop and mobile Chromium. See `docs/PlaywrightAndCI.md` for details.

## Browser limitations

Speech synthesis and speech recognition vary by browser, installed voices, device policy, and microphone permissions. Reading activities retain a no-microphone path. Speech and placement results are instructional estimates, not formal diagnostic assessments.
