const { body, validationResult, param } = require('express-validator')
const User = require('../auth/user')

const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed.');
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  return next();
}


const userValidationRules = () => {
  return [
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email.')
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then(userDoc => {
          if (userDoc) {
            return Promise.reject('E-Mail address already exists!');
          }
        });
      })
      .normalizeEmail(),
    body('password')
      .trim()
      .isLength({ min: 5 }),
    body('firstName')
      .trim()
      .not()
      .isEmpty(),
    body('lastName')
      .trim()
      .not()
      .isEmpty()
  ]
}

const foodDetailValidationRules = () => {
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
    body('public')
    .optional()
    .isBoolean(),
    body('serving') //TODO: these might need more work
    .custom( (value, {req}) => {
      if (!value) {
        throw new Error('There Has to be a main serving');
      }
      if (!value.units) {
        throw new Error('Serving has no units');
      }
      if ((req.body.carb + req.body.fat + req.body.protein) > value.units) {
        throw new Error('the serving size is less than sum of macros');
      }
      return true;
    }),
    body('secondaryUnits') //TODO: these might need more work
    .custom( (value, {req}) => {
      if (!value) {
        return true;
      }
      value.forEach(element => {
        if (!element.name) {
          throw new Error('at least one of Secondary Units has no name');
        }
        if (!element.units) {
          throw new Error('at least one of Secondary Units has no units');
        }
      });
      return true;
    })
  ]
}


const activityDetailValidationRules = () => {
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
    body('desc')
    .trim()
    .not()
    .isEmpty()
    .isLength({max: 50}),
    body('public')
    .optional()
    .isBoolean(),
  ]
}




module.exports = {
  activityDetailValidationRules,
  foodDetailValidationRules,  
  userValidationRules,
  validate,
}
