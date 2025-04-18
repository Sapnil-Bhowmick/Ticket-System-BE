const createHTTPError = require("http-errors")
const validator = require("validator")

const validateAdminProfileEditData = (req) => {
    const { firstName, lastName, emailID, password, confirmPassword } = req.body

    if (!password || !confirmPassword) {
        throw createHTTPError.BadRequest("Requires both password and confirm password fields.")
    }

    if (firstName && (!typeof (firstName) === "string" || !validator.isLength(firstName, { min: 2, max: 100 }))) {
        throw createHTTPError.BadRequest("Please ensure that the firstName is between 2 and 100 characters")
    }

    if (lastName && (!typeof (lastName) === "string" || !validator.isLength(lastName, { min: 2, max: 100 }))) {
        throw createHTTPError.BadRequest("Please ensure that the lastName is between 2 and 100 characters")
    }

    if (emailID && (!typeof (emailID) === "string" || !validator.isEmail(emailID))) {
        throw createHTTPError.BadRequest("Please ensure that the emailID is valid")
    }

    if (password &&
        (!validator.isLength(password, { min: 6 })) || !validator.isLength(confirmPassword, { min: 6 })) {
        throw createHTTPError.BadRequest("Please ensure that the Password and confirm password is atleast of 6 characters")
    }
}

module.exports = {
    validateAdminProfileEditData
}