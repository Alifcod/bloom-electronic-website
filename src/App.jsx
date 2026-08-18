import { lazy, Suspense, useEffect } from "react";
import { getRouteContent, normalizePathname } from "./content.js";
import { SiteLayout } from "./Layout.jsx";
import { useLocation } from "./router.jsx";
import { Seo } from "./seo.jsx";

const HomePage = lazy(() => import("./pages/HomePage.jsx"));
const ServicesPage = lazy(() => import("./pages/ServicesPage.jsx"));
const ServiceDetailPage = lazy(() => import("./pages/ServiceDetailPage.jsx"));
const ProjectsPage = lazy(() => import("./pages/ProjectsPage.jsx"));
const ProjectDetailPage = lazy(() => import("./pages/ProjectDetailPage.jsx"));
const AboutPage = lazy(() => import("./pages/AboutPage.jsx"));
const ContactPage = lazy(() => import("./pages/ContactPage.jsx"));
const PrivacyPage = lazy(() => import("./pages/PrivacyPage.jsx"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage.jsx"));

function getBreadcrumbs(route) {
  if (route.type === "service") return [{ label: "Home", to: "/" }, { label: "Services", to: "/services" }, { label: route.shortTitle, to: route.path }];
  if (route.type === "project") return [{ label: "Home", to: "/" }, { label: "Projects", to: "/projects" }, { label: route.projectTitle, to: route.path }];
  if (route.path !== "/" && route.type !== "404") {
    const label = route.path.slice(1).replaceAll("-", " ").replace(/^./, (letter) => letter.toUpperCase());
    return [{ label: "Home", to: "/" }, { label, to: route.path }];
  }
  return [];
}

function RouteView({ route, search }) {
  if (route.type === "404") return <NotFoundPage />;
  if (route.type === "service") return <ServiceDetailPage service={route} />;
  if (route.type === "project") return <ProjectDetailPage project={route} />;
  switch (route.path) {
    case "/": return <HomePage />;
    case "/services": return <ServicesPage />;
    case "/projects": return <ProjectsPage />;
    case "/about": return <AboutPage />;
    case "/contact": return <ContactPage search={search} />;
    case "/privacy": return <PrivacyPage />;
    default: return <NotFoundPage />;
  }
}

export function App() {
  const location = useLocation();
  const pathname = normalizePathname(location.pathname);
  const route = getRouteContent(pathname);
  const breadcrumbs = getBreadcrumbs(route);

  useEffect(() => {
    if (location.hash) {
      requestAnimationFrame(() => document.querySelector(location.hash)?.scrollIntoView());
      return;
    }
    document.getElementById("main-content")?.focus({ preventScroll: true });
  }, [pathname, location.hash]);

  return (
    <SiteLayout pathname={pathname}>
      <Seo pathname={pathname} breadcrumbs={breadcrumbs} />
      <Suspense fallback={<main id="main-content" className="route-loading" aria-live="polite"><p>Loading page…</p></main>}>
        <RouteView route={route} search={location.search} />
      </Suspense>
    </SiteLayout>
  );
}
