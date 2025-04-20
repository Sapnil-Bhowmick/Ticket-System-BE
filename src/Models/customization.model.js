const mongoose = require("mongoose")
const validator = require("validator")


const customizationSchema = new mongoose.Schema({
    color: {
        header: {
            type: String,
            default: "#33475B",
            validate: {
                validator: (val) => validator.isHexColor(val),
                message: "Header color must be a valid hex code"
            }
        },
        background: {
            type: String,
            default: "#EEEEEE",
            validate: {
                validator: (val) => validator.isHexColor(val),
                message: "Header color must be a valid hex code"
            }
        }
    },

    welcomeMessage: {
        prompt_message_1: {
            type: String,
            max: [50 , "Prompt message should be at max of 50 characters"],
            default: "How can I help you?"
        },
        prompt_message_2: {
            type: String,
            max: [50 , "Prompt message should be at max of 50 characters"],
            default: "Ask me anything!"
        },
        welcome_message: {
            type: String,
            max: [100 , "Welcome message should be at max of 100 characters"],
            default: "👋 Want to chat about Hubly? I'm a chatbot here to help you find your way."
        }
    },

    formPlaceholders: {
        name: {
            type: String,
            max: [20 , "Name placeholder should be at max of 20 characters"],
            default: "Your Name"
        },
        phone: {
            type: String,
            max: [20 , "Phone placeholder should be at max of 20 characters"],
            default: "Your Phone"
        },
        email: {
            type: String,
            max: [20 , "Email placeholder should be at max of 20 characters"],
            default: "Your Email"
        }
    },

    // * Default is 1 hr
    missedChatDuration: {
        hours: { type: Number, default: 0 , min: 0 , max: 24},
        minutes: { type: Number, default: 0 , min: 0 , max: 60},
        seconds: { type: Number, default: 0 , min: 0 , max: 60}
    }
})



const customizationModel = mongoose.model("Customization", customizationSchema)

module.exports = customizationModel