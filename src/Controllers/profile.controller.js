const createHTTPError = require("http-errors")
const { validateAdminProfileEditData } = require("../Services/profile.service")
const { adminModel, memberModel } = require("../Models/index.js")


const edit_profile = async (req, res, next) => {
    try {
        validateAdminProfileEditData(req)

        const { userID, isMember } = req.LoggedIn_UserInfo
        const { emailID , password, confirmPassword } = req.body

        if (isMember) throw createHTTPError.Forbidden("Only admin can edit profile")

        if (emailID) {
            const existingMember = await memberModel.findOne({ emailID: emailID.toLowerCase() })
            const existingAdmin = await adminModel.findOne({ emailID: emailID.toLowerCase() })
            if (existingMember || existingAdmin) {
                throw createHTTPError.Conflict("EmailID is already taken")
            }

        }


        // * Updating Admin Profile
        let adminProfile = await adminModel.findById(userID)
        const hashedPassword = await adminProfile.hashPassword(password)
        if (password !== confirmPassword) throw createHTTPError.BadRequest("Password and Confirm Password do not match")

        Object.keys(req.body).forEach((key) => adminProfile[key] = req.body[key])
        
        adminProfile.password = hashedPassword
        adminProfile = await adminProfile.save()

        const teamMembers = await memberModel.find({adminID: userID})
        // console.log("MEMBERS" , teamMembers)
        // * Update all team member password under the admin
        const updatePromises = teamMembers.map((member) => {
            return memberModel.findByIdAndUpdate(
                member._id ,
                {password: hashedPassword},
                {new: true}
            )
        }) 

        const updatedMembers = await Promise.all(updatePromises)
        console.log("updated members info", updatedMembers)

        return res.json({
            message: "Profile Update Successfully",
            data: adminProfile
        })

    }
    catch (err) {
        next(err)
    }
}


module.exports = {
    edit_profile
}