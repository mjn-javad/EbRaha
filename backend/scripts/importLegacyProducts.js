const fs = require("fs");
const path = require("path");

const PRODUCT_COLUMNS = [
  "legacyId",
  "name",
  "slug",
  "brand",
  "model",
  "category",
  "gender",
  "type",
  "price",
  "discountPrice",
  "description",
  "createdAt",
  "updatedAt",
  "colors",
];

const IMAGE_COLUMNS = ["legacyId", "legacyProductId", "imageName", "sortOrder"];
const STOCK_COLUMNS = ["legacyId", "legacyProductId", "size", "quantity"];

const TYPE_MAP = {
  belt: "accessories",
};

function printUsage() {
  console.log(`Usage:
  node scripts/importLegacyProducts.js --source <MahShop.sql> --images-dir <posts-dir>
  node scripts/importLegacyProducts.js --source <MahShop.sql> --images-dir <posts-dir> --apply
  npm run import:legacy-products -- <MahShop.sql> <posts-dir> [--apply]

The command is a dry-run unless --apply is supplied. The apply mode uses the
DB_HOST, DB_PORT, DB_USER, DB_PASSWORD and DB_BLOG values from backend/.env.`);
}

function parseArguments(argv) {
  const options = {
    apply: false,
    allowMissingImages: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];

    if (argument === "--apply") {
      options.apply = true;
    } else if (argument === "--allow-missing-images") {
      options.allowMissingImages = true;
    } else if (argument === "--source" || argument === "--images-dir") {
      const value = argv[index + 1];
      if (!value) throw new Error(`${argument} needs a value`);
      options[argument === "--source" ? "source" : "imagesDir"] = value;
      index += 1;
    } else if (argument === "--help" || argument === "-h") {
      options.help = true;
    } else if (!argument.startsWith("-") && !options.source) {
      options.source = argument;
    } else if (!argument.startsWith("-") && !options.imagesDir) {
      options.imagesDir = argument;
    } else {
      throw new Error(`Unknown argument: ${argument}`);
    }
  }

  return options;
}

function extractInsertBodies(sql, tableName) {
  const marker = `INSERT INTO \`${tableName}\` VALUES`;
  const bodies = [];
  let searchFrom = 0;

  while (true) {
    const markerIndex = sql.indexOf(marker, searchFrom);
    if (markerIndex === -1) break;

    const bodyStart = markerIndex + marker.length;
    let inString = false;
    let escaped = false;
    let statementEnd = -1;

    for (let index = bodyStart; index < sql.length; index += 1) {
      const character = sql[index];

      if (inString) {
        if (escaped) {
          escaped = false;
        } else if (character === "\\") {
          escaped = true;
        } else if (character === "'") {
          if (sql[index + 1] === "'") {
            index += 1;
          } else {
            inString = false;
          }
        }
      } else if (character === "'") {
        inString = true;
      } else if (character === ";") {
        statementEnd = index;
        break;
      }
    }

    if (statementEnd === -1) {
      throw new Error(`Unterminated INSERT statement for ${tableName}`);
    }

    bodies.push(sql.slice(bodyStart, statementEnd));
    searchFrom = statementEnd + 1;
  }

  if (bodies.length === 0) {
    throw new Error(`No INSERT data found for table ${tableName}`);
  }

  return bodies;
}

function detectTable(sql, candidates, role) {
  const tableName = candidates.find((candidate) =>
    sql.includes(`INSERT INTO \`${candidate}\` VALUES`),
  );

  if (!tableName) {
    throw new Error(
      `No INSERT data found for the ${role} table. Tried: ${candidates.join(", ")}`,
    );
  }

  return tableName;
}

function decodeMysqlEscape(character) {
  const escapes = {
    0: "\0",
    b: "\b",
    n: "\n",
    r: "\r",
    t: "\t",
    Z: "\x1a",
  };

  return Object.prototype.hasOwnProperty.call(escapes, character)
    ? escapes[character]
    : character;
}

