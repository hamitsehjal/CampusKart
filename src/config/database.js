const mongoose = require('mongoose');
const logger = require('../logger');
const { Store, Product } = require('../models');

exports.connectToDatabase = () => {
  const URI = process.env.MONGODB_URI;
  mongoose.connect(URI, {
    dbName: "campus-cart-app",
    useNewUrlParser: true, // use new URL parser of MongoDB Driver
    useUnifiedTopology: true, // use new server Discovery and Monitoring Engine
  }).then(async () => {
    logger.info(`DB Connected Successfully`)

    // // Check if no stores exists
    // const storeCount = await Store.countDocuments();
    // const productCount = await Product.countDocuments();
    // if (storeCount == 0 && productCount == 0) {
    //   // Create a Store
    //   const store = new Store({
    //     name: "Real Canadian Superstore",
    //     category: ["Grocery", "Pets", "Electronics"],
    //   });

    //   await store.save();

    //   // Add Product to Store
    //   const product1 = new Product({
    //     name: "Banana",
    //     category: "Fruits",
    //     store: store._id, //assigning store id
    //     price: 3.5,
    //   });

    //   const product2 = new Product({
    //     name: "Strawberries",
    //     category: "Fruits",
    //     store: store._id, //assigning store id
    //     price: 7.00,
    //   });

    //   const product3 = new Product({
    //     name: "Pedigree Dentastix Original Oral Care Treats for Medium Dogs",
    //     category: "Canned Goods",
    //     store: store._id, //assigning store id
    //     price: 250,
    //   });

    //   await product1.save();
    //   await product2.save();
    //   await product3.save();
    // }


  }).catch((error) => {
    logger.debug({ error: error.stack }, `DB Connection Failed`);
    process.exit(1);
  })

}
