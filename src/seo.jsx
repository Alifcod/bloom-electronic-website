import { useEffect } from "react";
import { baseSeo, brand, CANONICAL_ORIGIN, getRouteContent, services } from "./content.js";

function upsertMeta(selector, attributes) {
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement("meta");
    document.head.append(element);
  }
  Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
}

function upsertLink(rel, href) {
  let element = document.head.querySelector(`link[rel="${rel}"]`);
  if (!element) {
    element = document.createElement("link");
    element.rel = rel;
    document.head.append(element);
  }
  element.href = href;
}

export function buildOrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: brand.publicName,
    url: CANONICAL_ORIGIN,
    email: brand.primaryEmail,
    areaServed: { "@type": "Country", name: brand.serviceArea },
    knowsAbout: ["PCB design", "Embedded systems", "IoT controllers", "Prototype troubleshooting", "Electronics manufacturing support"],
    makesOffer: services.map((service) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: service.shortTitle, url: `${CANONICAL_ORIGIN}/services/${service.slug}` } })),
  };
  if (brand.phone) schema.telephone = brand.phone;
  if (brand.linkedInUrl) schema.sameAs = [brand.linkedInUrl];
  if (brand.founder.name) schema.founder = { "@type": "Person", name: brand.founder.name, jobTitle: brand.founder.title };
  return schema;
}

export function buildBreadcrumbSchema(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({ "@type": "ListItem", position: index + 1, name: item.label, item: `${CANONICAL_ORIGIN}${item.to}` })),
  };
}

export function buildRouteSchemas(route, breadcrumbs = []) {
  const schemas = [buildOrganizationSchema()];
  if (route.type === "service") {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "Service",
      name: route.h1,
      description: route.description,
      url: `${CANONICAL_ORIGIN}${route.path}`,
      areaServed: { "@type": "Country", name: brand.serviceArea },
      provider: { "@type": "Organization", name: brand.publicName, url: CANONICAL_ORIGIN },
    });
  }
  if (breadcrumbs.length) schemas.push(buildBreadcrumbSchema(breadcrumbs));
  return schemas;
}

export function Seo({ pathname, breadcrumbs = [] }) {
  const breadcrumbKey = JSON.stringify(breadcrumbs);
  useEffect(() => {
    const route = getRouteContent(pathname);
    const canonical = `${CANONICAL_ORIGIN}${route.path === "/" ? "" : route.path}`;
    const image = `${CANONICAL_ORIGIN}${baseSeo.image}`;
    document.title = route.title;
    upsertMeta('meta[name="description"]', { name: "description", content: route.description });
    upsertMeta('meta[name="robots"]', { name: "robots", content: route.noindex ? "noindex, nofollow" : "index, follow" });
    upsertMeta('meta[property="og:title"]', { property: "og:title", content: route.title });
    upsertMeta('meta[property="og:description"]', { property: "og:description", content: route.description });
    upsertMeta('meta[property="og:url"]', { property: "og:url", content: canonical });
    upsertMeta('meta[property="og:type"]', { property: "og:type", content: "website" });
    upsertMeta('meta[property="og:image"]', { property: "og:image", content: image });
    upsertMeta('meta[name="twitter:card"]', { name: "twitter:card", content: "summary_large_image" });
    upsertMeta('meta[name="twitter:title"]', { name: "twitter:title", content: route.title });
    upsertMeta('meta[name="twitter:description"]', { name: "twitter:description", content: route.description });
    upsertMeta('meta[name="twitter:image"]', { name: "twitter:image", content: image });
    upsertLink("canonical", canonical);
    let schemaScript = document.head.querySelector('script[data-bloom-schema="route"]');
    if (!schemaScript) {
      schemaScript = document.createElement("script");
      schemaScript.type = "application/ld+json";
      schemaScript.dataset.bloomSchema = "route";
      document.head.append(schemaScript);
    }
    schemaScript.textContent = JSON.stringify(buildRouteSchemas(route, breadcrumbs));
  }, [pathname, breadcrumbKey]);
  return null;
}
