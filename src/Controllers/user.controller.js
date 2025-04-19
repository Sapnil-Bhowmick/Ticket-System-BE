const { userModel } = require("../Models/index.js")
const { validateNewUserData } = require("../Services/user.service.js")
const createHTTPError = require("http-errors")

const addUser = async (req, res, next) => {
    try {
        validateNewUserData(req)

        const { name, phone, emailID } = req.body

        // * PhoneNo & emailID are unique
        const isPhoneExists = await userModel.findOne({ phone })
        if (isPhoneExists) throw createHTTPError.Conflict("PhoneNo already taken")

        const isEmailExists = await userModel.findOne({ emailID: emailID.toLowerCase() })
        if (isEmailExists) throw createHTTPError.Conflict("EmailID already taken")

        let newUser = await userModel.create({
            name,
            phone,
            emailID
        })

        return res.json({
            message: "User Created Successfully",
            data: newUser
        })



    }
    catch (err) {
        next(err)
    }
}


module.exports = {
    addUser
}