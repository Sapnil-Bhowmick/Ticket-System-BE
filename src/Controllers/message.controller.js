const createHTTPError = require("http-errors")
const schedule = require("node-schedule");
const { ticketModel, adminModel, messageModel, customizationModel } = require("../Models/index.js")
const { getTimeInMinutes } = require("../Services/message.service.js")



const getAllMessages_ByTicket = async (req, res, next) => {
    try {
        const { ticketID } = req.params
        console.log("ticketID", ticketID)
        const { userID } = req.LoggedIn_UserInfo

        if (!ticketID) throw createHTTPError.BadRequest("TicketID is required")

        const existingTicket = await ticketModel.findById(ticketID)
        if (!existingTicket) {
            throw createHTTPError.NotFound("Ticket Not Found")
        } else {
            const isTicketAssignedToMe = existingTicket.assignID.equals(userID)
            if (!isTicketAssignedToMe) {
                throw createHTTPError.Forbidden("Ticket is not assigned to you.Cannot view messages")
            }
        }

        const messages = await messageModel.find({ ticketID }).populate([
            {
                path: "ticketID"
            },
            {
                path: "senderID",
                select: "-password"
            }
        ]).sort({ createdAt: 1 });  // for ascending (oldest to newest)

        res.json({
            message: "Fetched Messages Successfully",
            data: messages
        })

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

        const customizationDoc = await customizationModel.find({})
        // * DEfault time is 1hr
        let MISS_TIMEOUT_MINUTES = 60
        if (customizationDoc.length !== 0) {
            MISS_TIMEOUT_MINUTES = getTimeInMinutes(customizationDoc[0].missedChatDuration)
        } 

        console.log("MISS_TIMEOUT_MINUTES" , MISS_TIMEOUT_MINUTES)

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
                assignID: defaultAdmin[0]._id,
                schemaType: "Admin"
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
            ticketID: ticket._id,
            schemaType: "User"
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
        const { userID: senderID , isMember} = req.LoggedIn_UserInfo
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
            if (isTicketResolved) {
                throw createHTTPError.Forbidden("Ticket is already resolved.Cannot reply  to this ticket")
            }

            // * Create New Message
            const newMessage = await messageModel.create({
                message,
                senderID,
                ticketID: existingTicket._id,
                schemaType: isMember ? "TeamMember" : "Admin"
            })

            // existingTicket.latestMessage = newMessage._id

            const isFirstReply = existingTicket.firstReplyAt ? false : true
            console.log("isFirstReply", isFirstReply)
            if (isFirstReply) {
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
    getAllMessages_ByTicket,
    sendMessage_USER,
    sendMessage_ADMIN_MEMBER
}
