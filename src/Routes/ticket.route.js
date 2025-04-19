const express = require("express")
const ticketRouter = express.Router()


const {
    getAllTickets,
    getAllTickets_byStatus,
    setTicketStatus,
    assignTicket
} = require("../Controllers/ticket.controller.js")

const {userAuth} = require("../Middlewares/auth.middleware.js")

ticketRouter.get("/all" , userAuth , getAllTickets)
ticketRouter.get("/all/:status" , userAuth , getAllTickets_byStatus)

// Pass query params -> resolved / unresolved
ticketRouter.post("/" , userAuth , setTicketStatus)
ticketRouter.post("/assign/:memberID" , userAuth , assignTicket)


module.exports = {
    ticketRouter
}

