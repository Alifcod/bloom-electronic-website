# Bloom Electronic owner launch checklist

Complete and approve these items before treating the acquisition system as operational.

## Identity and trust

- [ ] Confirm the public name **Bloom Electronic**.
- [ ] Confirm the legal company name.
- [ ] Add the verified SSM registration number if appropriate for public display.
- [ ] Confirm the business telephone and WhatsApp number.
- [ ] Confirm the founder name, professional title, biography and engineering focus.
- [ ] Approve any qualifications or certifications before publishing them.
- [ ] Confirm the LinkedIn profile.
- [ ] Confirm service area, address and business hours where appropriate.
- [ ] Confirm the booking URL.

## Claims and project evidence

- [ ] Review every project status, constraint, deliverable, validation statement and limitation.
- [ ] Confirm no page implies an unverified client, result, metric, certification or production outcome.
- [ ] Upload approved real project photographs and captions.
- [ ] Obtain customer approval before publishing identities, logos, confidential details or testimonials.
- [ ] Do not enable pricing or timeline fields until the values and scope caveats are approved.

## Lead delivery

- [ ] Configure the serverless lead endpoint.
- [ ] Verify the email sending domain.
- [ ] Store the Resend key only as a server-side secret.
- [ ] Restrict CORS to exact approved origins.
- [ ] Configure the KV rate/idempotency binding.
- [ ] Decide whether minimum D1 storage is required and document retention.
- [ ] Test from a separate device on Wi-Fi and mobile data.
- [ ] Confirm the owner notification, subject, source/UTM context and submission ID.
- [ ] Confirm Reply-To uses the customer's email.
- [ ] Test provider failure and timeout behaviour; the browser must not show success.
- [ ] Confirm email and WhatsApp fallbacks.
- [ ] Consider Turnstile only if real spam warrants the added friction.

## Privacy, analytics and search

- [ ] Obtain an owner/legal review of the privacy notice.
- [ ] Name configured processors and approve retention periods.
- [ ] Confirm GA4 loads only after consent and never receives enquiry PII.
- [ ] Verify the Search Console domain property.
- [ ] Submit `https://bloomelectronics.my/sitemap.xml`.
- [ ] Inspect and request indexing for primary pages.
- [ ] Monitor indexing, queries, provider failures and spam after launch.
- [ ] Create a Google Business Profile only if the business meets Google's eligibility rules.

## Final release

- [ ] Run `npm test` on the exact release source.
- [ ] Review the GitHub Actions deployment result.
- [ ] Complete the README manual production-verification checklist.
- [ ] Confirm HTTPS and the custom domain.
- [ ] Record who owns GitHub, DNS, Cloudflare/lead API, Resend, analytics and Search Console access.
- [ ] Begin collecting genuine testimonials only after customer approval.
