const test = require("node:test");
const assert = require("node:assert/strict");
const { createBrandSlug } = require("../utils/brandSlug");

test("creates a lowercase underscore-separated brand slug", () => {
  assert.equal(createBrandSlug("Louis Vuitton"), "louis_vuitton");
});

test("trims the name and collapses whitespace", () => {
  assert.equal(createBrandSlug("  Hugo   Boss  "), "hugo_boss");
});

test("keeps non-Latin brand names and separates their words", () => {
  assert.equal(createBrandSlug("برند نمونه"), "برند_نمونه");
});

test("returns an empty slug for a non-string value", () => {
  assert.equal(createBrandSlug(null), "");
});
