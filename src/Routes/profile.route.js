const express = require("express")
const profileRouter = express.Router()

const {
    edit_profile
} = require("../Controllers/profile.controller.js")

const {userAuth} = require("../Middlewares/auth.middleware.js")

profileRouter.patch("/edit" , userAuth , edit_profile)


module.exports = {
    profileRouter
}