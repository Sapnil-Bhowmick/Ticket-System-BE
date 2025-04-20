
const express = require("express")
const { 
    getAllMessages,
    sendMessage_USER,
    sendMessage_ADMIN_MEMBER
} = require("../Controllers/message.controller")
const {userAuth} = require("../Middlewares/auth.middleware.js")
const messageRouter = express.Router()

messageRouter.get("/all", getAllMessages)
messageRouter.post("/user/send/:senderID", sendMessage_USER)
messageRouter.post("/send/:senderID", userAuth , sendMessage_ADMIN_MEMBER)

module.exports = {
    messageRouter
}