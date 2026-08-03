# Playwright and CI

Install dependencies with `pnpm install --frozen-lockfile`, install Chromium with `pnpm exec playwright install --with-deps chromium`, build with `pnpm run build`, then run `pnpm run test:e2e`. Playwright starts the Vite preview automatically.

`.github/workflows/application-verification.yml` runs TypeScript, ESLint, unit/component tests, the production build, and desktop/mobile Chromium journeys on branch pushes and pull requests. Failure artifacts retain the HTML report, traces, screenshots, and videos for 14 days.
