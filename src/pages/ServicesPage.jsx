import { trackEvent } from "../analytics.js";
import { ArrowLink, BulletList, ContactCta, PageHero } from "../components.jsx";
import { offers, services } from "../content.js";
import { siteConfig } from "../config.js";
import { Link } from "../router.jsx";

export default function ServicesPage() {
  const breadcrumbs = [{ label: "Home", to: "/" }, { label: "Services", to: "/services" }];
  return <main id="main-content" tabIndex="-1"><PageHero eyebrow="Engineering services" title="Electronics engineering support matched to the project stage." copy="Choose a focused review, a coordinated hardware-and-firmware prototype, troubleshooting support or manufacturing handoff work." breadcrumbs={breadcrumbs} actions={<Link className="button button--primary" to="/contact">Discuss your project</Link>} />
    <section className="section"><div className="container"><div className="service-index-grid">{services.map((service, index) => <article key={service.slug}><span>{String(index + 1).padStart(2, "0")}</span><h2><Link to={`/services/${service.slug}`}>{service.shortTitle}</Link></h2><p>{service.summary}</p><h3>Typical scope</h3><BulletList items={service.deliverables.slice(0, 4)} /><ArrowLink to={`/services/${service.slug}`} onClick={() => trackEvent("select_service", { service_category: service.shortTitle, cta_location: "service_index", page_path: "/services" })}>View service details</ArrowLink></article>)}</div></div></section>
    <section className="section offers-section"><div className="container"><div className="section-heading-row"><div className="section-intro"><p className="eyebrow"><span />Starting structures</p><h2>Productised ways to begin.</h2><p className="section-copy">These are scope frameworks, not fixed-price promises.</p></div></div><div className="offer-grid">{offers.map((offer) => <article className="offer-card" key={offer.slug}><div className="offer-number">{offer.number}</div><h2>{offer.title}</h2><p><strong>For:</strong> {offer.forWho}</p><p>{offer.problem}</p><BulletList items={offer.deliverables} /><p className="engagement-note">{offer.structure}</p>{siteConfig.showPricing && offer.startingPrice && <p><strong>Starting from:</strong> {offer.startingPrice}</p>}{siteConfig.showTimelines && offer.typicalTimeline && <p><strong>Typical timeline:</strong> {offer.typicalTimeline}</p>}<Link className="arrow-link" to={`/contact?service=${offer.slug}`}>Discuss this engagement</Link></article>)}</div></div></section>
    <ContactCta />
  </main>;
}
