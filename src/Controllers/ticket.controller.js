const createHTTPError = require("http-errors")

const {
    ticketModel
} = require("../Models/index.js")

const getAllTickets = (req, res, next) => {
    try {

    }
    catch (err) {
        next(err)
    }
}


const getAllTickets_byStatus = (req, res, next) => {
    try {

    }
    catch (err) {
        next(err)
    }
}


const setTicketStatus = (req, res, next) => {
    try {
        console.log(req.query)
        console.log(req.body)
    }
    catch (err) {
        next(err)
    }
}


const assignTicket = async (req, res, next) => {
    try {
        const { memberID } = req.params
        const { ticketID } = req.body
        if (!memberID) throw createHTTPError.BadRequest("Member ID is required")
        if (!ticketID) throw createHTTPError.BadRequest("Ticket ID is required")

        const {isMember} = req.LoggedIn_UserInfo
        if(isMember) throw createHTTPError.Forbidden("Only Admin can assign tickets to team members")

        const existingTicket = await ticketModel.findById(ticketID)
        if(!existingTicket) throw createHTTPError.BadRequest("Ticket Not Found")
        
        let updatedTicket = await ticketModel.findByIdAndUpdate(ticketID , {
            assignID: memberID,
            assignType: "MEMBER"
        } , {new: true})

        res.json({
            message: "Ticket assigned to team member successfully",
            data: updatedTicket
        })

    }
    catch (err) {
        next(err)
    }
}


module.exports = {
    getAllTickets,
    getAllTickets_byStatus,
    setTicketStatus,
    assignTicket
}