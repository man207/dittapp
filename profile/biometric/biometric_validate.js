const { body } = require('express-validator')




const biometricCreateValidationRules = () => {
  return [
    body('height')
      .trim()
      .not()
      .isEmpty()
      .toFloat()
      .isFloat({ min: 0, max: 300 }),
    body('age')
      .toFloat()
      .isFloat({ min: 0 }),
    body('carb')
      .toFloat()
      .isFloat({ min: 0 }),
    body('protein')
      .toFloat()
      .isFloat({ min: 0 }),
    body('fat')
      .toFloat()
      .isFloat({ min: 0 }),
    body('calorie')
      .toFloat()
      .isFloat()
      .custom((value, { req }) => { // calories can be higher than sum of macros but not vice versa
        let expectedCaloire = (req.body.carb * 4 + req.body.fat * 9 + req.body.protein * 4);

        if ((expectedCaloire * 0.95) > value ) {
          throw new Error('Calories and Macros do not match');
        }
        return true
      }),
    body('male')
      .isBoolean(),
      body('weight')
      .trim()
      .not()
      .isEmpty()
      .toFloat()
      .isFloat({min:0}),
  ]
}


module.exports = {
  biometricCreateValidationRules,

}