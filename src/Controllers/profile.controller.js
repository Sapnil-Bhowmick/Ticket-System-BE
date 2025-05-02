const createHTTPError = require("http-errors")
const { validateAdminProfileEditData } = require("../Services/profile.service")
const { adminModel, memberModel } = require("../Models/index.js")


// const edit_profile = async (req, res, next) => {
//     try {
//         validateAdminProfileEditData(req)

//         const { userID, isMember } = req.LoggedIn_UserInfo
//         const { emailID, password, confirmPassword } = req.body

//         if (isMember) throw createHTTPError.Forbidden("Only admin can edit profile")

//         if (emailID) {
//             const existingMember = await memberModel.findOne({ emailID: emailID.toLowerCase() })
//             const existingAdmin = await adminModel.findOne({ emailID: emailID.toLowerCase() })
//             if (existingMember || existingAdmin) {
//                 throw createHTTPError.Conflict("EmailID is already taken")
//             }

//         }


//         // * Updating Admin Profile
//         let adminProfile = await adminModel.findById(userID)
//         const hashedPassword = await adminProfile.hashPassword(password)
//         if (password !== confirmPassword) throw createHTTPError.BadRequest("Password and Confirm Password do not match")

//         Object.keys(req.body).forEach((key) => adminProfile[key] = req.body[key])

//         adminProfile.password = hashedPassword
//         adminProfile = await adminProfile.save()

//         const teamMembers = await memberModel.find({ adminID: userID })
//         // console.log("MEMBERS" , teamMembers)
//         // * Update all team member password under the admin
//         const updatePromises = teamMembers.map((member) => {
//             return memberModel.findByIdAndUpdate(
//                 member._id,
//                 { password: hashedPassword },
//                 { new: true }
//             )
//         })

//         const updatedMembers = await Promise.all(updatePromises)
//         console.log("updated members info", updatedMembers)

//         return res.json({
//             message: "Profile Update Successfully",
//             data: adminProfile
//         })

//     }
//     catch (err) {
//         next(err)
//     }
// }


const edit_admin_member = async (req, res, next) => {
    try {
        validateAdminProfileEditData(req)

        // console.log("In edit_admin_member" , req.body)

        const { userID, isMember } = req.LoggedIn_UserInfo
        const { firstName, lastName, emailID, password } = req.body

        let hashedPassword

        if (emailID) {
            const existingMember = await memberModel.findOne({ emailID: emailID.toLowerCase() })
            const existingAdmin = await adminModel.findOne({ emailID: emailID.toLowerCase() })
            if (existingMember || existingAdmin) {
                // console.log("Email exists already")
                throw createHTTPError.Conflict("EmailID is already taken")
            }

        }

        // console.log('Is Member' , isMember)

        if (isMember) {
            let existingMember = await memberModel.findById(userID)
            if (!existingMember) throw createHTTPError.NotFound("Member doesn't exist")
            
            if(firstName) {
                existingMember.userName = firstName
            } 

            if(lastName){
                existingMember.userName = lastName
            }

            if(firstName && lastName){
                existingMember.userName = `${firstName} ${lastName}`
            }

            if(emailID){
                // console.log("emailID" , emailID)
                existingMember.emailID = emailID
            }

            if (password) {
                hashedPassword = await existingMember.hashPassword(password)
                existingMember.password = hashedPassword
            }

            existingMember = await existingMember.save()

            // console.log("Updated Member Info")

            return res.json({
                message: "Profile Update Successfully",
                data: existingMember
            })

        } else {
            let existingAdmin = await adminModel.findById(userID)
            if (!existingAdmin) throw createHTTPError.NotFound("Admin doesn't exist")

            Object.keys(req.body).forEach((key) => existingAdmin[key] = req.body[key])

            if (password) {
                hashedPassword = await existingAdmin.hashPassword(password)
                existingAdmin.password = hashedPassword
            }

            existingAdmin = await existingAdmin.save()

            const teamMembers = await memberModel.find({ adminID: userID })
            // console.log("MEMBERS" , teamMembers)
            // * Update all team member password under the admin
            const updatePromises = teamMembers.map((member) => {
                return memberModel.findByIdAndUpdate(
                    member._id,
                    { password: hashedPassword },
                    { new: true }
                )
            })

            const updatedMembers = await Promise.all(updatePromises)
            // console.log("updated Admin info", updatedMembers)

            return res.json({
                message: "Profile Update Successfully",
                data: existingAdmin
            })
        }
    }
    catch (err) {
        next(err)
    }
}


module.exports = {
    // edit_profile,
    edit_admin_member
}