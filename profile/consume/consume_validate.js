const { body } = require('express-validator')




const consumeCreateValidationRules = () => {
  return [
    body('food')
      .trim()
      .not()
      .isEmpty(),
    body('amount')
      .trim()
      .not()
      .isEmpty()
      .isFloat({min: 0 }),
    body('serving')
      .optional()
      .isBoolean(),
    body('date')
      .optional()
      .custom((date) => {
        return (new Date(date) !== "Invalid Date") && !isNaN(new Date(date));
      }),
  ]
}

const consumeEditValidationRules = () => {
  return [
    body('amount')
      .optional()
      .trim()
      .not()
      .isEmpty()
      .isFloat({min: 0 }),
    body('serving')
      .optional()
      .isBoolean()
  ]
}


module.exports = {
  consumeCreateValidationRules,
  consumeEditValidationRules
}