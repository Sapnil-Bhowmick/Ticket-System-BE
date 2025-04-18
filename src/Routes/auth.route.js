const express = require("express")
const authRouter = express.Router()
const trimRequest = require("trim-request")

const {
    register_Admin ,
    admin_member_login
} = require("../Controllers/auth.controller.js")



authRouter.post("/register" , trimRequest.all , register_Admin)
authRouter.post("/login" , trimRequest.all , admin_member_login)


module.exports = {
    authRouter
}