const { dbConnect, dbDisconnect } = require('../test_connection');
const User = require('../../../src/models/user')
beforeAll(async () => {
    await dbConnect();
})

afterAll(async () => {
    await dbDisconnect();
})

describe('Validation and logic works for Email Address', () => {
    test('Email Address is required', async () => {
        try {
            await User.create({
                password: "alex_lin2",
                studentId: 111222333,

            })
            throw new Error('Save operation should not succeed')

        } catch (err) {
            expect(err.errors['emailAddress'].message).toEqual("Path `emailAddress` is required.")
        }


    });

    test('Email Address should have myseneca.ca domain', async () => {
        try {
            await User.create({
                emailAddress: "alexlin2@gmail.com",
                password: "alex_lin2",
                studentId: 111222333,

            })

            throw new Error('Save operation should not succeed')

        } catch (err) {
            expect(err.errors['emailAddress'].message).toEqual("Path `emailAddress` is invalid (alexlin2@gmail.com).")
            // Shorter version but less accurate
            // expect(err.message).toContain('invalid');
            // expect(err.message).toContain('emailAddress');
        }
    })

    test('Email Address should be unique', async () => {

        try {
            await User.init();
            await User.create({
                emailAddress: "alexlin@myseneca.ca",
                password: "alex_lin1",
                studentId: 111222333,

            })

            await User.create({
                emailAddress: "alexlin@myseneca.ca",
                password: "alex_lin2",
                studentId: 111220000,

            })
            throw new Error('Save operation should not succeed')
        } catch (err) {
            expect(err.message).toContain('duplicate key error');

        }
    })
})