const createHTTPError = require("http-errors")
const { userModel, ticketModel } = require("../Models/index.js")

const getMetrics = async(req,res,next) => {
    try{
        // 
        const totalChats = await userModel.countDocuments()
        const totalTickets = await ticketModel.countDocuments()
        const totalResolvedTickets = await ticketModel.countDocuments({status: "Resolved"})

        // * Average Reply Time
        let sumReplyTime = 0 , repliedticketsCount = 0
        let avgReplyTimeInSeconds = 0
        const tickets = await ticketModel.find({})
        // console.log("tickets" , tickets)
        if(tickets.length !== 0){
            tickets.forEach((ticket) => {
                if(ticket.firstReplyAt && ticket.createdAt){
                    // * ReplyTime in milliseconds
                    const replyTime = new Date(ticket.firstReplyAt) - new Date(ticket.createdAt) 
                    sumReplyTime = sumReplyTime + replyTime
                    repliedticketsCount++
                }
            })

            const avgReplyTimeinMs = repliedticketsCount > 0 ? sumReplyTime / repliedticketsCount : 0
            avgReplyTimeInSeconds = Math.round(avgReplyTimeinMs / 1000); // convert ms to seconds
            console.log("avgReplyTimeInSeconds" , avgReplyTimeInSeconds)
        }

        // *  Missed chats per week
        const missedChatsPerWeek = await ticketModel.aggregate([
            { $match: { isMissed: true } },
            { 
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        week: { $isoWeek: "$createdAt" }
                    },
                    missedCount: { $sum: 1 }
                }
            },
            {
                $sort: {
                    "_id.year": 1,
                    "_id.week": 1
                }
            }
        ])

        const chartData = missedChatsPerWeek.map((entry) => {
            const { year, week } = entry._id;
            return {
                label: `Week ${week} - ${year}`,
                week: `${week}`,
                year: `${year}`,
                missedChats: entry.missedCount
            };
        })

        res.json({
            message: "Fetched Analytics Data Successfully",
            data: {
                totalChats,
                totalTickets,
                totalResolvedTickets,
                avgReplyTimeInSeconds,
                missedChat_DataPoints: chartData
            }
        })
        
    }
    catch(err){
        next(err)
    }
}

module.exports = {
    getMetrics
}