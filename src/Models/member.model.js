const mongoose = require("mongoose")
const { ObjectId } = mongoose.Schema.Types
const validator = require("validator")
const createHTTPError = require("http-errors")

const bcrypt = require("bcrypt")

const memberSchema = new mongoose.Schema({
    userName: {
        type: String,
        minLength: [2, "userName should be within 2 and 100 characters"],
        maxLength: [100, "userName should be within 2 and 100 characters"],
        required: [true, "userName is required"]
    },

    emailID: {
        type: String,
        lowercase: true,
        required: [true, "EmailID is required."],
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

    role: {
        type: String,
        required: [true, "Please assign a member role"],
        enum: ["ADMIN", "MEMBER"]
    },

    phone: {
        type: String,
        default: "+1 (000) 000-0000"
    },

    profilePic: {
        type: String,
        default: process.env.DEFAULT_MEMBER_AVATAR
    },

    adminID: {
        type: ObjectId,
        ref: "Admin",
        reqired: [true, "Please assign member to an admin"]
    }
})


memberSchema.methods.hashPassword = async function(password){
    const saltRounds = 15
    const hashedPassword = await bcrypt.hash(password, saltRounds)
    console.log("hashedPAssword" , hashedPassword)
    return hashedPassword
}


const memberModel = mongoose.model("TeamMember", memberSchema)

module.exports = memberModel