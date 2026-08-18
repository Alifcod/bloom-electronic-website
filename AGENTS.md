# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.

## Bloom Electronic design direction

- Treat the supplied Hostinger Horizons screenshot as the approved visual source.
- Preserve the premium dark navy/near-black palette, cyan engineering accent, square geometry, technical grid, restrained motion, and generous desktop spacing.
- Keep the company positioned as a Malaysia-based engineering partner rather than a freelancer portfolio.
- Do not invent clients, awards, certifications, test results, team members, or performance statistics.
- Use `alif.f@bloomelectronics.my` as the canonical public contact email.
- Use the cyan square crosshair/circuit mark as the favicon and browser-facing site icon.
