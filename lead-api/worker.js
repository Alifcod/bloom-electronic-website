const LIMITS = {
  fullName: 100, email: 254, company: 120, phone: 40, projectType: 100,
  projectStage: 100, timeline: 80, budgetRange: 80, preferredContact: 40,
  description: 4000, existingFiles: 120, submissionId: 120, submittedAt: 40,
  sourcePage: 300, pageUrl: 500, referrer: 500, browserLanguage: 40,
};

const REQUIRED = ["fullName", "email", "projectType", "projectStage", "description", "submissionId", "submittedAt"];
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const STATUS_VALUES = ["New", "Contacted", "Qualified", "Proposal", "Won", "Lost"];

function json(body, status, origin = "") {
  const headers = {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "no-referrer",
  };
  if (origin) {
    headers["Access-Control-Allow-Origin"] = origin;
    headers.Vary = "Origin";
  }
  return new Response(JSON.stringify(body), { status, headers });
}

function configuredOrigins(env) {
  const configured = String(env.ALLOWED_ORIGINS || "").split(",").map((value) => value.trim()).filter(Boolean);
  return new Set(configured.length ? configured : ["https://bloomelectronics.my", "https://www.bloomelectronics.my", "http://localhost:5173"]);
}

function cleanString(value, limit) {
  return typeof value === "string" ? value.trim().slice(0, limit) : "";
}

function cleanAttribution(value) {
  const source = value && typeof value === "object" ? value : {};
  const cleanSet = (set) => Object.fromEntries(["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"].map((key) => [key, cleanString(set?.[key], 120)]));
  return { firstTouch: cleanSet(source.firstTouch), currentSession: cleanSet(source.currentSession) };
}

export function validatePayload(input) {
  if (!input || typeof input !== "object" || Array.isArray(input)) return { valid: false, errors: ["invalid_payload"] };
  const data = {};
  for (const [field, limit] of Object.entries(LIMITS)) data[field] = cleanString(input[field], limit);
  data.consent = input.consent === true;
  data.website = cleanString(input.website, 200);
  data.formStartedAt = cleanString(input.formStartedAt, 40);
  data.attribution = cleanAttribution(input.attribution);
  data.turnstileToken = cleanString(input.turnstileToken, 2048);
  const errors = [];
  for (const field of REQUIRED) if (!data[field]) errors.push(`missing_${field}`);
  if (data.email && !EMAIL_PATTERN.test(data.email)) errors.push("invalid_email");
  if (!data.consent) errors.push("consent_required");
  for (const [field, limit] of Object.entries(LIMITS)) {
    if (typeof input[field] === "string" && input[field].trim().length > limit) errors.push(`too_long_${field}`);
  }
  if (Number.isNaN(Date.parse(data.submittedAt))) errors.push("invalid_timestamp");
  return { valid: errors.length === 0, errors, data };
}

function escapeHtml(value) {
  return String(value ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}

function attributionRows(attribution) {
  return ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"]
    .map((key) => [key, attribution?.currentSession?.[key] || attribution?.firstTouch?.[key] || ""])
    .filter(([, value]) => value);
}

export function buildNotification(data) {
  const displayName = data.company || data.fullName;
  const subject = `[New Bloom Enquiry] ${data.projectType} — ${displayName}`;
  const rows = [
    ["Submission ID", data.submissionId], ["Received", data.submittedAt], ["Name", data.fullName],
    ["Company", data.company], ["Email", data.email], ["Phone / WhatsApp", data.phone],
    ["Preferred contact", data.preferredContact], ["Project type", data.projectType],
    ["Project stage", data.projectStage], ["Timeline", data.timeline], ["Budget", data.budgetRange],
    ["Existing files", data.existingFiles], ["Source page", data.sourcePage], ["Referrer", data.referrer],
    ...attributionRows(data.attribution),
  ].filter(([, value]) => value);
  const table = rows.map(([label, value]) => `<tr><th align="left" style="padding:6px 12px 6px 0">${escapeHtml(label)}</th><td style="padding:6px 0">${escapeHtml(value)}</td></tr>`).join("");
  const phoneLink = data.phone ? `<p><a href="https://wa.me/${encodeURIComponent(data.phone.replace(/\D/g, ""))}">Open phone number in WhatsApp</a></p>` : "";
  return {
    subject,
    html: `<h1>New Bloom Electronic project enquiry</h1><table>${table}</table><h2>Project description</h2><p style="white-space:pre-wrap">${escapeHtml(data.description)}</p>${phoneLink}`,
    text: `${subject}\n\n${rows.map(([label, value]) => `${label}: ${value}`).join("\n")}\n\nProject description:\n${data.description}`,
  };
}

async function verifyTurnstile(data, request, env) {
  if (!env.TURNSTILE_SECRET_KEY) return true;
  if (!data.turnstileToken) return false;
  const form = new FormData();
  form.set("secret", env.TURNSTILE_SECRET_KEY);
  form.set("response", data.turnstileToken);
  form.set("remoteip", request.headers.get("CF-Connecting-IP") || "");
  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body: form });
  const result = await response.json();
  return result.success === true;
}

