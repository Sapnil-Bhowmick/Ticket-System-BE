const createHTTPError = require("http-errors")
const {
    validate_AdminRegistrationCredentials,
    validate_LoginCredentials
} = require("../Services/auth.service.js")

const {
    adminModel,
    memberModel
} = require("../Models/index.js")

const { generate_JWT_Token } = require("../Services/token.service.js")
const bcrypt = require("bcrypt")



const register_Admin = async (req, res, next) => {
    try {
        validate_AdminRegistrationCredentials(req)

        const { firstName, lastName, emailID, password } = req.body
        // console.log(req.body)
        const isEmailExists = await adminModel.findOne({ emailID })
        if (isEmailExists) {
            throw createHTTPError.Conflict("EmailID already exists")
        } else {
            let newAdmin = new adminModel({
                firstName,
                lastName,
                emailID,
                password
            })

            const hashedPassword = await newAdmin.hashPassword(password)
            newAdmin.password = hashedPassword

            newAdmin = await newAdmin.save()

            // To remove password field
            newAdmin = newAdmin.toObject()
            delete newAdmin.password

            return res.json({
                message: "Admin created successfully",
                data: newAdmin
            })
        }
    }
    catch (err) {
        next(err)
    }
}




const admin_member_login = async (req, res, next) => {
    try {
        validate_LoginCredentials(req)

        const { emailID, password } = req.body
        let existing_Admin_Member, role, isMember

        existing_Admin_Member = await adminModel.findOne({ emailID: emailID.toLowerCase() })
        if (existing_Admin_Member) {
            role = "ADMIN"
            isMember = false
        } else {
            existing_Admin_Member = await memberModel.findOne({ emailID: emailID.toLowerCase() })
                .populate({path: "adminID" , select: "-password"})
            if (existing_Admin_Member) {
                role = existing_Admin_Member.role
                isMember = true
            }
        }

        if (!existing_Admin_Member) {
            throw createHTTPError.NotFound("Invalid Credentials");
        }

        const isPasswordValid = await bcrypt.compare(password, existing_Admin_Member.password)
        if (!isPasswordValid) {
            throw createHTTPError.NotFound("Invalid Credentials")
        } else {
            const tokenPayload = {
                userID: existing_Admin_Member._id,
                isMember,
                role
            }
            const token = await generate_JWT_Token(tokenPayload, "1d", process.env.JWT_TOKEN_SECRET)

            // * Remove Password
            existing_Admin_Member = existing_Admin_Member.toObject()
            delete existing_Admin_Member.password

            return res.json({
                message: "Login Successfull",
                data: {
                    token,
                    user: existing_Admin_Member
                }
            })
        }

    }
    catch (err) {
        next(err)
    }
}

module.exports = {
    register_Admin,
    admin_member_login
}



