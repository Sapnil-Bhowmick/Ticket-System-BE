
const mongoose = require("mongoose")

const Initialize_DB_Connection = async(connection_URL) => {
    await mongoose.connect(connection_URL , {dbName: "Ticket-System"})
}

module.exports = Initialize_DB_Connection