# Bloom Electronic website

Production-oriented React/Vite website for Bloom Electronic, a founder-led electronics engineering business serving Malaysia and potential international customers. The site uses clean, statically generated service and project routes, honest project statuses, conditional contact options, route-specific SEO, consent-gated analytics, and a fail-closed enquiry workflow.

The public brand is **Bloom Electronic** and the canonical domain is `https://bloomelectronics.my`.

## Architecture

- React 19 and Vite 6 for the frontend.
- A lightweight History API router; no hash-router URLs.
- Central service, project, offer, company and SEO content in `src/content.js`.
- Route-level lazy loading in `src/App.jsx`.
- Static HTML generation for every public route in `scripts/generate-static-pages.mjs`.
- GitHub Pages output in `dist/client`, including `CNAME`, `404.html`, `sitemap.xml` and `robots.txt`.
- Optional Cloudflare Worker lead API scaffold in `lead-api/worker.js`.
- Resend-compatible notification email delivery, with optional KV idempotency/rate controls and optional D1 storage.
- OpenAI Sites runtime files remain supported.

The form is intentionally unavailable when `VITE_LEAD_API_URL` is empty. Visitors are shown the verified email route instead. A success screen is rendered only after the server returns `{ "ok": true, "submissionId": "the-matching-id" }`.

## Local development

Requirements: Node.js 22 and npm.

```bash
npm ci
npm run dev
```

Vite normally serves the site at `http://localhost:5173`. Copy `.env.example` to `.env.local` only when local public configuration is required. `.env.local` is ignored by Git.

## Build, preview and tests

```bash
npm run build
npm run preview
npm run test:unit
npm run test:seo
npm test
```

- `npm run build` creates the Vite bundle, all clean static route directories, SEO files, and Sites packaging.
- `npm run preview` serves the production build locally.
- `npm run test:unit` runs form, analytics, lead API and Sites runtime tests without sending real email.
- `npm run test:seo` builds and verifies every route, H1, metadata, canonical, JSON-LD, sitemap, robots, CNAME and 404.
- `npm test` runs the production build and complete test suite.

No automated test calls the live email provider.

## Public environment variables

These values are compiled into browser-visible code. They must never contain secrets.

| Variable | Purpose | Empty behaviour |
| --- | --- | --- |
| `VITE_LEAD_API_URL` | HTTPS endpoint for the lead Worker | Form is hidden; email fallback remains |
| `VITE_WHATSAPP_NUMBER` | International digits only, for example `60123456789` | WhatsApp CTAs are hidden |
| `VITE_BOOKING_URL` | Verified booking page | Booking CTA is hidden |
| `VITE_GA_MEASUREMENT_ID` | GA4 measurement ID | Analytics and consent banner are disabled |
| `VITE_GOOGLE_SITE_VERIFICATION` | Search Console HTML meta value | Verification meta is omitted |
| `VITE_TURNSTILE_SITE_KEY` | Optional public Cloudflare Turnstile site key | No CAPTCHA script or widget is loaded |
| `VITE_SHOW_PRICING` | Enables configured `startingPrice` fields | Pricing stays hidden |
| `VITE_SHOW_TIMELINES` | Enables configured `typicalTimeline` fields | Timelines stay hidden |
| `VITE_SHOW_CASE_STUDIES` | Case-study feature flag for future gating | Defaults to enabled when unset |

For GitHub Pages, add the public values under **Repository settings → Secrets and variables → Actions → Variables**. The deployment workflow maps them into the build. Do not put Resend, Turnstile, database or SMTP credentials in GitHub Pages variables prefixed with `VITE_`.

## Company and content configuration

Edit `src/content.js` to update:

- Public/legal company identity and verified optional details.
- Founder profile, certifications and LinkedIn URL.
- Service area, telephone, address and business hours.
- Productised offers, service landing pages and project evidence.
- Public route titles, descriptions and canonical content.

Unconfigured identity and trust fields use empty strings and are hidden. Do not publish a registration number, qualification, address, claim, client name, metric or outcome until verified.

### Add a service

