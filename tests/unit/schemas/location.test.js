const Location = require('../../../src/models/location');
const { dbConnect, dbDisconnect } = require('../test_connection');

beforeAll(async () => await dbConnect());
afterAll(async () => await dbDisconnect());

describe('Location Schema Validation', () => {
    test('address should be valid ', async () => {
        try {
            await Location.create({
                label: "Block K - outerStreet Valley"
            })


            throw new Error('Save operation should not proceed');
        } catch (err) {
            expect(err.errors['address'].message).toEqual("Path `address` is required.")
        }
    });

    test('Label for the address is required', async () => {
        try {
            await Location.create({
                address: {
                    postalCode: "M2H 2L6",
                    addressLine1: "22 Meson Crescent",
                    city: "Toronto",
                    state: "Ontario",
                    country: "Canada",
                },
            })


            throw new Error('Save operation should not proceed');
        } catch (err) {
            expect(err.errors['label'].message).toEqual("Path `label` is required.")
        }
    });
})