import assert from "node:assert/strict";
import test from "node:test";
import { buildNotification, handleRequest, validatePayload } from "../lead-api/worker.js";

class MemoryKv {
  constructor() { this.values = new Map(); }
  async get(key) { return this.values.get(key) ?? null; }
  async put(key, value) { this.values.set(key, value); }
}

function payload(overrides = {}) {
  return {
    fullName: "A Test User",
    email: "engineer@example.com",
    company: "Example Engineering",
    phone: "+60123456789",
    projectType: "PCB troubleshooting",
    projectStage: "Prototype not working",
    timeline: "1–3 months",
    budgetRange: "Needs scoping",
    existingFiles: "PCB source files",
    preferredContact: "Email",
    description: "The board resets when the load is enabled.",
    consent: true,
    website: "",
    submissionId: "submission-123",
    submittedAt: new Date().toISOString(),
    formStartedAt: new Date(Date.now() - 10_000).toISOString(),
    sourcePage: "/contact",
    pageUrl: "https://bloomelectronics.my/contact",
    referrer: "https://www.google.com/",
    browserLanguage: "en-MY",
    attribution: { firstTouch: { utm_source: "search" }, currentSession: { utm_campaign: "pcb" } },
    ...overrides,
  };
}

function requestFor(data, overrides = {}) {
  return new Request("https://lead.example.workers.dev/", {
    method: overrides.method || "POST",
    headers: { Origin: overrides.origin || "https://bloomelectronics.my", "Content-Type": "application/json", "X-Submission-ID": data.submissionId, "CF-Connecting-IP": overrides.ip || "203.0.113.7" },
    body: JSON.stringify(data),
  });
}

function env(overrides = {}) {
  return {
    ALLOWED_ORIGINS: "https://bloomelectronics.my,http://localhost:5173",
    RESEND_API_KEY: "test-only-key",
    LEAD_FROM_EMAIL: "Bloom <test@send.example.com>",
    LEAD_DESTINATION_EMAIL: "owner@example.com",
    LEAD_GUARD: new MemoryKv(),
    MIN_SUBMIT_MS: "500",
    ...overrides,
  };
}

test("server validation rejects missing fields, invalid email and over-limit input", () => {
  const missing = validatePayload({});
  assert.equal(missing.valid, false);
  assert.ok(missing.errors.includes("missing_fullName"));
  const invalid = validatePayload(payload({ email: "bad", description: "x".repeat(4001) }));
  assert.equal(invalid.valid, false);
  assert.ok(invalid.errors.includes("invalid_email"));
  assert.ok(invalid.errors.includes("too_long_description"));
});

test("notification output escapes untrusted content and sets the requested subject", () => {
  const result = buildNotification(payload({ fullName: "<b>Unsafe</b>", company: "" }));
  assert.equal(result.subject, "[New Bloom Enquiry] PCB troubleshooting — <b>Unsafe</b>");
  assert.doesNotMatch(result.html, /<b>Unsafe<\/b>/);
  assert.match(result.html, /&lt;b&gt;Unsafe&lt;\/b&gt;/);
});

test("CORS, minimum-time and honeypot controls fail closed", async () => {
  const denied = await handleRequest(requestFor(payload(), { origin: "https://attacker.example" }), env());
  assert.equal(denied.status, 403);
  const fast = await handleRequest(requestFor(payload({ formStartedAt: new Date().toISOString() })), env());
  assert.equal(fast.status, 429);
  let emailCalls = 0;
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => { emailCalls += 1; return new Response("{}", { status: 200 }); };
  try {
    const trapped = await handleRequest(requestFor(payload({ website: "spam.example" })), env());
    assert.equal(trapped.status, 200);
    assert.equal(emailCalls, 0);
  } finally { globalThis.fetch = originalFetch; }
});

test("a delivered submission is acknowledged and an identical retry does not send twice", async () => {
  const testEnv = env();
  let emailCalls = 0;
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (url) => {
    if (String(url).includes("api.resend.com")) emailCalls += 1;
    return new Response(JSON.stringify({ id: "email-id" }), { status: 200, headers: { "Content-Type": "application/json" } });
  };
  try {
    const first = await handleRequest(requestFor(payload()), testEnv);
    assert.equal(first.status, 200);
    assert.deepEqual(await first.json(), { ok: true, submissionId: "submission-123" });
    const duplicate = await handleRequest(requestFor(payload()), testEnv);
    assert.equal(duplicate.status, 200);
    assert.equal((await duplicate.json()).duplicate, true);
    assert.equal(emailCalls, 1);
  } finally { globalThis.fetch = originalFetch; }
});

test("provider failure never produces a successful acknowledgement", async () => {
  const originalFetch = globalThis.fetch;
  const originalError = console.error;
  globalThis.fetch = async () => new Response("provider error", { status: 500 });
  console.error = () => {};
  try {
    const response = await handleRequest(requestFor(payload({ submissionId: "provider-failure" })), env());
    assert.equal(response.status, 502);
    assert.equal((await response.json()).ok, false);
  } finally { globalThis.fetch = originalFetch; console.error = originalError; }
});