1. Add one object to `services` in `src/content.js` with a unique slug, H1, title, description, problems, audiences, deliverables, inputs, process, risks, FAQs and related-project slugs.
2. Link the service from an offer or navigation area if needed.
3. Run `npm run test:seo`. The route `/services/{slug}` is generated automatically.
4. Review the resulting title, description, H1, structured data and internal links.

### Add a case study

1. Add one object to `projects` in `src/content.js` using a truthful status such as `Prototype`, `Under Validation` or `Revised`.
2. Record actual constraints, Bloom's scope, deliverables, validation evidence, current outcome and limitations.
3. Add related service slugs.
4. Run `npm run test:seo`. The route `/projects/{slug}` is generated automatically.

Never call a design validated, production-ready, successful or completed without source evidence.

### Future technical articles

`src/articles.js` provides a deliberately empty article collection and reusable content shape. Add only substantive material based on real engineering experience. Service and project content remains the priority over shallow search pages.

## Project images

Real, owner-approved photography is preferred. Do not use stock PCB photography or generated hardware as evidence of Bloom's work.

Recommended master format:

- 1600 × 1000 px (8:5), sRGB.
- WebP at approximately 75–85 quality, usually below 250 KB.
- Filename: `{project-slug}-01.webp`, `{project-slug}-02.webp`.
- Caption should state what is actually visible and the development stage.
- Alt text should describe useful visual content; decorative images should use empty alt text or `aria-hidden`.

Project pages intentionally omit the image block until approved photographs are supplied.

## Lead API setup

The static frontend cannot safely hold email credentials. `lead-api/worker.js` is a deployable Cloudflare Worker scaffold; the frontend remains on GitHub Pages.

### 1. Create the Worker

1. Create a Cloudflare account and install Wrangler in a trusted local environment.
2. Copy `lead-api/wrangler.toml.example` to `lead-api/wrangler.toml` and fill only account binding identifiers.
3. Create a KV namespace and bind it as `LEAD_GUARD`. This enables hourly rate controls and seven-day submission idempotency.
4. Optional: create a D1 database, apply `lead-api/schema.sql`, and bind it as `LEADS_DB`.
5. Do not create a public read endpoint or unsecured admin page.

### 2. Configure email delivery

The scaffold uses Resend's server-side email API.

1. Create and verify a sending domain in Resend. A recommended sender is `enquiries@send.bloomelectronics.my`.
2. Set `LEAD_FROM_EMAIL` to the verified sender.
3. Set `LEAD_DESTINATION_EMAIL=alif.f@bloomelectronics.my`.
4. Store the API key as a Worker secret:

   ```bash
   wrangler secret put RESEND_API_KEY
   ```

5. Keep `SEND_CUSTOMER_ACKNOWLEDGEMENT=false` initially. Enable it only after the sending domain and wording have been reviewed.

### 3. Configure Worker security

Server-only variables:

| Variable/binding | Purpose |
| --- | --- |
| `ALLOWED_ORIGINS` | Comma-separated exact origins; production should include `https://bloomelectronics.my` |
| `RESEND_API_KEY` | Secret Resend credential |
| `LEAD_FROM_EMAIL` | Verified sender identity |
| `LEAD_DESTINATION_EMAIL` | Notification destination |
| `LEAD_GUARD` | Optional but strongly recommended KV binding |
| `LEADS_DB` | Optional D1 binding for minimum lead storage |
| `MIN_SUBMIT_MS` | Minimum form-completion time; default 2500 ms |
| `RATE_LIMIT_PER_HOUR` | Per-connection limit; default 6 |
| `TURNSTILE_SECRET_KEY` | Optional Turnstile secret if CAPTCHA is later added to the frontend |
| `SEND_CUSTOMER_ACKNOWLEDGEMENT` | Optional acknowledgement toggle |
| `REQUIRE_ACKNOWLEDGEMENT` | If true, acknowledgement failure makes the whole request fail; leave false normally |

The Worker limits requests to 16 KB, validates and trims fields, escapes email HTML, checks origin, honeypot and minimum submission time, supports rate limiting and idempotency, and logs only the submission identifier plus provider error reason—not full lead data.

### 4. Connect the frontend