function parseMysqlValues(body) {
  const rows = [];
  let index = 0;

  const skipSeparators = () => {
    while (index < body.length && /[\s,]/u.test(body[index])) index += 1;
  };

  while (index < body.length) {
    skipSeparators();
    if (index >= body.length) break;
    if (body[index] !== "(") {
      throw new Error(`Expected '(' at offset ${index}`);
    }

    index += 1;
    const row = [];

    while (index < body.length) {
      while (index < body.length && /\s/u.test(body[index])) index += 1;

      let value;
      if (body[index] === "'") {
        index += 1;
        let result = "";
        let closed = false;

        while (index < body.length) {
          const character = body[index];

          if (character === "\\") {
            index += 1;
            if (index >= body.length) throw new Error("Invalid trailing escape");
            result += decodeMysqlEscape(body[index]);
            index += 1;
          } else if (character === "'") {
            if (body[index + 1] === "'") {
              result += "'";
              index += 2;
            } else {
              index += 1;
              closed = true;
              break;
            }
          } else {
            result += character;
            index += 1;
          }
        }

        if (!closed) throw new Error("Unterminated SQL string");
        value = result;
      } else {
        const start = index;
        while (index < body.length && body[index] !== "," && body[index] !== ")") {
          index += 1;
        }

        const token = body.slice(start, index).trim();
        if (/^NULL$/iu.test(token)) {
          value = null;
        } else if (/^-?\d+(?:\.\d+)?$/u.test(token)) {
          value = Number(token);
        } else {
          throw new Error(`Unsupported SQL value '${token}' at offset ${start}`);
        }
      }

      row.push(value);
      while (index < body.length && /\s/u.test(body[index])) index += 1;

      if (body[index] === ",") {
        index += 1;
      } else if (body[index] === ")") {
        index += 1;
        break;
      } else {
        throw new Error(`Expected ',' or ')' at offset ${index}`);
      }
    }

    rows.push(row);
  }

  return rows;
}

function rowsToObjects(rows, columns, tableName) {
  return rows.map((row, index) => {
    if (row.length !== columns.length) {
      throw new Error(
        `${tableName} row ${index + 1} has ${row.length} values; expected ${columns.length}`,
      );
    }

    return Object.fromEntries(columns.map((column, columnIndex) => [column, row[columnIndex]]));
  });
}

function normalizeImageName(imageName) {
  const parsed = path.parse(imageName);
  return `${parsed.name}.webp`;
}

function getImageBaseName(imageName) {
  return path.parse(imageName).name.replace(/-(320|640|960)$/iu, "");
}

function getImageCandidates(imageName) {
  const baseName = getImageBaseName(imageName);
  return [
    `${baseName}.webp`,
    `${baseName}-960.webp`,
    `${baseName}-640.webp`,
    `${baseName}-320.webp`,
  ];
}

function getRequiredImageFiles(imageName) {
  const hasResponsiveSuffix = /-(320|640|960)$/iu.test(path.parse(imageName).name);
  if (!hasResponsiveSuffix) return [imageName];

  const baseName = getImageBaseName(imageName);
  return [
    `${baseName}-320.webp`,
    `${baseName}-640.webp`,
    `${baseName}-960.webp`,
  ];
}

function readLegacyCatalog(sqlPath) {
  const sql = fs.readFileSync(sqlPath, "utf8");
  const sourceTables = {
    products: detectTable(sql, ["products", "shoes"], "products"),
    images: detectTable(
      sql,
      ["product_images", "products_images", "shoes_images"],
      "product images",
    ),
    stocks: detectTable(
      sql,
      ["product_stocks", "products_stock", "shoes_sizes"],
      "product stocks",
    ),
  };
  const parseTable = (tableName, columns) =>
    rowsToObjects(
      extractInsertBodies(sql, tableName).flatMap(parseMysqlValues),
      columns,
      tableName,
    );

  const products = parseTable(sourceTables.products, PRODUCT_COLUMNS).map((product) => ({
    ...product,
    type: TYPE_MAP[product.type] || product.type,
  }));
  const images = parseTable(sourceTables.images, IMAGE_COLUMNS).map((image) => ({
    ...image,
    imageName: normalizeImageName(image.imageName),
  }));
  const stocks = parseTable(sourceTables.stocks, STOCK_COLUMNS).map((stock) => ({
    ...stock,
    size: String(stock.size),
  }));

  return { products, images, stocks, sourceTables };
}

