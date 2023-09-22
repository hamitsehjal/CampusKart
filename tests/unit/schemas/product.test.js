const Product = require('../../../src/models/product');
const { dbConnect, dbDisconnect } = require('../test_connection');
const mongoose = require('mongoose');

beforeAll(async () => await dbConnect());
afterAll(async () => await dbDisconnect());


describe('Product Schema Validation', () => {
    test('Should throw an error if `User-Reference` is not specified', async () => {

        const createProduct = () => Product.create({
            name: "Mangoes",
            price: 50,
            stockQuantity: 500,
            category: 'Fruits',
        });

        expect.assertions(1);

        await expect(createProduct()).rejects.toThrow();
    });

    test('Should throw an error if `Name` is not specified', async () => {

        const createProduct = () => Product.create({
            user: new mongoose.Types.ObjectId(),
            price: 50,
            stockQuantity: 500,
            category: 'Fruits',
        })

        expect.assertions(1);

        await expect(createProduct()).rejects.toThrow();
    });

    test('Should throw an error if `price` is not specified', async () => {
        const createProduct = () => Product.create({
            user: new mongoose.Types.ObjectId(),
            name: "Mangoes",
            stockQuantity: 500,
            category: 'Fruits',
        })

        expect.assertions(1);

        await expect(createProduct()).rejects.toThrow();

    });

    test('Price cannot be negative', async () => {
        const createProduct = () => Product.create({
            user: new mongoose.Types.ObjectId(),
            name: "Mangoes",
            price: -1,
            stockQuantity: 500,
            category: 'Fruits',
        })

        expect.assertions(1);


        await createProduct().catch(e => expect(e.errors['price'].message).toEqual('Must be a positive value, got -1'));
    });

    test('Should throw an error if `stock Quantity` is not specified', async () => {

        const createProduct = () => Product.create({
            user: new mongoose.Types.ObjectId(),
            name: "Mangoes",
            price: 50,
            category: 'Fruits',
        })

        expect.assertions(1);

        await expect(createProduct()).rejects.toThrow();

    });

    test('Stock Quantity cannot be negative', async () => {
        const createProduct = () => Product.create({
            user: new mongoose.Types.ObjectId(),
            name: "Mangoes",
            price: 50,
            stockQuantity: -3,
            category: 'Fruits',
        })

        expect.assertions(1);

        await createProduct().catch(e => expect(e.errors['stockQuantity'].message).toEqual('Must be a positive value, got -3'));
    });

    test('category should be defined for the product', async () => {
        const createProduct = () => Product.create({
            user: new mongoose.Types.ObjectId(),
            name: "Mangoes",
            price: 50,
        })

        expect.assertions(1);

        await expect(createProduct()).rejects.toThrow();
    });

    test('a VALID Category should be defined from pre-defined set', async () => {
        const createProduct = () => Product.create({
            user: new mongoose.Types.ObjectId(),
            name: "Mangoes",
            price: 50,
            category: 'towels',
        })

        expect.assertions(1);

        await createProduct().catch(e => expect(e.errors['category'].message).toEqual('enum validator failed for path `category` with value `towels`'))


    });

});

describe('If defined, REVIEWS should adhere Schema correctly', () => {
    test('Should throw an error if `User-Reference` is not specified', async () => {
        const createProduct = () => Product.create({
            name: "Mangoes",
            price: 50,
            stockQuantity: 500,
            category: 'Fruits',
            reviews: [
                {
                    rating: 3,
                    comments: "It was Okay",
                }
            ]
        });
        expect.assertions(1);
        await expect(createProduct()).rejects.toThrow();
    });

    test('Should throw an error if `rating` is not specified', async () => {
        const createProduct = () => Product.create({
            name: "Mangoes",
            price: 50,
            stockQuantity: 500,
            category: 'Fruits',
            reviews: [
                {
                    user: new mongoose.Types.ObjectId(),
                    comments: "It was Okay",
                }
            ]
        });
        expect.assertions(1);
        await expect(createProduct()).rejects.toThrow();
    });
})