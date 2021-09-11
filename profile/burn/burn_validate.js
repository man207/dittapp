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
      .toFloat()
      .isFloat({min:0}),
      body('date')
      .optional()
      .custom((date) => {
        return (new Date(date) !== "Invalid Date") && !isNaN(new Date(date));
      }),
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