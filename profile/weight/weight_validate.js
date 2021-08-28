const { body } = require('express-validator')




const weightCreateValidationRules = () => {
  return [
    body('weight')
      .trim()
      .not()
      .isEmpty()
      .toFloat()
      .isFloat({min:0}),
      body('date')
      .optional()
      .custom((date) => {
        return (new Date(date) !== "Invalid Date") && !isNaN(new Date(date));
      }),
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