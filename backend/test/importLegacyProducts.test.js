const test = require("node:test");
const assert = require("node:assert/strict");

const {
  detectTable,
  extractInsertBodies,
  getImageBaseName,
  getImageCandidates,
  getRequiredImageFiles,
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
  assert.equal(normalizeImageName("sample-960.webp"), "sample-960.webp");
});

test("uses one identity for original and responsive image names", () => {
  assert.equal(getImageBaseName("sample.webp"), "sample");
  assert.equal(getImageBaseName("sample-960.webp"), "sample");
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
  const expected = [
    "sample.webp",
    "sample-960.webp",
    "sample-640.webp",
    "sample-320.webp",
  ];
  assert.deepEqual(getImageCandidates("sample.webp"), expected);
  assert.deepEqual(getImageCandidates("sample-960.webp"), expected);
});

test("requires all three files for a responsive database image", () => {
  assert.deepEqual(getRequiredImageFiles("sample.webp"), ["sample.webp"]);
  assert.deepEqual(getRequiredImageFiles("sample-960.webp"), [
    "sample-320.webp",
    "sample-640.webp",
    "sample-960.webp",
  ]);
});
