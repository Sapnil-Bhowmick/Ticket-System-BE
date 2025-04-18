
const express = require("express")
const router = express.Router()

const { authRouter } = require("./auth.route.js")
const { profileRouter } = require("./profile.route.js")
const { memberRouter } = require("./member.route.js")
const { ticketRouter } = require("./ticket.route.js")
const { messageRouter } = require("./message.route.js")
const {CustomizationRouter} = require("./Customization.route.js")
const { analyticsRouter } = require("./analytics.route.js")


router.use("/auth" , authRouter)
router.use("/profile" , profileRouter)
router.use("/member" , memberRouter)
router.use("/ticket" , ticketRouter)
router.use("/message" , messageRouter)
router.use("/chatbot" , CustomizationRouter)
router.use("/analytics" , analyticsRouter)

module.exports = router