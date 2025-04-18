const validator = require("validator")
const createHTTPError = require("http-errors")

const validateMemberCredentials = (req) => {
    const { userName, emailID, role } = req.body

    const validRoles = ["ADMIN" , "MEMBER"]

    if (!userName || !emailID || !role) {
        throw createHTTPError.BadRequest("Please fill in the required fields")
    }

    if (!typeof (userName) === "string" || !validator.isLength(userName, { min: 2, max: 100 })) {
        throw createHTTPError.BadRequest("Please ensure that the userName is between 2 and 100 characters")
    }

    if (!typeof (emailID) === "string" || !validator.isEmail(emailID)) {
        throw createHTTPError.BadRequest("Please ensure that the emailID is valid")
    }


    const isRoleValid = validRoles.includes(role)
    if(!typeof(role) === "string" || !isRoleValid){
        throw createHTTPError.BadRequest("Please assign a valid role to team member")
    }

}


const validateMemberProfileData = (req) => {
    const { userName, emailID, role } = req.body
    const validRoles = ["ADMIN" , "MEMBER"]

    if (userName && (!typeof(userName) === "string" || !validator.isLength(userName, { min: 2, max: 100 }))) {
        throw createHTTPError.BadRequest("Please ensure that the userName is between 2 and 100 characters")
    }

    if (emailID && (!typeof(emailID) === "string" || !validator.isEmail(emailID))) {
        throw createHTTPError.BadRequest("Please ensure that the emailID is valid")
    }

    const isRoleValid = validRoles.includes(role)
    if(role && (!typeof(role) === "string" || !isRoleValid)){
        throw createHTTPError.BadRequest("Please assign a valid role to team member")
    }

    const ALLOWED_EDIT_FIELDS = ["userName" , "emailID" , "role"]
    const isEditAllowed = Object.keys(req.body).every((key) => ALLOWED_EDIT_FIELDS.includes(key))
    if(!isEditAllowed){
        throw createHTTPError.BadRequest("Invalid fields to edit")
    }
}

module.exports = {
    validateMemberCredentials,
    validateMemberProfileData
}