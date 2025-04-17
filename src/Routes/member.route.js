const express = require("express")
const memberRouter = express.Router()

const {
    addMember,
    editMember,
    deleteMember
} = require("../Controllers/member.controller.js")

memberRouter.post("/add" , addMember)
memberRouter.post("/edit" , editMember)
memberRouter.delete("/delete" , deleteMember)

module.exports = {
    memberRouter
}