function validateCatalog(catalog, imagesDir) {
  const errors = [];
  const warnings = [];
  const productIds = new Set(catalog.products.map((product) => product.legacyId));
  const slugs = new Set();

  for (const product of catalog.products) {
    if (slugs.has(product.slug)) errors.push(`Duplicate product slug: ${product.slug}`);
    slugs.add(product.slug);
  }

  for (const image of catalog.images) {
    if (!productIds.has(image.legacyProductId)) {
      errors.push(`Image ${image.legacyId} references missing product ${image.legacyProductId}`);
    }
  }

  for (const stock of catalog.stocks) {
    if (!productIds.has(stock.legacyProductId)) {
      errors.push(`Stock ${stock.legacyId} references missing product ${stock.legacyProductId}`);
    }
  }

  let missingImages = [];
  let missingFiles = [];
  if (imagesDir) {
    const missingImageNames = new Set();
    const missingFileNames = new Set();

    for (const image of catalog.images) {
      for (const requiredFile of getRequiredImageFiles(image.imageName)) {
        if (!fs.existsSync(path.join(imagesDir, requiredFile))) {
          missingImageNames.add(image.imageName);
          missingFileNames.add(requiredFile);
        }
      }
    }

    missingImages = [...missingImageNames];
    missingFiles = [...missingFileNames];

    if (missingFiles.length > 0) {
      warnings.push(
        `${missingFiles.length} required image files are missing for ${missingImages.length} database images`,
      );
    }
  }

  return { errors, warnings, missingImages, missingFiles };
}

async function assertCompatibleSchema(connection) {
  const [columns] = await connection.query("SHOW COLUMNS FROM products");
  const byName = new Map(columns.map((column) => [column.Field, column]));

  for (const required of ["slug", "category", "gender", "type"]) {
    if (!byName.has(required)) throw new Error(`products.${required} is missing`);
  }

  const requirements = {
    category: ["sneaker", "other"],
    gender: ["male", "female", "genderless"],
    type: ["shoe", "accessories", "limited_edition"],
  };

  for (const [column, values] of Object.entries(requirements)) {
    const definition = byName.get(column).Type;
    const missing = values.filter((value) => !definition.includes(`'${value}'`));
    if (missing.length > 0) {
      throw new Error(
        `products.${column} does not accept ${missing.join(", ")}. Run migrations/20260919_align_product_catalog_schema.sql first.`,
      );
    }
  }
}

