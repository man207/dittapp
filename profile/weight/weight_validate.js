const { body } = require('express-validator')




const weightCreateValidationRules = () => {
  return [
    body('activity')
      .trim()
      .not()
      .isEmpty(),
    body('weight')
      .trim()
      .not()
      .isEmpty()
      .toFloat()
      .isFloat({min:0}),
    body('date')
      .optional()
      .isDate(),
  ]
}

const weightEditValidationRules = () => {
  return [
    body('weight')
      .optional()
      .trim()
      .not()
      .isEmpty()
      .toFloat()
      .isFloat()
  ]
}


module.exports = {
  weightCreateValidationRules,
  weightEditValidationRules
}