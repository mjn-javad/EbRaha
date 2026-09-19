const test = require("node:test");
const assert = require("node:assert/strict");

const {
  detectTable,
  extractInsertBodies,
  getImageCandidates,
  normalizeImageName,
  parseMysqlValues,
} = require("../scripts/importLegacyProducts");

test("parses MySQL dump rows including escaped strings and NULL", () => {
  const rows = parseMysqlValues(
    "(43,'Men\\'s shoe',NULL,399.00),(44,'line\\nTwo','black',0)",
  );

  assert.deepEqual(rows, [
    [43, "Men's shoe", null, 399],
    [44, "line\nTwo", "black", 0],
  ]);
});

test("extracts an INSERT whose strings contain semicolons", () => {
  const sql = [
    "INSERT INTO `shoes` VALUES",
    "(1,'first; product');",
    "UNLOCK TABLES;",
  ].join("\n");

  assert.deepEqual(parseMysqlValues(extractInsertBodies(sql, "shoes")[0]), [
    [1, "first; product"],
  ]);
});

test("normalizes legacy image extensions to webp", () => {
  assert.equal(normalizeImageName("1781444443943_333291277.jpg"), "1781444443943_333291277.webp");
  assert.equal(normalizeImageName("sample.avif"), "sample.webp");
  assert.equal(normalizeImageName("sample-960.webp"), "sample.webp");
});

test("detects both old and renamed product table formats", () => {
  assert.equal(
    detectTable("INSERT INTO `products` VALUES\n(1);", ["products", "shoes"], "products"),
    "products",
  );
  assert.equal(
    detectTable("INSERT INTO `shoes` VALUES\n(1);", ["products", "shoes"], "products"),
    "shoes",
  );
});

test("returns the original and responsive image candidates", () => {
  assert.deepEqual(getImageCandidates("sample.webp"), [
    "sample.webp",
    "sample-960.webp",
    "sample-640.webp",
    "sample-320.webp",
  ]);
});