async function importCatalog(catalog) {
  require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
  const mysql = require("mysql2/promise");
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_BLOG,
    charset: "utf8mb4",
  });

  const stats = {
    productsInserted: 0,
    productsUpdated: 0,
    imagesInserted: 0,
    imagesUpdated: 0,
    stocksInserted: 0,
    stocksUpdated: 0,
  };
  const productIdMap = new Map();

  try {
    await assertCompatibleSchema(connection);
    await connection.beginTransaction();

    for (const product of catalog.products) {
      const [result] = await connection.execute(
        `INSERT INTO products
          (name, slug, brand, model, category, gender, type, price,
           discount_price, description, created_at, updated_at, colors)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           id = LAST_INSERT_ID(id), name = VALUES(name), brand = VALUES(brand),
           model = VALUES(model), category = VALUES(category), gender = VALUES(gender),
           type = VALUES(type), price = VALUES(price),
           discount_price = VALUES(discount_price), description = VALUES(description),
           updated_at = VALUES(updated_at), colors = VALUES(colors)`,
        [
          product.name,
          product.slug,
          product.brand,
          product.model,
          product.category || "other",
          product.gender,
          product.type,
          product.price,
          product.discountPrice,
          product.description,
          product.createdAt,
          product.updatedAt,
          product.colors,
        ],
      );

      productIdMap.set(product.legacyId, result.insertId);
      if (result.affectedRows === 1) stats.productsInserted += 1;
      else stats.productsUpdated += 1;
    }

    const imagesByProduct = new Map();
    for (const image of catalog.images) {
      if (!imagesByProduct.has(image.legacyProductId)) {
        imagesByProduct.set(image.legacyProductId, []);
      }
      imagesByProduct.get(image.legacyProductId).push(image);
    }

    for (const [legacyProductId, images] of imagesByProduct) {
      const productId = productIdMap.get(legacyProductId);
      const [existingRows] = await connection.execute(
        "SELECT id, image_name FROM products_images WHERE products_id = ?",
        [productId],
      );
      const existingByBaseName = new Map();

      for (const row of existingRows) {
        const baseName = getImageBaseName(row.image_name);
        if (!existingByBaseName.has(baseName)) existingByBaseName.set(baseName, row);
      }

      for (const image of images) {
        const imageBaseName = getImageBaseName(image.imageName);
        const existing = existingByBaseName.get(imageBaseName);
        if (existing) {
          await connection.execute(
            "UPDATE products_images SET image_name = ?, sort_order = ? WHERE id = ?",
            [image.imageName, image.sortOrder, existing.id],
          );
          stats.imagesUpdated += 1;
        } else {
          const [result] = await connection.execute(
            "INSERT INTO products_images (products_id, image_name, sort_order) VALUES (?, ?, ?)",
            [productId, image.imageName, image.sortOrder],
          );
          existingByBaseName.set(imageBaseName, {
            id: result.insertId,
            image_name: image.imageName,
          });
          stats.imagesInserted += 1;
        }
      }
    }

    for (const stock of catalog.stocks) {
      const productId = productIdMap.get(stock.legacyProductId);
      const [result] = await connection.execute(
        `INSERT INTO products_stock (products_id, stock, quantity)
         VALUES (?, ?, ?)
         ON DUPLICATE KEY UPDATE quantity = VALUES(quantity)`,
        [productId, stock.size, stock.quantity],
      );

      if (result.affectedRows === 1) stats.stocksInserted += 1;
      else stats.stocksUpdated += 1;
    }

    await connection.commit();
    return stats;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    await connection.end();
  }
}

async function main() {
  const options = parseArguments(process.argv.slice(2));
  if (options.help) {
    printUsage();
    return;
  }
  if (!options.source) throw new Error("--source is required");

  const source = path.resolve(options.source);
  const imagesDir = options.imagesDir ? path.resolve(options.imagesDir) : null;
  const catalog = readLegacyCatalog(source);
  const validation = validateCatalog(catalog, imagesDir);

  console.log(
    `Source tables: ${catalog.sourceTables.products}, ${catalog.sourceTables.images}, ${catalog.sourceTables.stocks}`,
  );
  console.log(`Products: ${catalog.products.length}`);
  console.log(`Images:   ${catalog.images.length}`);
  console.log(`Stocks:   ${catalog.stocks.length}`);
  if (imagesDir) {
    console.log(`Images with missing files: ${validation.missingImages.length}`);
    console.log(`Missing required image files: ${validation.missingFiles.length}`);
  }

  for (const warning of validation.warnings) console.warn(`WARNING: ${warning}`);
  if (validation.errors.length > 0) {
    throw new Error(validation.errors.slice(0, 20).join("\n"));
  }
  if (
    options.apply &&
    validation.missingFiles.length > 0 &&
    !options.allowMissingImages
  ) {
    throw new Error(
      "Import stopped because image files are missing. Deploy the images first or explicitly use --allow-missing-images.",
    );
  }

  if (!options.apply) {
    console.log("Dry-run complete. No database changes were made.");
    return;
  }

  const stats = await importCatalog(catalog);
  console.log("Import committed successfully:");
  console.table(stats);
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}

module.exports = {
  detectTable,
  extractInsertBodies,
  getImageBaseName,
  getImageCandidates,
  getRequiredImageFiles,
  normalizeImageName,
  parseMysqlValues,
  readLegacyCatalog,
  validateCatalog,
};
