import {
  ArrowRight,
  ArrowUpRight,
  BracketsCurly,
  Broadcast,
  CaretDown,
  CaretRight,
  Check,
  Circuitry,
  Crosshair,
  Cpu,
  EnvelopeSimple,
  Factory,
  Gauge,
  Lightning,
  List,
  Memory,
  PaperPlaneTilt,
  Plugs,
  ShieldCheck,
  SpinnerGap,
  UsersThree,
  WarningCircle,
  Wrench,
  X,
} from "@phosphor-icons/react";
import { Link } from "./router.jsx";
import { trackEvent } from "./analytics.js";
import { buildWhatsAppUrl } from "./config.js";

export const icons = {
  ArrowRight,
  ArrowUpRight,
  BracketsCurly,
  Broadcast,
  CaretDown,
  CaretRight,
  Check,
  Circuitry,
  Crosshair,
  Cpu,
  EnvelopeSimple,
  Factory,
  Gauge,
  Lightning,
  List,
  Microchip: Memory,
  PaperPlaneTilt,
  Plugs,
  ShieldCheck,
  SpinnerGap,
  UsersThree,
  WarningCircle,
  Wrench,
  X,
};

export function BrandMark({ compact = false }) {
  return (
    <Link className="brand" to="/" aria-label="Bloom Electronic home">
      <span className="brand-mark" aria-hidden="true"><Crosshair weight="thin" /></span>
      {!compact && <span className="brand-name">BLOOM.ELECTRONIC</span>}
    </Link>
  );
}

export function SectionIntro({ eyebrow, title, copy, align = "left", as = "h2" }) {
  const Heading = as;
  return (
    <div className={`section-intro section-intro--${align}`}>
      <p className="eyebrow"><span />{eyebrow}</p>
      <Heading>{title}</Heading>
      {copy && <p className="section-copy">{copy}</p>}
    </div>
  );
}

export function ArrowLink({ to, children, onClick, ...props }) {
  return (
    <Link className="arrow-link" to={to} onClick={onClick} {...props}>
      <span>{children}</span>
      <ArrowRight weight="bold" aria-hidden="true" />
    </Link>
  );
}

export function Breadcrumbs({ items }) {
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <ol>
        {items.map((item, index) => (
          <li key={item.to}>
            {index < items.length - 1 ? <Link to={item.to}>{item.label}</Link> : <span aria-current="page">{item.label}</span>}
            {index < items.length - 1 && <CaretRight aria-hidden="true" />}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function PageHero({ eyebrow, title, copy, breadcrumbs, actions, compact = false }) {
  return (
    <section className={`page-hero ${compact ? "page-hero--compact" : ""}`}>
      <div className="technical-grid" aria-hidden="true" />
      <div className="container page-hero-inner">
        {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
        <p className="eyebrow"><span />{eyebrow}</p>
        <h1>{title}</h1>
        {copy && <p>{copy}</p>}
        {actions && <div className="hero-actions">{actions}</div>}
      </div>
    </section>
  );
}

export function FaqList({ items }) {
  return (
    <div className="faq-list">
      {items.map(([question, answer]) => (
        <details key={question}>
          <summary>{question}<CaretDown aria-hidden="true" /></summary>
          <p>{answer}</p>
        </details>
      ))}
    </div>
  );
}

export function StatusBadge({ children }) {
  return <span className="status-badge">{children}</span>;
}

export function BulletList({ items, className = "" }) {
  return <ul className={`check-list ${className}`}>{items.map((item) => <li key={item}><Check aria-hidden="true" />{item}</li>)}</ul>;
}

export function ContactCta({ title = "Bring us the engineering problem.", copy = "Share the current project stage, the evidence you have and the outcome you need.", service = "" }) {
  const target = service ? `/contact?service=${encodeURIComponent(service)}` : "/contact";
  const whatsappUrl = buildWhatsAppUrl(service || "project");
  return (
    <section className="section contact-cta">
      <div className="technical-grid" aria-hidden="true" />
      <div className="container contact-cta-inner">
        <div><p className="eyebrow"><span />Start a conversation</p><h2>{title}</h2><p>{copy}</p></div>
        <div className="contact-cta-actions">
          <Link className="button button--primary" to={target}>Discuss your project <ArrowRight weight="bold" /></Link>
          {whatsappUrl && <a className="button button--secondary" href={whatsappUrl} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent("click_whatsapp", { cta_location: "contact_section", page_path: window.location.pathname })}>WhatsApp an engineer</a>}
        </div>
      </div>
    </section>
  );
}
