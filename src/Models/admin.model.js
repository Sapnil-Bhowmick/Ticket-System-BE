const mongoose = require("mongoose")
const createHTTPError = require("http-errors")
const validator = require("validator")
const bcrypt = require("bcrypt")

const adminSchema = new mongoose.Schema({

    firstName: {
        type: String,
        minLength: [2, "Firstname should be within 2 and 100 characters"],
        maxLength: [100, "Firstname should be within 2 and 100 characters"],
        required: [true, "FirstName is required"]
    },

    lastName: {
        type: String,
        minLength: [2, "Firstname should be within 2 and 100 characters"],
        maxLength: [100, "Firstname should be within 2 and 100 characters"],
        required: [true, "LastName is required"]
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

    password: {
        type: String,
        required: [true, "Please provide password"],
        minLength: [6, "Password should be atleast of 6 characters"]
    },

    isAdmin: {
        type: Boolean,
        default: true
    },

    profilePic: {
        type: String,
        default: process.env.DEFAULT_ADMIN_AVATAR
    }
})




//* ------------------- Schema Methods ------------------------

adminSchema.methods.hashPassword = async function(password){
    const saltRounds = 15
    const hashedPassword = await bcrypt.hash(password, saltRounds)
    console.log("hashedPAssword" , hashedPassword)
    return hashedPassword
}



const adminModel = mongoose.model("Admin", adminSchema)




module.exports = adminModel