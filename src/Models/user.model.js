const mongoose = require("mongoose")
const validator = require("validator")

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: [2, "Name should be within 2 and 100 characters"],
        maxLength: [100, "Name should be within 2 and 100 characters"],
        required: [true, "Name is required"]
    },

    phone: {
        type: String,
        required: [true, "PhoneNo is required"],
        unique: [true , "PhoneNo already exist"]
    },

    emailID: {
        type: String,
        lowercase: true,
        required: [true, "EmailID is required"],
        unique: [true, "This emailID already exists"],
        validate: {
            validator: function (email) {
                if (!validator.isEmail(email)) {
                    throw createHTTPError.Conflict("Please provide a valid email address")
                }
            }
        }
    },

    profilePic: {
        type: String,
        default: process.env.DEFAULT_USER_AVATAR
    }
})




const userModel = mongoose.model("User", userSchema)

module.exports = userModel