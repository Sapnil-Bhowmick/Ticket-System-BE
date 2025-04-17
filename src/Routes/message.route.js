
const express = require("express")
const { getAllMessages,
    sendMessage
} = require("../Controllers/message.controller")
const messageRouter = express.Router()

messageRouter.get("/all", getAllMessages)
messageRouter.post("/send/:senderId", sendMessage)

module.exports = {
    messageRouter
}