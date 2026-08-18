import { useEffect, useRef, useState } from "react";
import { configureAnalytics, getAnalyticsConsent, loadAnalytics, setAnalyticsConsent, trackEvent } from "./analytics.js";
import { BrandMark, icons } from "./components.jsx";
import { navigation, services } from "./content.js";
import { buildWhatsAppUrl, siteConfig } from "./config.js";
import { Link } from "./router.jsx";

const { ArrowRight, X, List } = icons;

export function Header({ pathname }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButton = useRef(null);
  useEffect(() => { setMenuOpen(false); }, [pathname]);
  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === "Escape" && menuOpen) {
        setMenuOpen(false);
        menuButton.current?.focus();
      }
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);
  const whatsappUrl = buildWhatsAppUrl();
  const active = (to) => to === "/" ? pathname === "/" : pathname.startsWith(to);
  return (
    <header className="site-header">
      <div className="container header-inner">
        <BrandMark />
        <nav className="desktop-nav" aria-label="Primary navigation">
          {navigation.map((item) => <Link className={active(item.to) ? "active" : ""} aria-current={active(item.to) ? "page" : undefined} key={item.to} to={item.to}>{item.label}</Link>)}
        </nav>
        {whatsappUrl && <a className="header-whatsapp" href={whatsappUrl} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent("click_whatsapp", { cta_location: "header", page_path: pathname })}>WhatsApp</a>}
        <Link className="header-cta" to="/contact">Discuss your project <ArrowRight weight="bold" /></Link>
        <button ref={menuButton} type="button" className="menu-toggle" aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-expanded={menuOpen} aria-controls="mobile-navigation" onClick={() => setMenuOpen((value) => !value)}>
          {menuOpen ? <X /> : <List />}
        </button>
      </div>
      <nav id="mobile-navigation" className={`mobile-nav ${menuOpen ? "mobile-nav--open" : ""}`} aria-label="Mobile navigation" aria-hidden={!menuOpen}>
        {navigation.map((item) => <Link className={active(item.to) ? "active" : ""} aria-current={active(item.to) ? "page" : undefined} key={item.to} to={item.to}>{item.label}<ArrowRight /></Link>)}
        {whatsappUrl && <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent("click_whatsapp", { cta_location: "mobile_navigation", page_path: pathname })}>WhatsApp an engineer <ArrowRight /></a>}
        <Link className="mobile-nav-cta" to="/contact">Discuss your project <ArrowRight /></Link>
      </nav>
    </header>
  );
}

export function Footer() {
  const whatsappUrl = buildWhatsAppUrl();
  return (
    <footer className="site-footer">
      <div className="container footer-top">
        <div><BrandMark /><p>PCB, embedded and connected-product engineering for Malaysian businesses.</p></div>
        <div><h2>Navigate</h2>{navigation.map((item) => <Link key={item.to} to={item.to}>{item.label}</Link>)}</div>
        <div><h2>Services</h2>{services.slice(0, 5).map((service) => <Link key={service.slug} to={`/services/${service.slug}`}>{service.shortTitle}</Link>)}</div>
        <div><h2>Contact</h2><a href={`mailto:${siteConfig.primaryEmail}`} onClick={() => trackEvent("click_email", { cta_location: "footer", page_path: window.location.pathname })}>{siteConfig.primaryEmail}</a>{whatsappUrl && <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent("click_whatsapp", { cta_location: "footer", page_path: window.location.pathname })}>{siteConfig.phone} · WhatsApp</a>}{siteConfig.linkedInUrl && <a href={siteConfig.linkedInUrl} target="_blank" rel="noopener noreferrer">Founder on LinkedIn</a>}<p>{siteConfig.serviceArea}</p><Link className="arrow-link" to="/contact">Discuss a project <ArrowRight /></Link></div>
      </div>
      <div className="container footer-bottom"><span>© {new Date().getFullYear()} Bloom Electronic. All rights reserved.</span><div><Link to="/privacy">Privacy</Link><span>Electronics engineering • Malaysia</span></div></div>
    </footer>
  );
}

export function AnalyticsConsent() {
  const [choice, setChoice] = useState(() => getAnalyticsConsent());
  useEffect(() => {
    configureAnalytics(siteConfig.gaMeasurementId);
    if (choice === "granted") loadAnalytics();
  }, [choice]);
  if (!siteConfig.gaMeasurementId || choice !== "unknown") return null;
  const decide = (value) => { setAnalyticsConsent(value); setChoice(value); };
  return (
    <aside className="consent-banner" aria-label="Analytics preferences">
      <p>Bloom can use optional, non-identifying analytics to understand which pages help visitors. Enquiry details are never sent to analytics. <Link to="/privacy">Privacy notice</Link></p>
      <div><button type="button" onClick={() => decide("denied")}>Decline</button><button type="button" onClick={() => decide("granted")}>Allow analytics</button></div>
    </aside>
  );
}

export function SiteLayout({ pathname, children }) {
  return (
    <div className="site-shell">
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <Header pathname={pathname} />
      {children}
      <Footer />
      <AnalyticsConsent />
    </div>
  );
}
