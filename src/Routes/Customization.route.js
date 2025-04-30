
const express = require("express")
const { 
    customize ,
    getCustomizations
} = require("../Controllers/Customization.controller.js")
const { userAuth } = require("../Middlewares/auth.middleware.js")
const CustomizationRouter = express.Router()

CustomizationRouter.patch("/customizations/:customizationID" , userAuth , customize)
CustomizationRouter.get("/customizations" , getCustomizations)


module.exports = {
    CustomizationRouter
}