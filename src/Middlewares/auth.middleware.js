const createHTTPError = require("http-errors")

const { verify_JWT_Token } = require("../Services/token.service")
const { adminModel, memberModel } = require("../Models/index.js")



const userAuth = async (req, res, next) => {
    console.log("In auth middleware")
    try {
        const bearerToken = req.headers["authorization"]
        if (!bearerToken) {
            throw createHTTPError.Unauthorized("You are Unauthorized")
        }

        const token = bearerToken.split(" ")[1]
        const decodedPayload = await verify_JWT_Token(token, process.env.JWT_TOKEN_SECRET)
        // console.log("token" , token)
        
        if (!decodedPayload) {
            throw createHTTPError.Unauthorized("Invalid Token")
        }

        const { userID, isMember } = decodedPayload

        // * Check that the admin / member exists
        let existing_admin_member
        if (isMember) {
            existing_admin_member = await memberModel.findById(userID)
            if (!existing_admin_member) {
                throw createHTTPError.NotFound("Member Not Found")
            }
        } else {
            existing_admin_member = await adminModel.findById(userID)
            if (!existing_admin_member) {
                throw createHTTPError.NotFound("Admin Not Found")
            }
        }

        if(existing_admin_member){
            req.LoggedIn_UserInfo = decodedPayload 
        }

        next()
    }
    catch (err) {
        next(err)
    }
}


module.exports = {
    userAuth
}