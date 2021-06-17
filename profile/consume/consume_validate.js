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
      .isFloat(),
    body('serving')
      .optional()
      .isBoolean(),
    body('date')
      .optional()
      .isDate(),
  ]
}

const consumeEditValidationRules = () => {
  return [
    body('amount')
      .optional()
      .trim()
      .not()
      .isEmpty()
      .isFloat(),
    body('serving')
      .optional()
      .isBoolean()
  ]
}


module.exports = {
  consumeCreateValidationRules,
  consumeEditValidationRules
}