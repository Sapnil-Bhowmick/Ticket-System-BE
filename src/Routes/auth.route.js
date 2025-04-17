const express = require("express")
const authRouter = express.Router()

const {
    register_Admin ,
    admin_member_login
} = require("../Controllers/auth.controller.js")



authRouter.post("/register" , register_Admin)
authRouter.post("/login" , admin_member_login)


module.exports = {
    authRouter
}