import { ArrowLink, ContactCta, PageHero, StatusBadge } from "../components.jsx";
import { projects } from "../content.js";
import { Link } from "../router.jsx";

export default function ProjectsPage() {
  const breadcrumbs = [{ label: "Home", to: "/" }, { label: "Projects", to: "/projects" }];
  return <main id="main-content" tabIndex="-1"><PageHero eyebrow="Engineering evidence" title="Engineering projects described without inflated claims." copy="Each summary separates the challenge, engineering work, current status, validation evidence and remaining limitations." breadcrumbs={breadcrumbs} />
    <section className="section"><div className="container"><div className="project-index-list">{projects.map((project) => <article key={project.slug}><div className="project-index-meta"><span>{project.code}</span><StatusBadge>{project.status}</StatusBadge></div><Link className="project-index-image" to={`/projects/${project.slug}`} aria-label={`View ${project.title}`}><img src={project.image} alt={project.imageAlt} loading="lazy" decoding="async" /></Link><div><p className="mini-label">{project.category}</p><h2><Link to={`/projects/${project.slug}`}>{project.title}</Link></h2><p>{project.summary}</p><div className="tag-row">{project.technology.map((item) => <span key={item}>{item}</span>)}</div><ArrowLink to={`/projects/${project.slug}`}>Read project summary</ArrowLink></div></article>)}</div><aside className="project-photo-note"><h2>Genuine engineering evidence</h2><p>Every photograph on this page comes from Bloom’s supplied project portfolio. The captions and status labels stay within what the available hardware evidence supports.</p></aside></div></section><ContactCta title="Have a similar engineering problem?" copy="Share the current status, available evidence and the next technical decision required." />
  </main>;
}
