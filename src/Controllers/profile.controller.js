const createHTTPError = require("http-errors")
const { validateAdminProfileEditData } = require("../Services/profile.service")
const { adminModel, memberModel } = require("../Models/index.js")
const bcrypt = require("bcrypt")
const { validate_AdminRegistrationCredentials } = require("../Services/auth.service.js")

const edit_profile = async (req, res, next) => {
    try {
        validateAdminProfileEditData(req)

        const { userID, isMember } = req.LoggedIn_UserInfo
        const { emailID , password, confirmPassword } = req.body

        if (isMember) throw createHTTPError.Forbidden("Only admin can edit profile")

        if (emailID) {
            const existingMember = await memberModel.findOne({ emailID: emailID.toLowerCase() })
            const existingAdmin = await adminModel.findOne({ emailID: emailID.toLowerCase() })
            if (existingMember || existingAdmin) {
                throw createHTTPError.Conflict("EmailID is alrady taken")
            }

        }


        // * Updating Admin Profile
        const adminProfile = await adminModel.findById(userID)
        const hashedPassword = await adminProfile.hashPassword(password)
        if (password !== confirmPassword) throw createHTTPError.BadRequest("Password and Confirm Password do not match")

        Object.keys(req.body).forEach((key) => adminProfile[key] = req.body[key])
        
        adminProfile.password = hashedPassword
        await adminProfile.save()

        return res.json({
            message: "Profile Update Successfully"
        })

    }
    catch (err) {
        next(err)
    }
}


module.exports = {
    edit_profile
}