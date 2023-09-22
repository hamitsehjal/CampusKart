const Order = require('../../../src/models/order');
const { dbConnect, dbDisconnect } = require('../test_connection');
const mongoose = require('mongoose');

beforeAll(async () => await dbConnect());
afterAll(async () => await dbDisconnect());

describe('Order Schema Validation and Business Logic', () => {
    test('Should throw an error if `User-Reference` is not specified', async () => {

        const createOrder = () => Order.create({
            storeId: new mongoose.Types.ObjectId(),
            status: 'incomplete',
            locationId: new mongoose.Types.ObjectId(),
        });

        expect.
            assertions(1);

        await expect(createOrder()).rejects.toThrow();
    });

    test('Should throw an error if `Store-Reference` is not specified', async () => {
        const createOrder = () => Order.create({
            userId: new mongoose.Types.ObjectId(),
            status: 'incomplete',
            locationId: new mongoose.Types.ObjectId(),
        });

        expect.
            assertions(1);

        await expect(createOrder()).rejects.toThrow();
    });

    test('Should throw an error if `Pickup Location-Reference` is not specified', async () => {
        const createOrder = () => Order.create({
            userId: new mongoose.Types.ObjectId(),
            storeId: new mongoose.Types.ObjectId(),
            status: 'incomplete',
        });

        expect.
            assertions(1);

        await expect(createOrder()).rejects.toThrow();
    });

    test('Status should be a valid value from pre-defined set', async () => {
        const createOrder = () => Order.create({
            userId: new mongoose.Types.ObjectId(),
            storeId: new mongoose.Types.ObjectId(),
            status: 'processing',
            locationId: new mongoose.Types.ObjectId(),
        });

        expect.assertions(1);

        await createOrder().catch(e => expect(e.errors['status'].message).toEqual('enum validator failed for path `status` with value `processing'));


    });
});

describe('If defined, ITEMS should adhere (itemSchema)Schema correctly', () => {
    test('Should throw an error if `Product-reference` is not specified', async () => {
        const createOrder = () => Order.create({
            userId: new mongoose.Types.ObjectId(),
            storeId: new mongoose.Types.ObjectId(),
            status: 'incomplete',
            items: [
                {
                    quantity: 5,
                }
            ],
            locationId: new mongoose.Types.ObjectId(),
        });

        expect.assertions(1);
        await expect(createOrder()).rejects.toThrow();

    });

    test('Should throw an error if `quantity` is not defined', async () => {
        const createOrder = () => Order.create({
            userId: new mongoose.Types.ObjectId(),
            storeId: new mongoose.Types.ObjectId(),
            status: 'incomplete',
            items: [
                {
                    product: new mongoose.Types.ObjectId(),
                }
            ],
            locationId: new mongoose.Types.ObjectId(),
        });
        expect.assertions(1);
        await expect(createOrder()).rejects.toThrow();

    });
    test('Should throw validation error if quantity is less than 1', async () => {
        const createOrder = () => Order.create({
            userId: new mongoose.Types.ObjectId(),
            storeId: new mongoose.Types.ObjectId(),
            status: 'incomplete',
            items: [
                {
                    product: new mongoose.Types.ObjectId(),
                    quantity: 0,
                }
            ],
            locationId: new mongoose.Types.ObjectId(),
        });
        expect.assertions(1);

        await createOrder().catch(e => expect(e.message).toContain('Must be a at least 1, got 0'))
    });
})
