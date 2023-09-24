// src/routes/api/register.js 
const { createErrorResponse, createSuccessResponse } = require('../response');
const { User } = require('../models');
module.exports = async (req, res) => {
    /**
     * 1. receive information as 'req.body'
     * 2. calls registerUser with req.body
  
     */
    try {
        await registerUser(req.body);
        const successResponse = createSuccessResponse({
            message: "Account Created!!"
        })
        res.status(201).json(successResponse);
    } catch (err) {

        return res.status(422).json(createErrorResponse(422, "Couldn't create Account!!"));
    }

}


async function registerUser(data) {
    /**
     * 1. Make a new Mongoose document and save it up in the database
     * 2. Let user know the response    
     *  - If saved - success message
     *  - If not saved - error message
     */
    try {
        await User.create({
            emailAddress: data.emailAddress,
            password: data.password,
            studentId: data.studentId,
            profilePicture: data.profilePicture ?? '',
        });

        return (`SUCCESS: User ${data.emailAddress} has been created`);

    } catch (err) {
        throw new Error(`FAILED: User ${data.emailAddress} WAS NOT created - ${err}`);
    }
}