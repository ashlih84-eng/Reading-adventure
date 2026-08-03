# Chef Cinnamon’s Reading Adventure preview

This branch is an in-progress React/TypeScript rebuild of **Chef Cinnamon’s Reading Adventure**, set in **The Storybook Kingdom**. The production `main` branch is unchanged.

## Local preview

1. Install Node.js 20 or newer.
2. Run `npm install`.
3. Run `npm run dev` and open the local address shown.

For a production-like preview, run `npm run build` followed by `npm run preview`. Configure a separate Netlify preview site or branch deploy for `cookie-kingdom-v2`; do not change the production site's branch from `main`.

Temporary developer artwork is original inline SVG for Chef Cinnamon and layered avatars. It is deliberately isolated in asset components so commissioned artwork can replace it. Current synthesized/browser voice audio is also temporary.

## Browser limitations

Speech synthesis varies by installed voices. Speech recognition will be optional because support and microphone permissions differ by browser and managed device. All reading activities must retain a no-microphone path.
