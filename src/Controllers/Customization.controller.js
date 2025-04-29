const {customizationModel} = require("../Models/index.js")
const { validateCustomizationInput } = require("../Services/customization.service.js")


const customize = async(req,res,next) => {
    try{
        validateCustomizationInput(req)
        const {customizationID} = req.params

        const updatedDoc = await customizationModel.findByIdAndUpdate(
            customizationID,
            req.body,
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
    catch(err){
        next(err)
    }
}


const getCustomizations = async(req,res,next) => {
    try{
        let existingCustmizationDocs = await customizationModel.find({})
        if(existingCustmizationDocs.length === 0){
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
    catch(err){
        next(err)
    }
}


module.exports = {
    customize ,
    getCustomizations
}