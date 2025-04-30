const { customizationModel } = require("../Models/index.js")
const { validateCustomizationInput } = require("../Services/customization.service.js")
const { flattenObject } = require("../utils/flatten.js")


const customize = async (req, res, next) => {
    try {
        validateCustomizationInput(req)
        const { customizationID } = req.params

        const flattenedBody = flattenObject(req.body);

        // ! ---------------- Problem Facing ----------------------
        // * Mongoose replaces entire nested objects rather than deeply merging them.
        // * So if I update only one field inside a nested object, Mongoose treats the 
        // * entire object as replaced — and if parts are missing, default values are reinserted.

        // * Mongoose does not perform deep merging of 
        // * nested objects even with $set unless the paths are explicitly specified in dot notation.

        // ! ---------------- Solution ----------------------
        // * Hence,  we need to deeply flatten the req.body into dot notation 
        // * Example -> {
        // *     "color.header": "#000000"
        // *  }

        const updatedDoc = await customizationModel.findByIdAndUpdate(
        customizationID,
        { $set: flattenedBody },
        {
            new: true,             // Return the updated doc
            runValidators: true,   // Enforce schema validators
        }
    );

    res.json({
        message: "Customizations Updated Successfully",
        data: updatedDoc
    })

}
    catch (err) {
    next(err)
}
}


const getCustomizations = async (req, res, next) => {
    try {
        let existingCustmizationDocs = await customizationModel.find({})
        if (existingCustmizationDocs.length === 0) {
            let newCustomizationDoc = new customizationModel()
            newCustomizationDoc = await newCustomizationDoc.save()
            return res.json({
                message: "Fetched Customizations Data Successfully",
                data: newCustomizationDoc
            })
        }

        return res.json({
            message: "Fetched Customizations Data Successfully",
            data: existingCustmizationDocs[0]
        })

    }
    catch (err) {
        next(err)
    }
}


module.exports = {
    customize,
    getCustomizations
}