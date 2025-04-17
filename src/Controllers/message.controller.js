
const getAllMessages = (req,res,next) => {
    try{
        
    }
    catch(err){
        next(err)
    }
}



const sendMessage = (req,res,next) => {
    try{
        console.log(req.params)
    }
    catch(err){
        next(err)
    }
}


module.exports = {
    getAllMessages,
    sendMessage
}