1. Deploy the Worker over HTTPS.
2. Test it against a non-production destination first.
3. Set the GitHub Actions variable `VITE_LEAD_API_URL` to the Worker URL.
4. Rebuild and deploy the website.
5. Submit a real controlled test from another device and confirm notification delivery, subject, reply-to and failure behaviour.

The email subject is `[New Bloom Enquiry] {Project Type} — {Name or Company}`. Source page, referrer, UTM values and submission ID are included. A phone value is rendered as a direct WhatsApp link in the notification when possible.

### Form troubleshooting

- **Form says setup is in progress:** `VITE_LEAD_API_URL` was empty at build time.
- **Origin not allowed:** add the exact website origin to `ALLOWED_ORIGINS`; do not use `*`.
- **502 delivery response:** verify the Resend API key, sender domain, destination and provider logs.
- **429 response:** confirm the visitor did not submit too quickly or exceed the configured hourly limit.
- **Browser shows an error but an email arrived:** inspect KV and optional storage errors. The current scaffold acknowledges delivery after provider success even if optional storage fails.
- **No analytics events:** GA4 must be configured and the visitor must grant consent.

## WhatsApp and booking

Set `VITE_WHATSAPP_NUMBER` with the verified number in international digits only. The site builds `wa.me` URLs with a project-stage prompt and exposes WhatsApp in the header, hero, mobile navigation, service/project contact sections and contact page.

Set `VITE_BOOKING_URL` only to a verified scheduling page. External booking links open in a new tab with `noopener noreferrer` and emit a safe analytics event after consent.

## Analytics and privacy

GA4 loads only when `VITE_GA_MEASUREMENT_ID` is configured and a visitor grants consent. Events are allow-listed and metadata is stripped to safe fields. Names, email, phone and project descriptions are never passed to analytics.

The privacy notice is an operational draft and is visibly marked for owner/legal review. Complete provider names, retention rules and applicable business/legal wording before enabling production lead collection.

## Search Console

1. Add a **Domain property** for `bloomelectronics.my` in Google Search Console.
2. Complete DNS verification at the authoritative DNS provider.
3. Optionally set `VITE_GOOGLE_SITE_VERIFICATION` if an HTML meta verification method is required.
4. Submit `https://bloomelectronics.my/sitemap.xml`.
5. Inspect and request indexing for `/`, `/services`, the primary service pages, `/projects` and approved project pages.
6. Monitor coverage, queries and enhancement warnings. Do not generate shallow pages simply to increase route count.

## GitHub Pages deployment

The workflow `.github/workflows/deploy-pages.yml` runs on `main`, executes the lead/unit tests, builds all routes, verifies SEO/Sites packaging and publishes `dist/client`.

Repository configuration:

1. In **Settings → Pages**, select **GitHub Actions** as the source.
2. Keep `public/CNAME` set to `bloomelectronics.my`.
3. Keep the existing DNS records that point the custom domain to GitHub Pages.
4. Add required public Actions variables.
5. Push to `main` only after local tests and owner approval.
6. Confirm GitHub Pages shows the custom domain and enforced HTTPS after deployment.

This repository also preserves `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs` and related tests for an optional OpenAI Sites handoff.

## Manual production verification

After an authorised deployment:

- Open every route directly in a private browser window; confirm no GitHub 404 page appears.
- Test widths 320, 375, 390, 768, 1024 and 1440 px.
- Confirm one visible H1 per page, keyboard focus, mobile-menu Escape behaviour and no horizontal scroll.
- Check `/sitemap.xml`, `/robots.txt`, `/404.html`, favicon and manifest.
- View source on service/project pages and confirm route-specific title, description, canonical, social metadata and JSON-LD.
- Verify the contact form is hidden until a tested endpoint is configured.
- Test successful, failed and slow lead delivery; confirm form data survives failures.
- Confirm notification destination, subject, reply-to, UTM context and submission ID.
- Confirm WhatsApp and booking links use verified values.
- Confirm analytics stays unloaded before consent and never receives lead PII.
- Review browser console, network failures and provider logs.
- Review the privacy notice and all public claims.

See `docs/owner-launch-checklist.md` for content, account and ownership tasks that cannot be completed safely in code.
