
const express = require("express")
const { 
    getMetrics 
} = require("../Controllers/analytics.controller")
const analyticsRouter = express.Router()

analyticsRouter.get("/all" , getMetrics)


module.exports = {
    analyticsRouter
}