const { memberModel, adminModel } = require("../Models/index.js")
const {
    validateMemberCredentials,
    validateMemberProfileData
} = require("../Services/member.service")
const createHTTPError = require("http-errors")



const getAllMembers = async (req, res, next) => {
    try {
        const { userID, isMember } = req.LoggedIn_UserInfo

        if (isMember) throw createHTTPError.Forbidden("Only admin can view team members")
        const teamMembers = await memberModel.find({ adminID: userID })
            .select("userName emailID phone role profilePic adminID")

        return res.json({
            message: "Team Members fetched Successfully",
            data: teamMembers
        })
    }
    catch (err) {
        next(err)
    }
}



const addMember = async (req, res, next) => {
    try {
        validateMemberCredentials(req)

        const { userName, emailID, role } = req.body
        const { userID, isMember } = req.LoggedIn_UserInfo

        const existingMember = await memberModel.findOne({ emailID: emailID.toLowerCase() })
        const existingAdmin = await adminModel.findOne({ emailID: emailID.toLowerCase() })
        if (existingMember || existingAdmin) {
            throw createHTTPError.Conflict("EmailID already exists")
        } else {
            // * Only default admin can add member
            const admin = await adminModel.findById(userID)
            if (!admin) {
                throw createHTTPError.NotFound("You are not an Admin")
            }
            let newMember = new memberModel({
                userName,
                emailID,
                password: admin.password,
                role,
                adminID: userID
            })

            newMember = await newMember.save()

            // * Populate the adminID reference with admin data
            // * Remove passwords
            newMember = await memberModel.findById(newMember._id)
                .select("-password")
                .populate({ path: "adminID", select: "-password" })

            return res.json({
                message: "Team Member added successfully",
                data: newMember
            })
        }

    }
    catch (err) {
        next(err)
    }
}


const editMember = async (req, res, next) => {
    try {
        validateMemberProfileData(req)

        const { userID, isMember } = req.LoggedIn_UserInfo
        const { memberID } = req.query
        const existingAdmin = await adminModel.findById(userID)
        // * Only admin can update member profile
        if (!isMember && existingAdmin) {
            let member = await memberModel.findById(memberID).select("-password")
            if (!member) {
                throw createHTTPError.NotFound("Member not found")
            } else {
                // * EmailID should not be of member or admin
                if (req.body.emailID) {
                    const member = await memberModel.findOne({ emailID: req.body.emailID.toLowerCase() })
                    const admin = await adminModel.findOne({ emailID: req.body.emailID.toLowerCase() })
                    if (member || admin) throw createHTTPError.Conflict("EmailID is already taken")
                }

                Object.keys(req.body).forEach((key) => member[key] = req.body[key])
                member = await member.save()

                return res.json({
                    message: "Member Edited Successfully",
                    data: member
                })
            }
        } else {
            throw createHTTPError.Forbidden("You are not authorized to update member profile")
        }


    }
    catch (err) {
        next(err)
    }
}


const deleteMember = async (req, res, next) => {
    try {
        const { memberID } = req.query
        const { userID, isMember } = req.LoggedIn_UserInfo

        console.log("memberID" , memberID)

        if (isMember) throw createHTTPError.Forbidden("Only admins are authorized to delete team members.")

        const existingMember = await memberModel.findById(memberID)
        if (!existingMember) {
            throw createHTTPError.NotFound("Member doesn't exist")
        }

        const deletedMember = await memberModel.findByIdAndDelete(memberID).select("-password")

        return res.json({
            message: "Member deleted Successfully",
            data: deletedMember
        })

    }
    catch (err) {
        next(err)
    }
}


module.exports = {
    getAllMembers,
    addMember,
    editMember,
    deleteMember
}