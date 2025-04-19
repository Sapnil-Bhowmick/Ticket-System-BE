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



const sendMessage = async (req, res, next) => {
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
            schedule.scheduleJob(Date.now() + MISS_TIMEOUT_MINUTES * 60 * 1000 , async() => {
                const newTicketCreated = await ticketModel.findById(ticket._id)
                // console.log("Running after 1 min" , newTicketCreated)
                if(newTicketCreated && !newTicketCreated.firstReplyAt){
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


module.exports = {
    getAllMessages,
    sendMessage
}
