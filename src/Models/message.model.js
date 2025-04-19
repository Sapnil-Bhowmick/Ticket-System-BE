const mongoose = require("mongoose");
const {ObjectId} = mongoose.Schema.Types

const messageSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
  },

  senderID: {
    type: ObjectId,
    ref: "User",
    required: true,
  },

  ticketID: {
    type: ObjectId,
    ref: "Ticket",
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});



const messageModel = mongoose.model("Message", messageSchema);


module.exports = messageModel;
