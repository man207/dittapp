const { body } = require('express-validator')




const activityCreateValidationRules = () => {
    return [
      body('name')
      .trim()
      .not()
      .isEmpty()
      .isLength({max: 20}),
      body('desc')
      .trim()
      .not()
      .isEmpty()
      .isLength({max: 50}),
      body('caloriePerMinute')
      .trim()
      .not()
      .isEmpty()
      .min(0),
      body('public')
      .optional()
      .isBoolean(),
    ]
  }

const activityEditValidationRules = () => {
    return [
      body('name')
      .optional()
      .trim()
      .not()
      .isEmpty()
      .isLength({max: 20}),
      body('desc')
      .optional()
      .trim()
      .not()
      .isEmpty()
      .isLength({max: 50}),
      body('caloriePerMinute')
      .optional()
      .trim()
      .not()
      .isEmpty()
      .min(0),
      body('public')
      .optional()
      .isBoolean(),
    ]
  }
  
  module.exports = {
    activityCreateValidationRules,
    activityEditValidationRules
  }