# run

Launch the Hunarkar dev server and confirm the UI is working.

## Steps

1. Run `npm run dev` in the project root. This starts Next.js 16 with Turbopack on `http://localhost:3000`.
2. Wait for the "Ready" message in the terminal output before opening a browser.
3. Open `http://localhost:3000` to view the homepage.
4. Confirm the hero slideshow, header, and at least one editorial section are visible and animations are working.

## Notes

- The dev command is `npm run dev` (defined in `package.json`). Do NOT use `next dev` directly.
- Turbopack is the default bundler for this project (Next.js 16 default).
- MongoDB must be running or the `MONGODB_URI` env var must point to Atlas for product data to load. If products are missing, run `GET /api/products` with the seed flag to populate.
- Port is always 3000 unless changed in `next.config.*`.
- The app has no `next.config.js` custom port override, so 3000 is safe to assume.
