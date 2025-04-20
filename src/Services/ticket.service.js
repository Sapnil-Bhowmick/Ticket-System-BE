const createHTTPError = require("http-errors")

const validateStatus = (req) => {
    const { status } = req.params
    const {ticketID} = req.body
    if (!status) createHTTPError.BadRequest("Status Value is Required")
    if (!ticketID) createHTTPError.BadRequest("TicketID is Required")

    const allowedStatus = ["Resolved", "UnResolved"]
    if (!allowedStatus.includes(status)) throw createHTTPError.BadRequest("Please provide a valid Status type")
}


const validateGetTicketsByStatusData = (req) => {
    const { status } = req.params
    if (!status) createHTTPError.BadRequest("Status Value is Required")

    const allowedStatus = ["Resolved", "UnResolved"]
    if (!allowedStatus.includes(status)) throw createHTTPError.BadRequest("Please provide a valid Status type")
}

module.exports = {
    validateStatus,
    validateGetTicketsByStatusData
}