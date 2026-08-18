import { PageHero } from "../components.jsx";
import { siteConfig } from "../config.js";

export default function PrivacyPage() {
  const breadcrumbs = [{ label: "Home", to: "/" }, { label: "Privacy", to: "/privacy" }];
  return <main id="main-content" tabIndex="-1"><PageHero eyebrow="Website information" title="Privacy Notice" copy="How Bloom Electronic handles contact information, project enquiries and optional website analytics." breadcrumbs={breadcrumbs} compact />
    <section className="section legal-page"><div className="container legal-layout"><aside><p><strong>Owner/legal review required:</strong> This operational draft must be reviewed for suitability under the laws and business practices that apply to Bloom Electronic before production use.</p></aside><article>
      <h2>Information provided through enquiries</h2><p>Bloom Electronic receives the details you choose to provide through the enquiry form, including contact information, company, project stage, project description and contact preference. Do not submit passwords, private keys or unnecessary personal information.</p>
      <h2>Purpose of processing</h2><p>Enquiry information is used to assess the request, communicate about a possible engineering engagement, maintain project context and protect the service from abuse. It is not sent to website analytics.</p>
      <h2>Lead delivery and storage</h2><p>The enquiry is processed by a Cloudflare Worker and delivered to Bloom Electronic by email through Resend. The website does not promise persistent database storage of enquiry submissions. Email retention follows the mailbox and service settings controlled by Bloom Electronic and its providers.</p>
      <h2>Optional analytics</h2><p>Google Analytics 4 can be enabled only when a measurement ID is configured and a visitor grants consent. Events are limited to safe page and CTA metadata. Names, email addresses, phone numbers and project descriptions are not sent to analytics.</p>
      <h2>Cookies and local storage</h2><p>The website may store an analytics-consent choice and first-touch campaign attribution in the browser. No invasive fingerprinting is implemented. If spam protection is configured, Cloudflare Turnstile is loaded on the enquiry form and its processing must be reflected in the owner-approved final notice.</p>
      <h2>Project confidentiality</h2><p>Public case summaries intentionally omit customer identities and sensitive specifications. A website form should not be treated as a substitute for an agreed confidential project channel.</p>
      <h2>Contact</h2><p>Questions about this notice can be sent to <a href={`mailto:${siteConfig.primaryEmail}`}>{siteConfig.primaryEmail}</a>.</p>
    </article></div></section>
  </main>;
}
