import { trackEvent } from "../analytics.js";
import { ArrowLink, BulletList, ContactCta, FaqList, icons, SectionIntro, StatusBadge } from "../components.jsx";
import { audiences, brand, homeFaqs, offers, processSteps, projects, services, trustPoints } from "../content.js";
import { buildWhatsAppUrl, siteConfig } from "../config.js";
import { Link } from "../router.jsx";

const { ArrowRight, BracketsCurly, Broadcast, Circuitry, Cpu, Gauge, Lightning, ShieldCheck, UsersThree, Wrench } = icons;

const problemCards = [
  ["A prototype does not work", "Turn symptoms, design files and measurements into a prioritised investigation and revision plan.", Wrench],
  ["A custom controller is still an idea", "Define the architecture, hardware, firmware and prototype outputs needed to make it testable.", Circuitry],
  ["Hardware and firmware are disconnected", "Coordinate interfaces and operating behaviour across the complete embedded system.", Cpu],
  ["Manufacturing files are not ready", "Prepare a clearer BOM, PCB output package, assembly information and bring-up plan.", Gauge],
];

export default function HomePage() {
  const whatsappUrl = buildWhatsAppUrl();
  return (
    <main id="main-content" tabIndex="-1">
      <section className="hero home-hero">
        <div className="hero-photo" aria-hidden="true" />
        <div className="hero-shade" aria-hidden="true" />
        <div className="technical-grid" aria-hidden="true" />
        <div className="container hero-inner">
          <p className="hero-kicker"><span /> Electronics engineering <b>•</b> Malaysia</p>
          <h1>PCB &amp; Embedded Product Development <em>for Malaysian Businesses</em></h1>
          <p className="hero-copy">Bloom Electronic helps product teams, machine builders and technology companies design, troubleshoot and prepare custom electronic systems for prototype manufacturing.</p>
          <div className="hero-actions">
            <Link className="button button--primary" to="/contact">Discuss your project <ArrowRight weight="bold" /></Link>
            {whatsappUrl ? <a className="button button--secondary" href={whatsappUrl} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent("click_whatsapp", { cta_location: "hero", page_path: "/" })}>WhatsApp an engineer</a> : <Link className="button button--secondary" to="/services">Explore engineering services</Link>}
            {siteConfig.bookingUrl && <a className="button button--quiet" href={siteConfig.bookingUrl} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent("click_booking", { cta_location: "hero", page_path: "/" })}>Book a 15-minute fit call</a>}
          </div>
          <p className="hero-brand-line">Engineering ideas into reliable electronics.</p>
        </div>
      </section>

      <section className="trust-strip" aria-label="Capability summary"><div className="container trust-grid">{trustPoints.map((item) => <div key={item}><ShieldCheck aria-hidden="true" /><span>{item}</span></div>)}</div></section>

      <section className="section problems-section"><div className="container">
        <SectionIntro eyebrow="Start with the problem" title={<>Engineering support for the point where the project is <em>stuck.</em></>} copy="Bloom can enter at concept, review, prototype or manufacturing-handoff stage. The first objective is to establish the evidence, constraints and next useful engineering decision." />
        <div className="problem-grid">{problemCards.map(([title, copy, Icon]) => <article key={title}><Icon aria-hidden="true" /><h2>{title}</h2><p>{copy}</p></article>)}</div>
      </div></section>

      <section className="section offers-section"><div className="container">
        <div className="section-heading-row"><SectionIntro eyebrow="Productised engineering offers" title={<>A clearer way to <em>start the work.</em></>} copy="Each offer has a defined customer problem and a practical starting structure. Final scope follows the available evidence and technical risk." /><ArrowLink to="/services">View all services</ArrowLink></div>
        <div className="offer-grid">{offers.map((offer) => <article className="offer-card" key={offer.slug}><div className="offer-number">{offer.number}</div><h2>{offer.title}</h2><p className="offer-for"><strong>For:</strong> {offer.forWho}</p><p>{offer.problem}</p><h3>Possible deliverables</h3><BulletList items={offer.deliverables} /><p className="engagement-note"><strong>Engagement:</strong> {offer.structure}</p>{siteConfig.showPricing && offer.startingPrice && <p><strong>Starting from:</strong> {offer.startingPrice}</p>}{siteConfig.showTimelines && offer.typicalTimeline && <p><strong>Typical timeline:</strong> {offer.typicalTimeline}</p>}<Link className="arrow-link" to={`/contact?service=${offer.slug}`} onClick={() => trackEvent("select_service", { service_category: offer.title, cta_location: "offer_card", page_path: "/" })}>Discuss this need <ArrowRight /></Link></article>)}</div>
      </div></section>

      <section className="section audiences-section"><div className="container audiences-layout">
        <SectionIntro eyebrow="Who Bloom supports" title={<>Engineering depth for teams that need an <em>external partner.</em></>} copy="The engagement is suited to organisations with a real electronics problem, decision or prototype—not visitors looking for unsupported product claims." />
        <div className="audience-grid">{audiences.map((item, index) => <div key={item}><span>{String(index + 1).padStart(2, "0")}</span><p>{item}</p></div>)}</div>
      </div></section>

      <section className="section services-preview"><div className="container">
        <div className="section-heading-row"><SectionIntro eyebrow="Core services" title={<>Hardware, firmware and handoff kept <em>technically aligned.</em></>} /><ArrowLink to="/services">Explore services</ArrowLink></div>
        <div className="service-card-grid">{services.map((service, index) => <article key={service.slug}><span>{String(index + 1).padStart(2, "0")}</span><h2><Link to={`/services/${service.slug}`}>{service.shortTitle}</Link></h2><p>{service.summary}</p><ArrowLink to={`/services/${service.slug}`}>Service details</ArrowLink></article>)}</div>
      </div></section>

      {siteConfig.showCaseStudies && <section className="section featured-projects"><div className="container">
        <div className="section-heading-row"><SectionIntro eyebrow="Engineering evidence" title={<>Technical work described with <em>honest status.</em></>} copy="These summaries identify the engineering direction and remaining limitations without presenting unverified commercial outcomes." /><ArrowLink to="/projects">View all projects</ArrowLink></div>
        <div className="project-preview-grid">{projects.slice(0, 4).map((project) => <article key={project.slug}><div><span>{project.code}</span><StatusBadge>{project.status}</StatusBadge></div><Link className="project-preview-image" to={`/projects/${project.slug}`} aria-label={`View ${project.title}`}><img src={project.image} alt={project.imageAlt} loading="lazy" decoding="async" /></Link><p className="mini-label">{project.category}</p><h2><Link to={`/projects/${project.slug}`}>{project.title}</Link></h2><p>{project.summary}</p><div className="tag-row">{project.technology.map((item) => <span key={item}>{item}</span>)}</div><ArrowLink to={`/projects/${project.slug}`}>Read the technical summary</ArrowLink></article>)}</div>
      </div></section>}

      <section className="section process-section"><div className="container"><SectionIntro eyebrow="Engineering process" title={<>A controlled path from question to <em>evidence.</em></>} copy="The exact work changes by project, but the decision flow remains explicit." align="center" /><div className="process-line">{processSteps.map(([number, title, copy]) => <article key={number}><span className="process-node"><i>{number}</i></span><div><h2>{title}</h2><p>{copy}</p></div></article>)}</div></div></section>

      <section className="section why-section"><div className="container why-layout">
        <div className="why-graphic" aria-hidden="true"><Circuitry weight="thin" /><span>HARDWARE</span><b>+</b><span>FIRMWARE</span><b>+</b><span>HANDOFF</span></div>
        <div><SectionIntro eyebrow="Why Bloom" title={<>Engineering that remains <em>grounded in the product.</em></>} /><BulletList items={["One technical context across circuitry, firmware and manufacturing outputs", "Documented limitations instead of inflated readiness claims", "Direct discussion with the engineer responsible for the work", "Engagements shaped around current evidence and the next decision"]} /></div>
      </div></section>

      <section className="section founder-section"><div className="container founder-layout">
        <div><p className="eyebrow"><span />Founder-led engineering</p><h2>Direct communication with the engineer doing the technical work.</h2></div>
        <div><UsersThree aria-hidden="true" /><p><strong>{brand.founder.name}</strong> is Bloom Electronic’s founder and {brand.founder.title.toLowerCase()}. Customers communicate directly with the engineer responsible for the technical work—from PCB decisions through prototype build support.</p><div className="founder-links"><a className="arrow-link" href={brand.linkedInUrl} target="_blank" rel="noopener noreferrer">View LinkedIn <ArrowRight /></a><Link className="arrow-link" to="/about">How Bloom works <ArrowRight /></Link></div></div>
      </div></section>

      <section className="section faq-section"><div className="container faq-layout"><SectionIntro eyebrow="Frequently asked questions" title={<>Useful answers before an <em>initial discussion.</em></>} /><FaqList items={homeFaqs} /></div></section>
      <ContactCta title="Tell Bloom what is not working—or what needs to exist." copy="Describe the application, current project stage and the next engineering decision you need to make." />
    </main>
  );
}
