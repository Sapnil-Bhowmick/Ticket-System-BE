const express = require("express")
const memberRouter = express.Router()

const {
    getAllMembers,
    addNewTeamMember,
    editTeamMember,
    deleteTeamMember
} = require("../Controllers/member.controller.js")

const {userAuth} = require("../Middlewares/auth.middleware.js")

memberRouter.get("/all" , userAuth , getAllMembers)
memberRouter.post("/add" , userAuth , addNewTeamMember)
memberRouter.post("/edit" , userAuth , editTeamMember)
memberRouter.delete("/delete" , userAuth , deleteTeamMember)

module.exports = {
    memberRouter
}