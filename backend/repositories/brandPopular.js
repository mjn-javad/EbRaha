const db = require("../db");

const getExecutor = (connection) => {
  return connection ? connection : db;
};

/* ========= BRAND / CATEGORY ========= */

// پیدا کردن بر اساس نام
const findBySlug = async (connection, slug) => {
  const executor = getExecutor(connection);
  const [rows] = await executor.execute(
    "SELECT * FROM brands WHERE slug = ? LIMIT 1",
    [slug],
  );
  return rows[0];
};

const findById = async (connection, id) => {
  const executor = getExecutor(connection);
  const [rows] = await executor.execute(
    "SELECT * FROM brands WHERE id = ? LIMIT 1",
    [id],
  );
  return rows[0];
};

const getAllBrands = async (connection) => {
  const executor = getExecutor(connection);
  const [rows] = await executor.execute(
    "SELECT * FROM brands ORDER BY name ASC, id ASC",
  );
  return rows;
};

const getBrandsByProductType = async (connection, { type, gender }) => {
  const executor = getExecutor(connection);
  const conditions = ["p.type = ?"];
  const values = [type];

  if (gender === "male" || gender === "female") {
    conditions.push("(p.gender = ? OR p.gender = 'genderless')");
    values.push(gender);
  } else if (gender) {
    conditions.push("p.gender = ?");
    values.push(gender);
  }

  const [rows] = await executor.execute(
    `
      SELECT
        b.id,
        b.name,
        b.slug,
        b.image,
        COUNT(DISTINCT p.id) AS product_count
      FROM brands b
      INNER JOIN products p ON p.brand = b.slug
      WHERE ${conditions.join(" AND ")}
      GROUP BY b.id, b.name, b.slug, b.image
      ORDER BY b.name ASC, b.id ASC
    `,
    values,
  );

  return rows;
};

// ایجاد برند یا دسته‌بندی جدید
const create = async (connection, categoryData) => {
  const executor = getExecutor(connection);

  const { name, slug, image } = categoryData;

  const [result] = await executor.execute(
    "INSERT INTO brands (name, slug, image) VALUES (?, ?, ?)",
    [name, slug, image],
  );

  return result.insertId;
};

const update = async (connection, id, brandData) => {
  const executor = getExecutor(connection);
  const { name, slug, image } = brandData;

  const [result] = await executor.execute(
    "UPDATE brands SET name = ?, slug = ?, image = ? WHERE id = ?",
    [name, slug, image, id],
  );

  return result.affectedRows > 0;
};

const updateProductBrandReferences = async (
  connection,
  previousSlug,
  nextSlug,
) => {
  if (previousSlug === nextSlug) {
    return 0;
  }

  const executor = getExecutor(connection);
  const [result] = await executor.execute(
    "UPDATE products SET brand = ? WHERE brand = ?",
    [nextSlug, previousSlug],
  );

  return result.affectedRows;
};

module.exports = {
  findById,
  findBySlug,
  create,
  getAllBrands,
  getBrandsByProductType,
  update,
  updateProductBrandReferences,
};
