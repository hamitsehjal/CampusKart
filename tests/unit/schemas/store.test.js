const Store = require('../../../src/models/store');
const { dbConnect, dbDisconnect } = require('../test_connection');


beforeAll(async () => await dbConnect());
afterAll(async () => await dbDisconnect());


describe('Store Schema Validation', () => {
    test('Store should provide its Name(required)', async () => {
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
    });

    test('Store should provide its Description(required)', async () => {
        try {
            await Store.create({
                name: "Walmart",
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
            expect(err.errors['description'].message).toEqual("Path `description` is required.")
        }
    });

    test('Store should provide Open-Hours(required)', async () => {
        try {
            await Store.create({
                name: "Walmart",
                description: "Walmart Super centers offer a one-stop shopping experience by combining a grocery store with fresh produce, bakery, deli and dairy products with electronics, apparel, toys and home furnishings",
                location: {
                    postalCode: "M2H 2L6",
                    addressLine1: "22 Meson Crescent",
                    city: "Toronto",
                    state: "Ontario",
                    country: "Canada",
                },
            });

            throw new Error('Save operation should not proceed');
        } catch (err) {
            expect(err.errors['openHours'].message).toEqual("Path `openHours` is required.")
        }
    });

    test('Store should provide their location(required)', async () => {
        try {
            await Store.create({
                name: "Walmart",
                description: "Walmart Super centers offer a one-stop shopping experience by combining a grocery store with fresh produce, bakery, deli and dairy products with electronics, apparel, toys and home furnishings",
                openHours: "7:00 AM - 7:00 AM",
            });

            throw new Error('Save operation should not proceed');
        } catch (err) {
            expect(err.errors['location'].message).toEqual("Path `location` is required.")
        }
    });
})

describe('location should be valid address', () => {
    it('postalCode must be a valid value in the address', async () => {
        try {
            await Store.create({
                name: "Walmart",
                description: "Walmart Super centers offer a one-stop shopping experience by combining a grocery store with fresh produce, bakery, deli and dairy products with electronics, apparel, toys and home furnishings",
                location: {
                    addressLine1: "22 Meson Crescent",
                    city: "Toronto",
                    state: "Ontario",
                    country: "Canada",
                },
                openHours: "7:00 AM - 7:00 AM",

            });
            throw new Error('Save operation should not proceed');

        } catch (err) {
            expect(err.errors['location.postalCode'].message).toEqual("Path `postalCode` is required.")

        }
    });
    it('addressLine1 must be a valid value in the address', async () => {
        try {
            await Store.create({
                name: "Walmart",
                description: "Walmart Super centers offer a one-stop shopping experience by combining a grocery store with fresh produce, bakery, deli and dairy products with electronics, apparel, toys and home furnishings",
                location: {
                    postalCode: "M2H 2L6",
                    city: "Toronto",
                    state: "Ontario",
                    country: "Canada",
                },
                openHours: "7:00 AM - 7:00 AM",

            });
            throw new Error('Save operation should not proceed');

        } catch (err) {
            expect(err.errors['location.addressLine1'].message).toEqual("Path `addressLine1` is required.")

        }
    });

    it('city must be a valid value in the address', async () => {
        try {
            await Store.create({
                name: "Walmart",
                description: "Walmart Super centers offer a one-stop shopping experience by combining a grocery store with fresh produce, bakery, deli and dairy products with electronics, apparel, toys and home furnishings",
                location: {
                    postalCode: "M2H 2L6",
                    addressLine1: "22 Meson Crescent",
                    state: "Ontario",
                    country: "Canada",
                },
                openHours: "7:00 AM - 7:00 AM",

            });
            throw new Error('Save operation should not proceed');

        } catch (err) {
            expect(err.errors['location.city'].message).toEqual("Path `city` is required.")

        }
    });

    it('state must be a valid value in the address', async () => {
        try {
            await Store.create({
                name: "Walmart",
                description: "Walmart Super centers offer a one-stop shopping experience by combining a grocery store with fresh produce, bakery, deli and dairy products with electronics, apparel, toys and home furnishings",
                location: {
                    postalCode: "M2H 2L6",
                    addressLine1: "22 Meson Crescent",
                    city: "Toronto",
                    country: "Canada",
                },
                openHours: "7:00 AM - 7:00 AM",

            });
            throw new Error('Save operation should not proceed');

        } catch (err) {
            expect(err.errors['location.state'].message).toEqual("Path `state` is required.")

        }
    });

    it('country must be a valid value in the address', async () => {
        try {
            await Store.create({
                name: "Walmart",
                description: "Walmart Super centers offer a one-stop shopping experience by combining a grocery store with fresh produce, bakery, deli and dairy products with electronics, apparel, toys and home furnishings",
                location: {
                    postalCode: "M2H 2L6",
                    addressLine1: "22 Meson Crescent",
                    city: "Toronto",
                    state: "Ontario",
                },
                openHours: "7:00 AM - 7:00 AM",

            });
            throw new Error('Save operation should not proceed');

        } catch (err) {
            expect(err.errors['location.country'].message).toEqual("Path `country` is required.")

        }
    });


})