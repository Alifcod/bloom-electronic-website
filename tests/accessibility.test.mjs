import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const layout = readFileSync("src/Layout.jsx", "utf8");
const form = readFileSync("src/ContactForm.jsx", "utf8");
const styles = readFileSync("src/styles.css", "utf8");

test("global keyboard and landmark safeguards are present", () => {
  assert.match(layout, /className="skip-link" href="#main-content"/);
  assert.match(layout, /aria-controls="mobile-navigation"/);
  assert.match(layout, /aria-expanded=\{menuOpen\}/);
  assert.match(layout, /event\.key === "Escape"/);
  assert.match(styles, /:focus-visible/);
  assert.match(styles, /\.skip-link:focus/);
});

test("the form announces status and identifies invalid fields", () => {
  assert.match(form, /aria-live="polite"/);
  assert.match(form, /aria-invalid=/);
  assert.match(form, /focusFirstError/);
  assert.match(form, /data-success-heading/);
  assert.match(form, /noValidate/);
});

test("reduced-motion and narrow mobile layouts are explicitly supported", () => {
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(styles, /@media \(max-width: 560px\)/);
  assert.match(styles, /min-width: 320px/);
});
