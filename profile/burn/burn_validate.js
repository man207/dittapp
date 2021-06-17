const { body } = require('express-validator')




const burnCreateValidationRules = () => {
  return [
    body('activity')
      .trim()
      .not()
      .isEmpty(),
    body('minutes')
      .trim()
      .not()
      .isEmpty()
      .isFloat(),
    body('date')
      .optional()
      .isDate(),
  ]
}

const burnEditValidationRules = () => {
  return [
    body('minutes')
      .optional()
      .trim()
      .not()
      .isEmpty()
      .isFloat()
  ]
}


module.exports = {
  burnCreateValidationRules,
  burnEditValidationRules
}