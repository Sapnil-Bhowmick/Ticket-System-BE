
const express = require("express")
const router = express.Router()

const { authRouter } = require("./auth.route.js")
const { profileRouter } = require("./profile.route.js")
const { memberRouter } = require("./member.route.js")
const { ticketRouter } = require("./ticket.route.js")
const { messageRouter } = require("./message.route.js")
const {CustomizationRouter} = require("./Customization.route.js")
const { analyticsRouter } = require("./analytics.route.js")
const { userRouter } = require("./user.route.js")

const trimRequest = require("trim-request")


router.use("/auth" , trimRequest.all , authRouter)
router.use("/profile" , trimRequest.all , profileRouter)
router.use("/member" , trimRequest.all , memberRouter)
router.use("/user" , trimRequest.all , userRouter)
router.use("/ticket" , trimRequest.all , ticketRouter)
router.use("/message" , trimRequest.all , messageRouter)
router.use("/chatbot" , trimRequest.all , CustomizationRouter)
router.use("/analytics" , trimRequest.all , analyticsRouter)

module.exports = router