const express = require("express")
const memberRouter = express.Router()

const {
    getAllMembers,
    addMember,
    editMember,
    deleteMember
} = require("../Controllers/member.controller.js")

const {userAuth} = require("../Middlewares/auth.middleware.js")

memberRouter.get("/all" , userAuth , getAllMembers)
memberRouter.post("/add" , userAuth , addMember)
memberRouter.post("/edit" , userAuth , editMember)
memberRouter.delete("/delete" , userAuth , deleteMember)

module.exports = {
    memberRouter
}