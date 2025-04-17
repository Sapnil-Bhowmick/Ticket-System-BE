const express = require("express")
const ticketRouter = express.Router()


const {
    getAllTickets,
    getAllTickets_byStatus,
    setTicketStatus,
    register_TicketRaiser
} = require("../Controllers/ticket.controller.js")


ticketRouter.get("/all" , getAllTickets)
ticketRouter.get("/all/:status" , getAllTickets_byStatus)

// Pass query params -> resolved / unresolved
ticketRouter.post("/" , setTicketStatus)

ticketRouter.post("/register" , register_TicketRaiser)


module.exports = {
    ticketRouter
}

