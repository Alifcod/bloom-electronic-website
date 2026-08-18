#!/usr/bin/env node
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { baseSeo, brand, CANONICAL_ORIGIN, getRouteContent, navigation, publicRoutes, services } from "../src/content.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const output = path.join(root, "dist", "client");
const indexPath = path.join(output, "index.html");

if (!existsSync(indexPath)) throw new Error("Run Vite before generating static pages.");

const template = readFileSync(indexPath, "utf8");
const escapeHtml = (value = "") => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
const canonicalFor = (routePath) => `${CANONICAL_ORIGIN}${routePath === "/" ? "" : routePath}`;

function replaceTitle(html, title) {
  return html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(title)}</title>`);
}

function upsertMeta(html, key, value, content) {
  const pattern = new RegExp(`<meta\\s+${key}=["']${value}["'][^>]*>`, "i");
  const element = `<meta ${key}="${escapeHtml(value)}" content="${escapeHtml(content)}" />`;
  return pattern.test(html) ? html.replace(pattern, element) : html.replace("</head>", `    ${element}\n  </head>`);
}

function upsertCanonical(html, href) {
  const element = `<link rel="canonical" href="${escapeHtml(href)}" />`;
  return /<link\s+rel=["']canonical["'][^>]*>/i.test(html)
    ? html.replace(/<link\s+rel=["']canonical["'][^>]*>/i, element)
    : html.replace("</head>", `    ${element}\n  </head>`);
}

function breadcrumbsFor(route) {
  if (route.type === "service") return [{ label: "Home", to: "/" }, { label: "Services", to: "/services" }, { label: route.shortTitle, to: route.path }];
  if (route.type === "project") return [{ label: "Home", to: "/" }, { label: "Projects", to: "/projects" }, { label: route.title, to: route.path }];
  if (route.path !== "/") return [{ label: "Home", to: "/" }, { label: route.h1, to: route.path }];
  return [];
}

function schemasFor(route) {
  const schemas = [{
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: brand.publicName,
    url: CANONICAL_ORIGIN,
    email: brand.primaryEmail,
    areaServed: { "@type": "Country", name: brand.serviceArea },
    knowsAbout: ["PCB design", "Embedded systems", "IoT controllers", "Prototype troubleshooting", "Electronics manufacturing support"],
    makesOffer: services.map((service) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: service.shortTitle, url: canonicalFor(`/services/${service.slug}`) } })),
  }];
  if (route.type === "service") schemas.push({
    "@context": "https://schema.org", "@type": "Service", name: route.h1, description: route.description,
    url: canonicalFor(route.path), areaServed: { "@type": "Country", name: brand.serviceArea },
    provider: { "@type": "Organization", name: brand.publicName, url: CANONICAL_ORIGIN },
  });
  const breadcrumbs = breadcrumbsFor(route);
  if (breadcrumbs.length) schemas.push({
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((item, index) => ({ "@type": "ListItem", position: index + 1, name: item.label, item: canonicalFor(item.to) })),
  });
  return schemas;
}

function fallbackBody(route) {
  const evidence = route.type === "service"
    ? `<h2>Possible engineering outputs</h2><ul>${route.deliverables.slice(0, 5).map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`
    : route.type === "project"
      ? `<p>${escapeHtml(route.summary)}</p><p><strong>Status:</strong> ${escapeHtml(route.status)}</p>`
      : `<p>${escapeHtml(route.description)}</p>`;
  const links = navigation.map((item) => `<a href="${item.to}">${escapeHtml(item.label)}</a>`).join(" ");
  return `<div id="root" data-prerendered="true"><header><a href="/">Bloom Electronic</a><nav aria-label="Primary navigation">${links}</nav></header><main id="main-content"><h1>${escapeHtml(route.h1)}</h1>${evidence}<p><a href="/contact">Discuss your project</a></p></main><footer><a href="mailto:${escapeHtml(brand.primaryEmail)}">${escapeHtml(brand.primaryEmail)}</a></footer></div>`;
}

function render(route) {
  const canonical = canonicalFor(route.path);
  let html = replaceTitle(template, route.title);
  html = upsertMeta(html, "name", "description", route.description);
  html = upsertMeta(html, "name", "robots", route.noindex ? "noindex, nofollow" : "index, follow");
  html = upsertMeta(html, "property", "og:title", route.title);
  html = upsertMeta(html, "property", "og:description", route.description);
  html = upsertMeta(html, "property", "og:url", canonical);
  html = upsertMeta(html, "property", "og:type", "website");
  html = upsertMeta(html, "property", "og:image", `${CANONICAL_ORIGIN}${baseSeo.image}`);
  html = upsertMeta(html, "name", "twitter:card", "summary_large_image");
  html = upsertMeta(html, "name", "twitter:title", route.title);
  html = upsertMeta(html, "name", "twitter:description", route.description);
  html = upsertMeta(html, "name", "twitter:image", `${CANONICAL_ORIGIN}${baseSeo.image}`);
  html = upsertCanonical(html, canonical);
  if (process.env.VITE_GOOGLE_SITE_VERIFICATION) html = upsertMeta(html, "name", "google-site-verification", process.env.VITE_GOOGLE_SITE_VERIFICATION);
  const schema = `<script type="application/ld+json">${JSON.stringify(schemasFor(route)).replaceAll("<", "\\u003c")}</script>`;
  html = html.replace("</head>", `    ${schema}\n  </head>`);
  html = html.replace(/<div id="root"><\/div>/, fallbackBody(route));
  return html;
}

for (const routePath of publicRoutes) {
  const route = getRouteContent(routePath);
  const directory = routePath === "/" ? output : path.join(output, ...routePath.slice(1).split("/"));
  mkdirSync(directory, { recursive: true });
  writeFileSync(path.join(directory, "index.html"), render(route));
}

const notFound = getRouteContent("/404");
writeFileSync(path.join(output, "404.html"), render(notFound));

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${publicRoutes.map((routePath) => `  <url><loc>${canonicalFor(routePath)}</loc></url>`).join("\n")}\n</urlset>\n`;
writeFileSync(path.join(output, "sitemap.xml"), sitemap);
writeFileSync(path.join(output, "robots.txt"), `User-agent: *\nAllow: /\nSitemap: ${CANONICAL_ORIGIN}/sitemap.xml\n`);

console.log(`Generated ${publicRoutes.length} static routes, 404.html, sitemap.xml and robots.txt.`);
