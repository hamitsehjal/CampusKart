const { dbConnect, dbDisconnect } = require('../test_connection');
const bcrypt = require('bcrypt');
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

describe('Password: Validation and Business Logic', () => {
    test('Password is required', async () => {
        try {
            await User.create({
                emailAddress: "alexlin3@myseneca.ca",
                studentId: 111222333,
            })

            throw new Error('Create operation should not succeed')

        } catch (err) {
            // expect(err.errors['password'].message).toEqual("Path `password` is invalid (1231231)")
            expect(err.message).toContain('password')
            expect(err.message).toContain('required')
        }

    });

    test('Password should be hashed', async () => {
        const plainPassword = "testing";
        const user = new User({
            emailAddress: "test@myseneca.ca",
            password: plainPassword,
            studentId: 111000111,
        })

        expect(user.password).toEqual(plainPassword);

        // Saving the user (triggers pre('save') hook for hashing)
        await user.save();

        // Check if the new user's password is hashed and equal to pl
        const retrievedUser = await User.findOne({ emailAddress: "test@myseneca.ca" });

        expect(retrievedUser).toBeDefined();
        expect(retrievedUser.password).not.toEqual(plainPassword);
        expect(await bcrypt.compare(plainPassword, retrievedUser.password)).toBe(true);
    })
})

describe('StudentId: Validation and Business Logic', () => {
    test('StudentId is required', async () => {
        try {

            await User.create({
                emailAddress: "test@myseneca.ca",
                password: "testing",
            })

            throw new Error('Create function should not succeed');
        } catch (err) {
            expect(err.message).toContain('studentId');
            expect(err.message).toContain('required');
        }
    });

    test('StudentId should be unique', async () => {
        try {

            await User.init();
            await User.create({
                emailAddress: "test1@myseneca.ca",
                password: "test",
                studentId: 111222111,

            })

            await User.create({
                emailAddress: "test2@myseneca.ca",
                password: "test",
                studentId: 111222111,

            })

            throw new Error('Save operation should not proceed');
        } catch (err) {
            expect(err.message).toContain('duplicate key error');
        }
    });

    test('StudentId should be at least 100000000', async () => {
        try {
            await User.create({
                emailAddress: "test3@myseneca.ca",
                password: "test",
                studentId: 12131,
            })

            throw new Error('Save operation should not succeed');
        } catch (err) {
            expect(err.message).toContain('Must be at least 100000000, got 12131')
        }
    });

    test('StudentId should not be more than 999999999', async () => {
        try {
            await User.create({
                emailAddress: "test4@myseneca.ca",
                password: "test",
                studentId: 19999993433,
            })

            throw new Error('Save operation should not succeed');
        } catch (err) {
            expect(err.message).toContain('Must be at at most 999999999, got 19999993433')
        }
    });
})
