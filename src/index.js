
const app = require("./app.js")
const logger = require("./Config/logger.config.js")
const Initialize_DB_Connection = require("./Config/dbConnection.config.js")
const createHttpError = require("http-errors")
const mongoose = require("mongoose")





//* ENV variables
const { MONGODB_CONNECTION_URI } = process.env
const port = process.env.PORT || 8000


//* Initialize Database Connection
let server
Initialize_DB_Connection(MONGODB_CONNECTION_URI)
    .then(() => {
        logger.info("Database Connection Eshtablished Successfully")
        server = app.listen(port, () => {
            logger.info(`Server listening on ${port}...`)
        })

    })
    .catch((err) => {
        logger.error(`Failed to Eshtablish database Connection : ${err.message}`)
        exitHandler()
    })





//* Set Mongoose Debugging mode in Development
// if (process.env.NODE_ENV !== "production") {
//     logger.info("Debugging Enabled")
//     mongoose.set("debug", true)
// }


// !----------------- Handling Unhandled Errors -----------------

const exitHandler = () => {
    if (server) {
        logger.info("Server Closed")
        process.exit(1)
    } else {
        process.exit(1)
    }
}


const unexpectedErrorHandler = (error) => {
    logger.error(error)
    exitHandler()
}

process.on("uncaughtException", unexpectedErrorHandler)
process.on("unhandledRejection", unexpectedErrorHandler)

process.on("SIGTERM", unexpectedErrorHandler)
