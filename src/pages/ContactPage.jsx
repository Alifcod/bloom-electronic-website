import { ContactForm } from "../ContactForm.jsx";
import { icons, PageHero } from "../components.jsx";
import { siteConfig, buildWhatsAppUrl } from "../config.js";
import { trackEvent } from "../analytics.js";

const { ArrowRight, EnvelopeSimple } = icons;

export default function ContactPage({ search = "" }) {
  const initialType = new URLSearchParams(search).get("service") ?? "";
  const breadcrumbs = [{ label: "Home", to: "/" }, { label: "Contact", to: "/contact" }];
  const whatsappUrl = buildWhatsAppUrl();
  return <main id="main-content" tabIndex="-1"><PageHero eyebrow="Project enquiry" title="Discuss an electronics project." copy="Share what you are building, what is not working and the current engineering evidence. Bloom will use that context to assess whether there is a practical fit." breadcrumbs={breadcrumbs} compact />
    <section className="section contact-page"><div className="container contact-page-layout"><aside className="contact-options"><p className="mini-label">Verified contact routes</p><h2>Start with the channel you can use now.</h2><a className="contact-option" href={`mailto:${siteConfig.primaryEmail}`} onClick={() => trackEvent("click_email", { cta_location: "contact_page", page_path: "/contact" })}><EnvelopeSimple aria-hidden="true" /><span><strong>Email</strong>{siteConfig.primaryEmail}</span><ArrowRight /></a>{whatsappUrl && <a className="contact-option" href={whatsappUrl} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent("click_whatsapp", { cta_location: "contact_page", page_path: "/contact" })}><span><strong>WhatsApp</strong>Message an engineer</span><ArrowRight /></a>}<div className="contact-guidance"><h3>Useful information</h3><ul><li>Application and expected behaviour</li><li>Current stage and available files</li><li>Observed failure or engineering constraint</li><li>Target manufacturing or deployment context</li></ul></div></aside><ContactForm initialType={initialType} /></div></section>
  </main>;
}
