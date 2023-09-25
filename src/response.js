// src/response.js


/**
 * A Successful response looks like this:
 * 
 * {
 * "status":"ok",
 * ...
 * }
 * 
 */

module.exports.createSuccessResponse = (data) => {
    return (
        {
            "status": "ok",
            ...data,
        }
    )
}

/**
 * A Error response looks like this:
 * 
 * {
 * "status":"error",
 * "error":{
 *      "code":404,
 *      "message":"Doesn't exist...."
 *      }
 * }
 */

module.exports.createErrorResponse = (errCode, msg) => {
    return (
        {
            "status": "error",
            "error": {
                "code": errCode,
                "message": msg,
            }
        }
    )
}