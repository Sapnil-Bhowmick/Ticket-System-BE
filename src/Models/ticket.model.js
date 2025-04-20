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
    refPath: 'assignType',  // ← dynamic reference of either Admin or Member schema
    required: true,
  },

  // schemaType: {
  //   type: String,
  //   required: true,
  //   enum: ['Admin', 'TeamMember'] 
  // },

  assignType: {
    type: String,
    enum: ["Admin" , "TeamMember"],
    default: "Admin"
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
