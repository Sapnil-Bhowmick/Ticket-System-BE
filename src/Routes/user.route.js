const express = require("express")
const { addUser } = require("../Controllers/user.controller.js")

const userRouter = express.Router()

// Register user who is raising ticket
userRouter.post("/add" , addUser)

module.exports = {
    userRouter
}