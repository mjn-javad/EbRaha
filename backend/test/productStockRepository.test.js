const test = require("node:test");
const assert = require("node:assert/strict");

const queries = [];
const database = {
  execute: async (sql, parameters) => {
    queries.push({ sql, parameters });
    return [{ affectedRows: 1 }];
  },
};

const databasePath = require.resolve("../db");
require.cache[databasePath] = {
  filename: databasePath,
  loaded: true,
  exports: database,
};

const { changeStock } = require("../repositories/products");

test("writes clothing sizes to the products_stock.stock column", async () => {
  queries.length = 0;

  const updated = await changeStock(15, "XL", 4);

  assert.equal(updated, true);
  assert.match(queries[0].sql, /products_id, stock, quantity/);
  assert.deepEqual(queries[0].parameters, [15, "XL", 4]);
  assert.match(queries[1].sql, /AND stock = \?/);
  assert.deepEqual(queries[1].parameters, [15, "XL"]);
});
