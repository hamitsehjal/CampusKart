const mongoose = require('mongoose');
const { Store } = require('../models');
const logger = require('../logger');
const fs = require('fs/promises');
// src/config/createStores.js


// read data from the file
async function readStoresFromFile(filePath) {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    logger.error({ err }, `Error reading data from File with Path: ${filePath}`);
    process.exit(1);
  }
}

// write data to a file
async function writeStoreIdsToFile(storeIds) {
  const filePath = "data/storeIds.json";
  try {
    await fs.writeFile(filePath, JSON.stringify(storeIds, null, 2), 'utf-8');
    logger.info(`StoreIds written to FilePath: ${filePath}`);
  } catch (err) {
    logger.error({ err }, `Error writing data to File with path: ${filePath}`)
  }
}

/** 
create store objects in the database using 'data'
- receives an array of stores data
- create 'storeIds' array to keep track of new stores Created
- loop through each item in the array
  - create a new store object
  - save it up
  - extract the id of new store created
  - push the id into the storeIds array
- return the storeIds array
*/

async function createStores(storesData) {
  try {
    let storeIds = [];
    for (const storeData of storesData) {
      const newStore = new Store(storeData);
      await newStore.save();

      storeIds.push(newStore._id);
      logger.debug(`New Store added with storeId: ${newStore._id}`);
    }
    return storeIds;
  } catch (err) {
    logger.error({ err }, `Error while creating new Stores`);
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
    const filePath = "data/stores.json";

    // read stores from the File
    const storesData = await readStoresFromFile(filePath);

    if (storesData.length == 0) {
      logger.info(`No Stores found in the File!!`);
      closeConnection();
      return;
    }
    // create stores in the Database using data
    const storeIds = await createStores(storesData);

    if (storeIds.length == 0) {
      logger.info(`No StoreIds created!!`);
      closeConnection();
      return;
    }

    await writeStoreIdsToFile(storeIds);

    // close connection
    closeConnection();

  } catch (err) {
    logger.error({ err }, `Error: Mongoose Server`);
  }
}

main();