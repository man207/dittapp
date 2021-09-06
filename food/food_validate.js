const { body, validationResult, param } = require('express-validator')
const User = require('../auth/user')







const foodCreateValidationRules = () => {
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
      body('carb')
      .toFloat()
      .isFloat({min:0}),
      body('protein')
      .toFloat()
      .isFloat({min:0}),
      body('fat')
      .toFloat()
      .isFloat({min:0}),
      body('unit')
      .trim()
      .not()
      .isEmpty()
      .isString()
      .custom( value => {
         if (!['gr' , 'ml'].includes(value)) {
          throw new Error('unit should be either Gram (gr) or Mililiter (ml)');
         }
         return true
      }),
      body('calorie')
      .toFloat()
      .isFloat()
      .custom( (value, {req}) => { // calories can be higher than sum of macros but not vice versa
        let expectedCaloire = (req.body.carb * 4 + req.body.fat * 9 + req.body.protein * 4);
        let CurrentCalorie = value
        if ((expectedCaloire * 0.95) > CurrentCalorie) {
          throw new Error('Calories and Macros do not match');
        }
        return true
      }),

      body('serving') //TODO: these might need more work
      .custom( (value, {req}) => {
        if (!value) {
          throw new Error('There Has to be a main serving');
        }
        if (!value.units) {
          throw new Error('Serving has no units');
        }
        return true;
      }),
      
    ]
  }


  const foodEditValidationRules = () => {
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
      body('carb')
      .optional()
      .toFloat()
      .isFloat({min:0}),
      body('protein')
      .optional()
      .toFloat()
      .isFloat({min:0}),
      body('fat')
      .optional()
      .toFloat()
      .isFloat({min:0}),
      body('unit')
      .optional()
      .trim()
      .not()
      .isEmpty()
      .isString()
      .custom( value => {
         if (!['gr' , 'ml'].includes(value)) {
          throw new Error('unit should be either Gram (gr) or Mililiter (ml)');
         }
         return true
      }),
      body('calorie')
      .toFloat()
      .isFloat()
      .custom( (value, {req}) => { // calories can be higher than sum of macros but not vice versa
        let expectedCaloire = (req.body.carb * 4 + req.body.fat * 9 + req.body.protein * 4);
        let CurrentCalorie = value
        if ((expectedCaloire * 0.95) > CurrentCalorie) {
          throw new Error('Calories and Macros do not match');
        }
        return true
      }),

      body('serving') //TODO: these might need more work
      .optional()
      .custom( (value, {req}) => {
        if (!value) {
          throw new Error('There Has to be a main serving');
        }
        if (!value.units) {
          throw new Error('Serving has no units');
        }
        
        return true;
      })
      .custom( (value, {req}) => {
        if ((req.body.carb + req.body.fat + req.body.protein) > value) {
          throw new Error('the serving size is less than sum of macros');
        }
        return true;
      })
    ]
  }

  module.exports = {
    foodCreateValidationRules,
    foodEditValidationRules
  }
  