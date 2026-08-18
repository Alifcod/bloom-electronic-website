const ALLOWED_EVENTS = new Set([
  "generate_lead",
  "form_start",
  "form_submit_success",
  "form_submit_error",
  "click_whatsapp",
  "click_email",
  "click_booking",
  "view_service",
  "view_project",
  "select_service",
]);

const SAFE_KEYS = new Set([
  "service_category",
  "project_category",
  "page_path",
  "cta_location",
  "submission_id",
  "error_type",
]);

const CONSENT_KEY = "bloom_analytics_consent";
let measurementId = "";
let loaded = false;

export function sanitizeAnalyticsMetadata(metadata = {}) {
  return Object.fromEntries(
    Object.entries(metadata)
      .filter(([key, value]) => SAFE_KEYS.has(key) && ["string", "number", "boolean"].includes(typeof value))
      .map(([key, value]) => [key, typeof value === "string" ? value.slice(0, 120) : value]),
  );
}

export function configureAnalytics(id) {
  measurementId = typeof id === "string" ? id.trim() : "";
}

export function getAnalyticsConsent() {
  if (typeof window === "undefined") return "unknown";
  try { return window.localStorage.getItem(CONSENT_KEY) ?? "unknown"; } catch { return "unknown"; }
}

export function setAnalyticsConsent(value) {
  if (typeof window === "undefined") return;
  const consent = value === "granted" ? "granted" : "denied";
  try { window.localStorage.setItem(CONSENT_KEY, consent); } catch { /* Consent remains session-only when storage is blocked. */ }
  if (consent === "granted") loadAnalytics();
}

export function loadAnalytics() {
  if (typeof window === "undefined" || !measurementId || loaded || getAnalyticsConsent() !== "granted") return;
  loaded = true;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() { window.dataLayer.push(arguments); };
  window.gtag("js", new Date());
  window.gtag("config", measurementId, { anonymize_ip: true, send_page_view: false });
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
  document.head.append(script);
}

export function trackEvent(name, metadata = {}) {
  if (!ALLOWED_EVENTS.has(name) || typeof window === "undefined" || getAnalyticsConsent() !== "granted") return;
  loadAnalytics();
  if (typeof window.gtag === "function") window.gtag("event", name, sanitizeAnalyticsMetadata(metadata));
}
