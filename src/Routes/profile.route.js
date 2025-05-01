const express = require("express")
const profileRouter = express.Router()

const {
    // edit_profile,
    edit_admin_member
} = require("../Controllers/profile.controller.js")

const {userAuth} = require("../Middlewares/auth.middleware.js")

profileRouter.patch("/edit" , userAuth , edit_admin_member)


module.exports = {
    profileRouter
}