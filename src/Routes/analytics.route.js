
const express = require("express")
const { 
    getMetrics 
} = require("../Controllers/analytics.controller")
const {userAuth} = require("../Middlewares/auth.middleware.js")
const analyticsRouter = express.Router()

analyticsRouter.get("/all" , userAuth , getMetrics)


module.exports = {
    analyticsRouter
}