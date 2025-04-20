const createHTTPError = require("http-errors")
const schedule = require("node-schedule");
const { ticketModel, adminModel, messageModel } = require("../Models/index.js")

const getAllMessages = async (req, res, next) => {
    try {

    }
    catch (err) {
        next(err)
    }
}



const sendMessage_USER = async (req, res, next) => {
    try {
        const { senderID } = req.params
        const { message } = req.body

        if (!senderID) throw createHTTPError.BadRequest("senderID is required")
        if (!message) throw createHTTPError.BadRequest("Message is required")

        const MISS_TIMEOUT_MINUTES = 1;

        const defaultAdmin = await adminModel.find({})

        // * Check for existing unMissed and unResolved ticket
        let ticket = await ticketModel.findOne({
            creatorID: senderID,
            isMissed: false,
            status: "UnResolved"
        })

        if (!ticket) {
            ticket = await ticketModel.create({
                description: message,
                creatorID: senderID,
                assignID: defaultAdmin[0]._id

            })

            // * Schedule miss check
            schedule.scheduleJob(Date.now() + MISS_TIMEOUT_MINUTES * 60 * 1000, async () => {
                const newTicketCreated = await ticketModel.findById(ticket._id)
                // console.log("Running after 1 min" , newTicketCreated)
                if (newTicketCreated && !newTicketCreated.firstReplyAt) {
                    newTicketCreated.isMissed = true
                    await newTicketCreated.save()
                }
            })
        }

        // * Create New Message
        const newMessage = await messageModel.create({
            message,
            senderID,
            ticketID: ticket._id
        })

        // * Update latest message
        ticket.latestMessage = newMessage._id
        await ticket.save()

        return res.json({
            message: "Message send successfully",
            data: newMessage
        })

    }
    catch (err) {
        next(err)
    }
}




const sendMessage_ADMIN_MEMBER = async (req, res, next) => {
    try {
        const { senderID } = req.params
        const { message, ticketID } = req.body

        if (!senderID) throw createHTTPError.BadRequest("SenderID is required")
        if (!message) throw createHTTPError.BadRequest("Message is required")
        if (!ticketID) throw createHTTPError.BadRequest("TicketID is required")

        const existingTicket = await ticketModel.findById(ticketID)
        if (!existingTicket) {
            throw createHTTPError.NotFound("Ticket not found")
        } else {
            const isTicketAssignedToMe = existingTicket.assignID.equals(senderID)
            // console.log("isTicketAssignedToMe" , isTicketAssignedToMe)
            const isTicketResolved = existingTicket.status === "Resolved" ? true : false
            if (!isTicketAssignedToMe) {
                throw createHTTPError.Forbidden("Ticket is not assigned to you.Cannot reply to this ticket")
            }
            if(isTicketResolved){
                throw createHTTPError.Forbidden("Ticket is already resolved.Cannot reply  to this ticket")
            }

            // * Create New Message
            const newMessage = await messageModel.create({
                message,
                senderID,
                ticketID: existingTicket._id
            })

            // existingTicket.latestMessage = newMessage._id

            const isFirstReply = existingTicket.firstReplyAt ? false : true
            console.log("isFirstReply" ,isFirstReply)
            if(isFirstReply){
                existingTicket.firstReplyAt = Date.now() 
            }
            await existingTicket.save()

            res.json({
                message: "Message send successfully",
                data: newMessage
            })
        }
    }
    catch (err) {
        next(err)
    }
}


module.exports = {
    getAllMessages,
    sendMessage_USER,
    sendMessage_ADMIN_MEMBER
}
