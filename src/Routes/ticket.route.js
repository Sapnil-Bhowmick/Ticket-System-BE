const express = require("express")
const ticketRouter = express.Router()


const {
    getAllTickets,
    getAllTickets_byStatus,
    setTicketStatus
} = require("../Controllers/ticket.controller.js")


ticketRouter.get("/all" , getAllTickets)
ticketRouter.get("/all/:status" , getAllTickets_byStatus)

// Pass query params -> resolved / unresolved
ticketRouter.post("/" , setTicketStatus)


module.exports = {
    ticketRouter
}

