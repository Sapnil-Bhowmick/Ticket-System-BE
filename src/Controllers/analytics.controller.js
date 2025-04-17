const createHTTPError = require("http-errors")

const getMetrics = (req,res,next) => {
    try{
        throw createHTTPError.Conflict("Resource Conflict Occured")
    }
    catch(err){
        next(err)
    }
}

module.exports = {
    getMetrics
}