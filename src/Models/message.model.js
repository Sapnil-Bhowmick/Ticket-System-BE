const mongoose = require("mongoose");
const {ObjectId} = mongoose.Schema.Types

const messageSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
  },

  senderID: {
    type: ObjectId,
    refPath: 'schemaType',  // ← dynamic reference of either Admin or TeamMember schema or User
    required: true,
  },

  schemaType: {
    type: String,
    enum: ["Admin" , "TeamMember" , "User"]
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
