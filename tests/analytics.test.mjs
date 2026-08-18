import assert from "node:assert/strict";
import test from "node:test";
import { sanitizeAnalyticsMetadata } from "../src/analytics.js";

test("analytics metadata strips personal and project-description fields", () => {
  const safe = sanitizeAnalyticsMetadata({
    service_category: "PCB troubleshooting",
    page_path: "/contact",
    submission_id: "safe-id",
    email: "private@example.com",
    fullName: "Private Person",
    phone: "+600000000",
    description: "Confidential project details",
  });
  assert.deepEqual(safe, {
    service_category: "PCB troubleshooting",
    page_path: "/contact",
    submission_id: "safe-id",
  });
});

test("analytics values are length-limited", () => {
  const result = sanitizeAnalyticsMetadata({ page_path: "x".repeat(300) });
  assert.equal(result.page_path.length, 120);
});
