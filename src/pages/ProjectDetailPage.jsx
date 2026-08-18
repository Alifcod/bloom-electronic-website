import { useEffect } from "react";
import { trackEvent } from "../analytics.js";
import { ArrowLink, BulletList, ContactCta, PageHero, StatusBadge } from "../components.jsx";
import { getService } from "../content.js";
import { Link } from "../router.jsx";

export default function ProjectDetailPage({ project }) {
  useEffect(() => { trackEvent("view_project", { project_category: project.category, page_path: `/projects/${project.slug}` }); }, [project.slug]);
  const breadcrumbs = [{ label: "Home", to: "/" }, { label: "Projects", to: "/projects" }, { label: project.projectTitle, to: `/projects/${project.slug}` }];
  const relatedServices = project.relatedServices.map(getService).filter(Boolean);
  return <main id="main-content" tabIndex="-1"><PageHero eyebrow={`${project.code} / ${project.category}`} title={project.projectTitle} copy={project.summary} breadcrumbs={breadcrumbs} actions={<StatusBadge>{project.status}</StatusBadge>} />
    <section className="section case-study"><div className="container case-study-grid"><aside className="case-facts"><p className="mini-label">Project status</p><StatusBadge>{project.status}</StatusBadge><h2>Technology</h2><div className="tag-row">{project.technology.map((item) => <span key={item}>{item}</span>)}</div><h2>Confidentiality</h2><p>{project.confidentiality}</p></aside><div className="case-content">
      <section><p className="mini-label">Project photography</p><h2>Genuine build evidence</h2><div className="project-evidence-gallery">{project.gallery.map((image) => <figure key={image.src}><img src={image.src} alt={image.alt} loading="lazy" decoding="async" /><figcaption>{image.caption}</figcaption></figure>)}</div></section>
      <section><p className="mini-label">Customer challenge</p><h2>The engineering problem</h2><p>{project.challenge}</p></section>
      <section><p className="mini-label">Engineering constraints</p><h2>What shaped the work</h2><BulletList items={project.constraints} /></section>
      <section><p className="mini-label">Engineering approach</p><h2>How the work was structured</h2><BulletList items={project.approach} /></section>
      <section><p className="mini-label">Bloom’s scope</p><h2>Work represented in this summary</h2><BulletList items={project.scope} /></section>
      <section><p className="mini-label">Deliverables</p><h2>Engineering outputs</h2><BulletList items={project.deliverables} /></section>
      <section className="evidence-callout"><p className="mini-label">Validation performed</p><h2>What the evidence currently supports</h2><p>{project.validation}</p></section>
      <section><p className="mini-label">Current outcome</p><h2>Honest status</h2><p>{project.outcome}</p></section>
      <section><p className="mini-label">Known limitations</p><h2>What is not being claimed</h2><BulletList items={project.limitations} /></section>
      <section><p className="mini-label">Related services</p><h2>Relevant engineering support</h2><div className="related-grid">{relatedServices.map((service) => <article key={service.slug}><h3><Link to={`/services/${service.slug}`}>{service.shortTitle}</Link></h3><p>{service.summary}</p><ArrowLink to={`/services/${service.slug}`}>Service details</ArrowLink></article>)}</div></section>
    </div></div></section><ContactCta title="Discuss a project with similar constraints." copy="Bloom will start with the current evidence and the next engineering decision—not a generic sales script." service={project.relatedServices[0]} />
  </main>;
}
