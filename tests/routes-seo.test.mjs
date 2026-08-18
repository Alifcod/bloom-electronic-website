import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { CANONICAL_ORIGIN, getRouteContent, projects, publicRoutes, services } from "../src/content.js";

const output = path.resolve("dist/client");
const fileFor = (route) => route === "/" ? path.join(output, "index.html") : path.join(output, ...route.slice(1).split("/"), "index.html");

test("every public clean route has complete static SEO and one H1", () => {
  for (const route of publicRoutes) {
    const file = fileFor(route);
    assert.equal(existsSync(file), true, `missing ${route}`);
    const html = readFileSync(file, "utf8");
    assert.equal((html.match(/<h1[\s>]/gi) || []).length, 1, `${route} must have one H1`);
    assert.match(html, /<title>[^<]+<\/title>/i, `${route} title`);
    assert.match(html, /<meta name="description" content="[^"]+"/i, `${route} description`);
    const canonical = `${CANONICAL_ORIGIN}${route === "/" ? "" : route}`;
    assert.ok(html.includes(`<link rel="canonical" href="${canonical}"`), `${route} canonical`);
    assert.ok(html.includes(`property="og:url" content="${canonical}"`), `${route} Open Graph URL`);
    const schemaMatches = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)];
    assert.ok(schemaMatches.length > 0, `${route} structured data`);
    for (const match of schemaMatches) assert.doesNotThrow(() => JSON.parse(match[1]), `${route} schema is valid JSON`);
  }
});

test("sitemap, robots, CNAME and custom 404 are production-ready", () => {
  const sitemap = readFileSync(path.join(output, "sitemap.xml"), "utf8");
  for (const route of publicRoutes) assert.ok(sitemap.includes(`${CANONICAL_ORIGIN}${route === "/" ? "" : route}`), `sitemap missing ${route}`);
  const robots = readFileSync(path.join(output, "robots.txt"), "utf8");
  assert.match(robots, new RegExp(`Sitemap: ${CANONICAL_ORIGIN.replaceAll(".", "\\.")}/sitemap\\.xml`));
  assert.equal(readFileSync(path.join(output, "CNAME"), "utf8").trim(), "bloomelectronics.my");
  const notFound = readFileSync(path.join(output, "404.html"), "utf8");
  assert.match(notFound, /noindex, nofollow/);
  assert.equal((notFound.match(/<h1[\s>]/gi) || []).length, 1);
});

test("built HTML uses root-relative production assets and has no hash-route navigation", () => {
  for (const route of publicRoutes) {
    const html = readFileSync(fileFor(route), "utf8");
    assert.doesNotMatch(html, /(?:src|href)="\.\/assets\//);
    assert.doesNotMatch(html, /href="\/#(?:services|projects|about|contact)/);
  }
});

test("route metadata is unique and every related-content link resolves", () => {
  const routes = publicRoutes.map(getRouteContent);
  assert.equal(new Set(routes.map((route) => route.title)).size, routes.length, "route titles must be unique");
  assert.equal(new Set(routes.map((route) => route.description)).size, routes.length, "route descriptions must be unique");
  const serviceSlugs = new Set(services.map((service) => service.slug));
  const projectSlugs = new Set(projects.map((project) => project.slug));
  for (const service of services) for (const slug of service.relatedProjects) assert.ok(projectSlugs.has(slug), `missing related project ${slug}`);
  for (const project of projects) for (const slug of project.relatedServices) assert.ok(serviceSlugs.has(slug), `missing related service ${slug}`);
});
