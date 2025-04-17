const express = require("express")
const profileRouter = express.Router()

const {
    edit_profile
} = require("../Controllers/profile.controller.js")


profileRouter.patch("/profile/edit" , edit_profile)


module.exports = {
    profileRouter
}