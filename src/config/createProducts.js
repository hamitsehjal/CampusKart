const mongoose = require('mongoose');
const { Product } = require('../models');
const logger = require('../logger');
const fs = require('fs/promises');
// src/config/createStores.js
require('dotenv').config();

// read data from the file
async function readProductFromFile(filePath) {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    logger.error({ err }, `Error reading data from File with Path: ${filePath}`);
    process.exit(1);
  }
}

// write data to a file
async function writeProductIdsToFile(productIds) {
  const filePath = "data/productIds.json";
  try {
    await fs.writeFile(filePath, JSON.stringify(productIds, null, 2), 'utf-8');
    logger.info(`productIds written to FilePath: ${filePath}`);
  } catch (err) {
    logger.error({ err }, `Error writing data to File with path: ${filePath}`)
  }
}

/** 
create product objects in the database using 'data'
- receives an array of products data
- create 'productIds' array to keep track of new stores Created
- loop through each item in the array
  - create a new store product
  - save it up
  - extract the id of new product created
  - push the id into the productIds array
- return the productIds array
*/

async function createProducts(productsData) {
  try {
    let productIds = [];
    for (const productData of productsData) {
      const newProduct = new Product(productData);
      await newProduct.save();

      productIds.push(newProduct._id);
      logger.debug(`New Product added with productId: ${newProduct._id}`);
    }
    return productIds;
  } catch (err) {
    logger.error({ err }, `Error while creating new Products`);
  }
}
// close the connection
function closeConnection() {
  mongoose.connection.close();
  logger.info(`Mongoose Server Closed!!`)
}
async function main() {
  try {
    // connect to Database
    const URI = process.env.MONGODB_URI;
    await mongoose.connect(URI, {
      dbName: "campus-cart-app",
      useNewUrlParser: true, // use new URL parser of MongoDB Driver
      useUnifiedTopology: true, // use new server Discovery and Monitoring Engine
    });

    logger.info(`DB connected Successfully!!`);
    const filePath = "data/products.json";

    // read stores from the File
    const productData = await readProductFromFile(filePath);

    if (productData.length == 0) {
      logger.info(`No Products found in the File!!`);
      closeConnection();
      return;
    }
    // create stores in the Database using data
    const productIds = await createProducts(productData);

    if (productIds.length == 0) {
      logger.info(`No productIds created!!`);
      closeConnection();
      return;
    }

    await writeProductIdsToFile(productIds);

    // close connection
    closeConnection();

  } catch (err) {
    logger.error({ err }, `Error: Mongoose Server`);
  }
}

main();