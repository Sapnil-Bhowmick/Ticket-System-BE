
const validator = require("validator"); // for email & length validation
const createHTTPError = require("http-errors"); 

const validateCustomizationInput = (req) => {
  const { color, welcomeMessage, formPlaceholders, missedChatDuration } = req.body;

  // Validate color fields
  if (color) {
    if (color.header && !validator.isHexColor(color.header)) {
      throw createHTTPError.BadRequest("Header color must be a valid hex code");
    }
    if (color.background && !validator.isHexColor(color.background)) {
      throw createHTTPError.BadRequest("Background color must be a valid hex code");
    }
  }

  // Validate welcome message fields
  if (welcomeMessage) {
    if (welcomeMessage.prompt_message_1 && !validator.isLength(welcomeMessage.prompt_message_1, { min: 1, max: 50 })) {
      throw createHTTPError.BadRequest("Prompt message 1 should be between 1 and 50 characters");
    }
    if (welcomeMessage.prompt_message_2 && !validator.isLength(welcomeMessage.prompt_message_2, { min: 1, max: 50 })) {
      throw createHTTPError.BadRequest("Prompt message 2 should be between 1 and 50 characters");
    }
    if (welcomeMessage.welcome_message && !validator.isLength(welcomeMessage.welcome_message, { min: 1, max: 100 })) {
      throw createHTTPError.BadRequest("Welcome message should be between 1 and 100 characters");
    }
  }

  // Validate form placeholders
  if (formPlaceholders) {
    if (formPlaceholders.name && !validator.isLength(formPlaceholders.name, { min: 1, max: 20 })) {
      throw createHTTPError.BadRequest("Name placeholder should be between 1 and 20 characters");
    }
    if (formPlaceholders.phone && !validator.isLength(formPlaceholders.phone, { min: 1, max: 20 })) {
      throw createHTTPError.BadRequest("Phone placeholder should be between 1 and 20 characters");
    }
    if (formPlaceholders.email && !validator.isLength(formPlaceholders.email, { min: 1, max: 20 })) {
      throw createHTTPError.BadRequest("Email placeholder should be between 1 and 20 characters");
    }
  }

  // Validate missedChatDuration fields
  if (missedChatDuration) {
    if (missedChatDuration.hours && (missedChatDuration.hours < 0 || missedChatDuration.hours > 24)) {
      throw createHTTPError.BadRequest("Missed chat hours must be between 0 and 24");
    }
    if (missedChatDuration.minutes && (missedChatDuration.minutes < 0 || missedChatDuration.minutes > 60)) {
      throw createHTTPError.BadRequest("Missed chat minutes must be between 0 and 60");
    }
    if (missedChatDuration.seconds && (missedChatDuration.seconds < 0 || missedChatDuration.seconds > 60)) {
      throw createHTTPError.BadRequest("Missed chat seconds must be between 0 and 60");
    }
  }
};



module.exports = {
    validateCustomizationInput
};


// * ------------------- Request Body -------------------------

// {
//     color: {
//         header: 
//         background
//     } ,

//     welcomeMessage: {
//         prompt_message_1: 
//         prompt_message_2: 
//         welcome_message
//     } ,

//     formPlaceholders: {
//         name: ,
//         phone: ,
//         email: 
//     } , 

//     missedChatDuration: {
//         hours: ,
//         minuetes: ,
//         seconds: 
//     }
 
// }