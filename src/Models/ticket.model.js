const mongoose = require("mongoose");
const {ObjectId} = mongoose.Schema.Types

const ticketSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },

//   ticketDate: {
//     type: String,
//     required: true,
//     default: () => {
//       const now = new Date();
//       return `${now.getFullYear()}-0${now.getDate()}${now.getMonth() + 1}`;
//     },
//   },

//   ticketNo: {
//     type: Number,
//     unique: true,
//   },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  creatorID: {
    type: ObjectId,
    ref: "User",
    required: true,
  },

  assignID: {
    type: ObjectId,
    ref: "Admin",
    required: true,
  },

  assignType: {
    type: String,
    enum: ["ADMIN" , "MEMBER"],
    default: "ADMIN"
  },

  latestMessage: {
    type: ObjectId,
    ref: "Message",
  },

  isMissed: {
    type: Boolean,
    default: false,
  },

  status: {
    type: String,
    enum: ["Resolved", "UnResolved"],
    default: "UnResolved",
  },

  firstReplyAt: {
    type: Date,
    default: null,
  },
});




const ticketModel = mongoose.model( "Ticket" , ticketSchema)

module.exports = ticketModel
