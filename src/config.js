import { brand, CANONICAL_ORIGIN } from "./content.js";

const env = import.meta.env ?? {};

function clean(value) {
  return typeof value === "string" ? value.trim() : "";
}

function cleanPhone(value) {
  return clean(value).replace(/[^\d]/g, "");
}

function flag(value) {
  return clean(value).toLowerCase() === "true";
}

export const siteConfig = {
  ...brand,
  canonicalOrigin: CANONICAL_ORIGIN,
  whatsappNumber: cleanPhone(env.VITE_WHATSAPP_NUMBER) || cleanPhone(brand.phone),
  bookingUrl: clean(env.VITE_BOOKING_URL),
  leadApiUrl: clean(env.VITE_LEAD_API_URL),
  gaMeasurementId: clean(env.VITE_GA_MEASUREMENT_ID),
  googleSiteVerification: clean(env.VITE_GOOGLE_SITE_VERIFICATION),
  turnstileSiteKey: clean(env.VITE_TURNSTILE_SITE_KEY),
  showPricing: flag(env.VITE_SHOW_PRICING),
  showTimelines: flag(env.VITE_SHOW_TIMELINES),
  showCaseStudies: env.VITE_SHOW_CASE_STUDIES === undefined ? true : flag(env.VITE_SHOW_CASE_STUDIES),
};

export function buildWhatsAppUrl(stage = "project") {
  if (!siteConfig.whatsappNumber) return "";
  const message = `Hi Bloom Electronic, I would like to discuss an electronics project. My project is currently at the ${stage} stage.`;
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export function isExternalUrl(value) {
  try {
    return new URL(value, siteConfig.canonicalOrigin).origin !== siteConfig.canonicalOrigin;
  } catch {
    return false;
  }
}
