import { createClient } from 'redis';
import express from 'express';
import { promisify } from 'util';

// Create express server on port 1245
const app = express();

// Create redis client
const redisClient = createClient();

redisClient.on('connect', function() {
  console.log('Redis client connected to the server');
});

redisClient.on('error', function (err) {
  console.log(`Redis client not connected to the server: ${err}`);
});

// Promisify client.get function
const get = promisify(redisClient.get).bind(redisClient);

/**
 * Represents a product in the list.
 * @typedef {Object} Product
 * @property {number} itemId - The ID of the product.
 * @property {string} itemName - The name of the product.
 * @property {number} price - The price of the product.
 * @property {number} initialAvailableQuantity - The initial available quantity of the product.
 */

/**
 * List of products.
 * @type {Product[]}
 */
const listProducts = [
  { 'itemId': 1, 'itemName': 'Suitcase 250', 'price': 50, 'initialAvailableQuantity': 4},
  { 'itemId': 2, 'itemName': 'Suitcase 450', 'price': 100, 'initialAvailableQuantity': 10},
  { 'itemId': 3, 'itemName': 'Suitcase 650', 'price': 350, 'initialAvailableQuantity': 2},
  { 'itemId': 4, 'itemName': 'Suitcase 1050', 'price': 550, 'initialAvailableQuantity': 5}
];

/**
 * Retrieves an item from the list by its ID.
 * @param {number} id - The ID of the item.
 * @returns {Product|undefined} The item with the specified ID, or undefined if not found.
 */
function getItemById(id) {
  return listProducts.filter((item) => item.itemId === id)[0];
}

/**
 * Reserves stock for an item by its ID.
 * @param {number} itemId - The ID of the item.
 * @param {number} stock - The stock quantity to reserve.
 */
function reserveStockById(itemId, stock) {
  redisClient.set(itemId, stock);
}

/**
 * Retrieves the current reserved stock for an item by its ID.
 * @param {number} itemId - The ID of the item.
 * @returns {Promise<number|null>} A promise that resolves to the current reserved stock, or null if not found.
 */
async function getCurrentReservedStockById(itemId) {
  const stock = await get(itemId);
  return stock;
}

// Express routes

/**
 * Route handler for getting the list of products.
 * @param {express.Request} req - The request object.
 * @param {express.Response} res - The response object.
 */
app.get('/list_products', function (req, res) {
  res.json(listProducts);
});

/**
 * Route handler for getting a specific product by its ID.
 * @param {express.Request} req - The request object.
 * @param {express.Response} res - The response object.
 */
app.get('/list_products/:itemId', async function (req, res) {
  const itemId = req.params.itemId;
  const item = getItemById(parseInt(itemId));

  if (item) {
    const stock = await getCurrentReservedStockById(itemId);
    const resItem = {
      itemId: item.itemId,
      itemName: item.itemName,
      price: item.price,
      initialAvailableQuantity: item.initialAvailableQuantity,
      currentQuantity: stock !== null ? parseInt(stock) : item.initialAvailableQuantity,
    };
    res.json(resItem);
  } else {
    res.json({"status": "Product not found"});
  }
});

/**
 * Route handler for reserving a product by its ID.
 * @param {express.Request} req - The request object.
 * @param {express.Response} res - The response object.
 */
app.get('/reserve_product/:itemId', async function (req, res) {
  const itemId = req.params.itemId;
  const item = getItemById(parseInt(itemId));

  if (!item) {
    res.json({"status": "Product not found"});
    return;
  }

  let currentStock = await getCurrentReservedStockById(itemId);
  if (currentStock !== null) {
    currentStock = parseInt(currentStock);
    if (currentStock > 0) {
      reserveStockById(itemId, currentStock - 1);
      res.json({"status": "Reservation confirmed", "itemId": itemId});
    } else {
      res.json({"status": "Not enough stock available", "itemId": itemId});
    }
  } else {
    reserveStockById(itemId, item.initialAvailableQuantity - 1);
    res.json({"status": "Reservation confirmed", "itemId": itemId});
  }
});

// Set up express server
const port = 1245;
app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`);
});
