const test = require("node:test");
const assert = require("node:assert/strict");

const orderRepository = {
  findCartItemById: async () => null,
  insertCartItem: async () => {},
  updateCartItemQuantity: async () => {},
};

const productRepository = {
  findById: async () => null,
};

const mockModule = (request, exports) => {
  const filename = require.resolve(request);
  require.cache[filename] = { filename, loaded: true, exports };
};

mockModule("../db", {});
mockModule("../repositories/order", orderRepository);
mockModule("../repositories/products", productRepository);
mockModule("../repositories/users", {});
mockModule("../repositories/address", {});
mockModule("../services/emailService", {});

const { addToCart } = require("../controllers/order");

const callAddToCart = async (body) => {
  const response = {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
  };

  let nextError;
  await addToCart(
    { body, user: { id: 7 } },
    response,
    (error) => {
      nextError = error;
    },
  );

  assert.equal(nextError, undefined);
  return response;
};

test("accepts the frontend size field and stores the canonical stock value", async () => {
  productRepository.findById = async () => ({
    sizes: [{ size: "XL", quantity: 3 }],
  });

  let inserted;
  orderRepository.findCartItemById = async () => null;
  orderRepository.insertCartItem = async (...args) => {
    inserted = args;
  };

  const response = await callAddToCart({
    productsId: 12,
    size: "xl",
    quantity: 2,
  });

  assert.equal(response.statusCode, 200);
  assert.equal(response.body.success, true);
  assert.deepEqual(inserted, [null, 7, 12, "XL", 2]);
});

test("keeps accepting stock for older clients", async () => {
  productRepository.findById = async () => ({
    sizes: [{ size: "42", quantity: 1 }],
  });

  let inserted;
  orderRepository.findCartItemById = async () => null;
  orderRepository.insertCartItem = async (...args) => {
    inserted = args;
  };

  const response = await callAddToCart({
    productsId: 12,
    stock: 42,
    quantity: 1,
  });

  assert.equal(response.statusCode, 200);
  assert.deepEqual(inserted, [null, 7, 12, "42", 1]);
});

test("rejects a size that does not exist for the product", async () => {
  productRepository.findById = async () => ({
    sizes: [{ size: "M", quantity: 4 }],
  });

  const response = await callAddToCart({
    productsId: 12,
    size: "L",
    quantity: 1,
  });

  assert.equal(response.statusCode, 400);
  assert.equal(response.body.message, "Selected size is not available");
});
