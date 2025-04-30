
const express = require("express")
const { 
    getAllMessages_ByTicket,
    getAllMessages_ByUser,
    sendMessage_USER,
    sendMessage_ADMIN_MEMBER
} = require("../Controllers/message.controller")
const {userAuth} = require("../Middlewares/auth.middleware.js")
const messageRouter = express.Router()

messageRouter.get("/all/:ticketID", userAuth , getAllMessages_ByTicket)
messageRouter.get("/user/all/:senderID" , getAllMessages_ByUser)
messageRouter.post("/user/send/:senderID", sendMessage_USER)
messageRouter.post("/send", userAuth , sendMessage_ADMIN_MEMBER)

module.exports = {
    messageRouter
}