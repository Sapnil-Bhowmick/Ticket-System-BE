
const getAllTickets = (req,res,next) => {
    try{
        
    }
    catch(err){
        next(err)
    }
}


const getAllTickets_byStatus = (req,res,next) => {
    try{
        
    }
    catch(err){
        next(err)
    }
}


const setTicketStatus = (req,res,next) => {
    try{
        console.log(req.query)
        console.log(req.body)
    }
    catch(err){
        next(err)
    }
}




module.exports = {
    getAllTickets,
    getAllTickets_byStatus,
    setTicketStatus
}