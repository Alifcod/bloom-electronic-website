import { useEffect } from "react";
import { trackEvent } from "../analytics.js";
import { ArrowLink, BulletList, ContactCta, FaqList, PageHero, StatusBadge } from "../components.jsx";
import { getProject } from "../content.js";
import { Link } from "../router.jsx";

export default function ServiceDetailPage({ service }) {
  useEffect(() => { trackEvent("view_service", { service_category: service.shortTitle, page_path: `/services/${service.slug}` }); }, [service.slug]);
  const breadcrumbs = [{ label: "Home", to: "/" }, { label: "Services", to: "/services" }, { label: service.shortTitle, to: `/services/${service.slug}` }];
  const related = service.relatedProjects.map(getProject).filter(Boolean);
  return <main id="main-content" tabIndex="-1"><PageHero eyebrow="Engineering service" title={service.h1} copy={service.summary} breadcrumbs={breadcrumbs} actions={<><Link className="button button--primary" to={`/contact?service=${service.slug}`} onClick={() => trackEvent("select_service", { service_category: service.shortTitle, cta_location: "service_hero", page_path: `/services/${service.slug}` })}>Discuss this service</Link><Link className="button button--secondary" to="/projects">View project evidence</Link></>} />
    <section className="section detail-section"><div className="container detail-layout"><aside className="detail-nav"><p>On this page</p>{["Problems", "Who it is for", "Scope", "Inputs", "Process", "Evidence", "Risks", "FAQ"].map((item) => <a key={item} href={`#${item.toLowerCase().replaceAll(" ", "-")}`}>{item}</a>)}</aside><div className="detail-content">
      <section id="problems"><p className="mini-label">Customer problems</p><h2>When this service is useful</h2><BulletList items={service.problems} /></section>
      <section id="who-it-is-for"><p className="mini-label">Who it is for</p><h2>Teams that need this support</h2><BulletList items={service.audiences} /></section>
      <section id="scope"><p className="mini-label">Scope and deliverables</p><h2>Possible engineering outputs</h2><BulletList items={service.deliverables} /><p className="scope-note">Deliverables are selected during scoping. This page does not promise a fixed timeline, price or universal outcome.</p></section>
      <section id="inputs"><p className="mini-label">Inputs required</p><h2>What helps the engagement start well</h2><BulletList items={service.inputs} /></section>
      <section id="process"><p className="mini-label">Engagement process</p><h2>How the work is controlled</h2><ol className="numbered-list">{service.process.map((item, index) => <li key={item}><span>{String(index + 1).padStart(2, "0")}</span>{item}</li>)}</ol></section>
      <section id="evidence"><p className="mini-label">Related project evidence</p><h2>Work connected to this capability</h2><div className="related-grid">{related.map((project) => <article key={project.slug}><StatusBadge>{project.status}</StatusBadge><h3><Link to={`/projects/${project.slug}`}>{project.title}</Link></h3><p>{project.summary}</p><ArrowLink to={`/projects/${project.slug}`}>View project</ArrowLink></article>)}</div></section>
      <section id="risks"><p className="mini-label">Risks and limitations</p><h2>Boundaries that should remain explicit</h2><BulletList items={service.risks} /></section>
      <section id="faq"><p className="mini-label">FAQ</p><h2>Questions about this service</h2><FaqList items={service.faqs} /></section>
    </div></div></section><ContactCta service={service.slug} />
  </main>;
}
