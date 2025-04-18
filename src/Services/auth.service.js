const validator = require("validator")
const createHTTPError = require("http-errors")

const bcrypt = require("bcrypt")

const {
    adminModel
} = require("../Models/index.js")

const validate_AdminRegistrationCredentials = (req) => {
    const { firstName, lastName, emailID, password } = req.body

    if (!firstName || !lastName || !emailID || !password) {
        throw createHTTPError.BadRequest("Please fill in the required fields")
    }

    if (!typeof (firstName) === "string" || !validator.isLength(firstName, { min: 2, max: 100 })) {
        throw createHTTPError.BadRequest("Please ensure that the firstName is between 2 and 100 characters")
    }

    if (!typeof (lastName) === "string" || !validator.isLength(lastName, { min: 2, max: 100 })) {
        throw createHTTPError.BadRequest("Please ensure that the lastName is between 2 and 100 characters")
    }

    if (!typeof (emailID) === "string" || !validator.isEmail(emailID)) {
        throw createHTTPError.BadRequest("Please ensure that the emailID is valid")
    }

    if (!validator.isLength(password, { min: 6 })) {
        throw createHTTPError.BadRequest("Please ensure that the Password atleast of 6 characters")
    }

}


const validate_LoginCredentials = (req) => {
    const { emailID, password } = req.body

    if (!emailID || !password) {
        throw createHTTPError.BadRequest("Please fill in the required fields")
    }

    if (!typeof(emailID) === "string" || !validator.isEmail(emailID)) {
        throw createHTTPError.BadRequest("Please ensure that the emailID is valid")
    }

    if (!validator.isLength(password, { min: 6 })) {
        throw createHTTPError.BadRequest("Please ensure that the Password atleast of 6 characters")
    }

}


module.exports = {
    validate_AdminRegistrationCredentials,
    validate_LoginCredentials
}