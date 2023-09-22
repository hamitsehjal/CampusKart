const Store = require('../../../src/models/store');
const { dbConnect, dbDisconnect } = require('../test_connection');


beforeAll(async () => await dbConnect());
afterAll(async () => await dbDisconnect());


describe('Store Schema Validation', () => {
    test('name is a required schema path', async () => {
        try {
            await Store.create({
                description: "Walmart Super centers offer a one-stop shopping experience by combining a grocery store with fresh produce, bakery, deli and dairy products with electronics, apparel, toys and home furnishings",
                location: {
                    postalCode: "M2H 2L6",
                    addressLine1: "22 Meson Crescent",
                    city: "Toronto",
                    state: "Ontario",
                    country: "Canada",
                },
                openHours: "7:00 AM - 7:00 AM",
            });

            throw new Error('Save operation should not proceed');
        } catch (err) {
            expect(err.errors['name'].message).toEqual("Path `name` is required.")
        }
    })
})