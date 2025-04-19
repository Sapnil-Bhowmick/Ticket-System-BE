const createHTTPError = require("http-errors")
const validator = require("validator")

const validateNewUserData = (req) => {
    const { name, phone, emailID } = req.body

    if (!name || !phone || !emailID) {
        throw createHTTPError.BadRequest("Please fill in the required fields")
    }

    if (!typeof (name) === "string" || !validator.isLength(name, { min: 2, max: 100 })) {
        throw createHTTPError.BadRequest("Please ensure that the name is between 2 and 100 characters")
    }

    if (!typeof (emailID) === "string" || !validator.isEmail(emailID)) {
        throw createHTTPError.BadRequest("Please ensure that the emailID is valid")
    }

    if (!typeof (phone === "string" || !validator.isMobilePhone(phone, 'any'))) {
        throw createHTTPError.BadRequest("Please ensure that the PhoneNo is valid")
    }
}



module.exports = {
    validateNewUserData
}