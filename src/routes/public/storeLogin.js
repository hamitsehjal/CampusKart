// src/routes/public/storeLogin.js

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { Store } = require('../../models');
const { logger } = require('../../logger');
const { createErrorResponse, createSuccessResponse } = require('../../response');

module.exports = async (req, res) => {
    try {
        const { email, password } = req.body;

        // check if account exists
        const store = await Store.findOne({ email });

        if (!store) {
            logger.info(`Account doesn't exist for the email: ${email}`);
            return res.status(422).json(createErrorResponse(422, `Login failed for the email ${email}`))
        }

        // Compare Passwords

        const isMatch = await bcrypt.compare(password, store.password);
        if (!isMatch) {
            logger.info(`LOGIN FAILED: Passwords doesn't Matches`);
            return res.status(422).json(createErrorResponse(422, `Passwords doesn't Matches`));

        }

        // Authentication Complete, create JWT Token
        const token = jwt.sign({ store_id: store._id, store_name: store.name }, process.env.JWT_SECRET, { expiresIn: '1h' });
        logger.debug({ Token: token }, `Token issued to Store`)

        const successResponse = createSuccessResponse({
            "token": token,
            "message": "Logged IN"
        })

        return res.status(200).json(successResponse)
    } catch (error) {
        logger.error({ error }, `Error`)
        return res.status(401).json(createErrorResponse(401, `Error Logging in`))
    }
}