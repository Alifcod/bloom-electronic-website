import assert from "node:assert/strict";
import test from "node:test";
import { buildLeadPayload, createEmptyLead, FIELD_LIMITS, submitLead, validateLead } from "../src/lead.js";

function validLead() {
  return {
    ...createEmptyLead(),
    fullName: "A Test User",
    email: "engineer@example.com",
    projectType: "PCB design review and rescue",
    projectStage: "Prototype not working",
    description: "The board resets when the load is enabled.",
    consent: true,
  };
}

test("required fields and email format are validated", () => {
  const empty = validateLead(createEmptyLead());
  assert.equal(empty.valid, false);
  assert.ok(empty.errors.fullName);
  assert.ok(empty.errors.projectStage);
  const invalidEmail = validateLead({ ...validLead(), email: "not-an-email" });
  assert.equal(invalidEmail.valid, false);
  assert.ok(invalidEmail.errors.email);
});

test("lead fields are trimmed and field limits enforced", () => {
  const trimmed = validateLead({ ...validLead(), fullName: "  A Test User  " });
  assert.equal(trimmed.data.fullName, "A Test User");
  const tooLong = validateLead({ ...validLead(), description: "x".repeat(FIELD_LIMITS.description + 1) });
  assert.equal(tooLong.valid, false);
  assert.match(tooLong.errors.description, /4000/);
});

test("payload contains attribution and a stable submission ID without mutating form data", () => {
  const input = validLead();
  const snapshot = structuredClone(input);
  const result = buildLeadPayload(input, {
    submissionId: "submission-123",
    now: Date.UTC(2026, 7, 18),
    formStartedAt: "2026-08-18T00:00:00.000Z",
    location: { pathname: "/contact", search: "?utm_source=search", href: "https://bloomelectronics.my/contact?utm_source=search" },
    attribution: { firstTouch: { utm_source: "search" }, currentSession: { utm_source: "search" } },
    referrer: "https://www.google.com/",
    browserLanguage: "en-MY",
  });
  assert.equal(result.valid, true);
  assert.equal(result.payload.submissionId, "submission-123");
  assert.equal(result.payload.attribution.firstTouch.utm_source, "search");
  assert.deepEqual(input, snapshot);
});

test("submission succeeds only after matching server acknowledgement", async () => {
  const payload = { submissionId: "submission-ok" };
  const result = await submitLead("https://api.example.com/lead", payload, {
    fetchImpl: async () => new Response(JSON.stringify({ ok: true, submissionId: "submission-ok" }), { status: 200, headers: { "Content-Type": "application/json" } }),
  });
  assert.equal(result.ok, true);
  await assert.rejects(() => submitLead("https://api.example.com/lead", payload, {
    fetchImpl: async () => new Response(JSON.stringify({ ok: true, submissionId: "different-id" }), { status: 200, headers: { "Content-Type": "application/json" } }),
  }), /submission_rejected/);
});

test("server failure and timeout reject while caller form data remains intact", async () => {
  const formData = validLead();
  const snapshot = structuredClone(formData);
  await assert.rejects(() => submitLead("https://api.example.com/lead", { submissionId: "failed" }, {
    fetchImpl: async () => new Response(JSON.stringify({ ok: false, message: "delivery failed" }), { status: 502, headers: { "Content-Type": "application/json" } }),
  }), /delivery failed/);
  await assert.rejects(() => submitLead("https://api.example.com/lead", { submissionId: "timeout" }, {
    timeoutMs: 10,
    fetchImpl: async (_url, options) => new Promise((_resolve, reject) => options.signal.addEventListener("abort", () => reject(Object.assign(new Error("aborted"), { name: "AbortError" })))),
  }), (error) => error.name === "AbortError");
  assert.deepEqual(formData, snapshot);
});
