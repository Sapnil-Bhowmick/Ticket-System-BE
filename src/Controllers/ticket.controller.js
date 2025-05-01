const createHTTPError = require("http-errors")

const {
    ticketModel,
    adminModel,
    userModel
} = require("../Models/index.js")
const { validateStatus, validateGetTicketsByStatusData } = require("../Services/ticket.service.js")

const getAllTickets = async(req, res, next) => {
    console.log("in -> getAllTickets")
    try {
        const {userID} = req.LoggedIn_UserInfo
        // * Get all tickets assigned to specific user(admin / member) irrespective of status
        const allAssignedTickets = await ticketModel.find({
            assignID: userID
        }).populate([
            {
                path: 'assignID',
                select: '-password'
            },
            {
                path: 'creatorID',
                select: '-password'
            },
            {
                path: 'latestMessage'
            },
        ]).sort({ createdAt: -1 })

        res.json({
            message: "Fetched all tickets",
            data: allAssignedTickets
        })
    }
    catch (err) {
        next(err)
    }
}


const getAllTickets_byStatus = async(req, res, next) => {
    try {
        validateGetTicketsByStatusData(req)
        const {userID} = req.LoggedIn_UserInfo
        const {status} = req.params
        // * Get all tickets assigned to specific user(admin / member) irrespective of status
        const allAssignedTickets = await ticketModel.find({
            assignID: userID ,
            status
        }).populate([
            {
                path: 'assignID',
                select: '-password'
            },
            {
                path: 'creatorID',
                select: '-password'
            },
            {
                path: 'latestMessage'
            },
        ])

        res.json({
            message: "Fetched all tickets",
            data: allAssignedTickets
        })
    }
    catch (err) {
        next(err)
    }
}


const setTicketStatus = async (req, res, next) => {
    try {
        validateStatus(req)

        const { userID, isMember } = req.LoggedIn_UserInfo
        const { status } = req.params
        const { ticketID } = req.body

        console.log(userID , isMember , status , ticketID)

        const userType = isMember? "TeamMember" : "Admin"
        let ticket = await ticketModel.findOne({
            _id: ticketID,
            assignID: userID,
            assignType: userType,
            status: status === "Resolved" ? "UnResolved" : "Resolved"
        })

        if (!ticket) throw createHTTPError.NotFound(`No ${status === "Resolved" ? "UnResolved" : "Resolved"} ticket found assigned to this ${userType} with the provided ticket ID.`)
        ticket.status = status
        ticket = await ticket.save()
        res.json({
            message: "Set Status Successfully",
            data: ticket
        })
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

        const { isMember } = req.LoggedIn_UserInfo
        if (isMember) throw createHTTPError.Forbidden("Only Admin can assign tickets to team members")

        const existingTicket = await ticketModel.findById(ticketID)
        if (!existingTicket) throw createHTTPError.BadRequest("Ticket Not Found")
        if(existingTicket.firstReplyAt) throw createHTTPError.Forbidden("Can't assign to member, chat has already started")

        let updatedTicket = await ticketModel.findByIdAndUpdate(ticketID, {
            assignID: memberID,
            assignType: "TeamMember"
        }, { new: true })

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