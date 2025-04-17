
const express = require("express")
const { 
    customizeChatbot 
} = require("../Controllers/chatbotCustomization.controller")
const chatbotCustomizationRouter = express.Router()

chatbotCustomizationRouter.patch("/customizations" , customizeChatbot)


module.exports = chatbotCustomizationRouter