async function rateAllowed(request, env) {
  if (!env.LEAD_GUARD) return true;
  const ip = request.headers.get("CF-Connecting-IP") || request.headers.get("X-Forwarded-For")?.split(",")[0]?.trim() || "unknown";
  const window = Math.floor(Date.now() / 3_600_000);
  const key = `rate:${ip}:${window}`;
  const current = Number(await env.LEAD_GUARD.get(key) || 0);
  const maximum = Math.max(1, Number(env.RATE_LIMIT_PER_HOUR || 6));
  if (current >= maximum) return false;
  await env.LEAD_GUARD.put(key, String(current + 1), { expirationTtl: 3700 });
  return true;
}

async function deliverEmail(data, env) {
  if (!env.RESEND_API_KEY || !env.LEAD_FROM_EMAIL || !env.LEAD_DESTINATION_EMAIL) throw new Error("email_provider_unconfigured");
  const message = buildNotification(data);
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: env.LEAD_FROM_EMAIL,
      to: [env.LEAD_DESTINATION_EMAIL],
      reply_to: data.email,
      subject: message.subject,
      html: message.html,
      text: message.text,
    }),
  });
  if (!response.ok) throw new Error(`email_delivery_failed_${response.status}`);
  if (String(env.SEND_CUSTOMER_ACKNOWLEDGEMENT).toLowerCase() === "true") {
    const acknowledgement = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: env.LEAD_FROM_EMAIL,
        to: [data.email],
        subject: `Bloom Electronic enquiry received - ${data.submissionId}`,
        text: `Thank you for contacting Bloom Electronic. Your project enquiry was received with submission ID ${data.submissionId}. Please do not send passwords or private keys by email.`,
      }),
    });
    if (!acknowledgement.ok && String(env.REQUIRE_ACKNOWLEDGEMENT).toLowerCase() === "true") throw new Error(`acknowledgement_failed_${acknowledgement.status}`);
  }
}

async function storeLead(data, env) {
  if (!env.LEADS_DB) return;
  await env.LEADS_DB.prepare(`INSERT INTO leads (submission_id, created_at, status, full_name, email, company, phone, project_type, project_stage, timeline, budget_range, existing_files, preferred_contact, description, source_page, referrer, attribution_json) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
    .bind(data.submissionId, data.submittedAt, STATUS_VALUES[0], data.fullName, data.email, data.company, data.phone, data.projectType, data.projectStage, data.timeline, data.budgetRange, data.existingFiles, data.preferredContact, data.description, data.sourcePage, data.referrer, JSON.stringify(data.attribution))
    .run();
}

export async function handleRequest(request, env = {}) {
  const origin = request.headers.get("Origin") || "";
  const allowedOrigins = configuredOrigins(env);
  if (!allowedOrigins.has(origin)) return json({ ok: false, message: "Origin not allowed." }, 403);
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, X-Submission-ID",
      "Access-Control-Max-Age": "86400", Vary: "Origin",
    } });
  }
  if (request.method !== "POST") return json({ ok: false, message: "Method not allowed." }, 405, origin);
  const declaredLength = Number(request.headers.get("Content-Length") || 0);
  if (declaredLength > 16_384) return json({ ok: false, message: "Payload too large." }, 413, origin);
  let text;
  try { text = await request.text(); } catch { return json({ ok: false, message: "Unable to read request." }, 400, origin); }
  if (new TextEncoder().encode(text).length > 16_384) return json({ ok: false, message: "Payload too large." }, 413, origin);
  let input;
  try { input = JSON.parse(text); } catch { return json({ ok: false, message: "Invalid JSON." }, 400, origin); }
  const result = validatePayload(input);
  if (!result.valid) return json({ ok: false, message: "Review the submitted fields.", errors: result.errors }, 400, origin);
  const { data } = result;
  const headerId = cleanString(request.headers.get("X-Submission-ID"), LIMITS.submissionId);
  if (!headerId || headerId !== data.submissionId) return json({ ok: false, message: "Submission identifier mismatch." }, 400, origin);
  if (data.website) return json({ ok: true, submissionId: data.submissionId }, 200, origin);
  const minSubmitMs = Math.max(500, Number(env.MIN_SUBMIT_MS || 2500));
  const startedTime = Date.parse(data.formStartedAt);
  if (!data.formStartedAt || Number.isNaN(startedTime) || Date.now() - startedTime < minSubmitMs) return json({ ok: false, message: "Please review the form before submitting." }, 429, origin);
  if (!(await rateAllowed(request, env))) return json({ ok: false, message: "Too many enquiries from this connection. Please use email." }, 429, origin);
  if (env.LEAD_GUARD && await env.LEAD_GUARD.get(`submission:${data.submissionId}`)) return json({ ok: true, submissionId: data.submissionId, duplicate: true }, 200, origin);
  if (!(await verifyTurnstile(data, request, env))) return json({ ok: false, message: "Spam verification failed." }, 400, origin);
  try {
    await deliverEmail(data, env);
    try {
      if (env.LEAD_GUARD) await env.LEAD_GUARD.put(`submission:${data.submissionId}`, "delivered", { expirationTtl: 604800 });
      await storeLead(data, env);
    } catch (storageError) {
      console.error("Lead delivered but optional storage failed", { submissionId: data.submissionId, reason: storageError instanceof Error ? storageError.message : "unknown" });
    }
    return json({ ok: true, submissionId: data.submissionId }, 200, origin);
  } catch (error) {
    console.error("Lead delivery failed", { submissionId: data.submissionId, reason: error instanceof Error ? error.message : "unknown" });
    return json({ ok: false, message: "Delivery could not be confirmed. Please use email or try again." }, 502, origin);
  }
}

export default { fetch: handleRequest };
