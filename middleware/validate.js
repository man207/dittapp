const { body, validationResult, param } = require('express-validator')
const User = require('../models/user')
const Day = require('../models/day')

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

const dayParamValidationRules = () => {
  return [
    param('date')
    .not()
    .isEmpty()
    .isString()
    .custom(value => {
      x = value.split('-').map(x => +x);
      if (!(x.length === 3)) {
        throw new Error('Date is not correct');
      }
      if (x.includes(NaN)) {
        throw new Error('dates must be numbers');
      }
      if (x[0] < 1370 || !Number.isInteger(x[0])) {  //the time is not correct (not bad tho)
        throw new Error('year is off');
      }
      if (x[1] < 1 || x[1] > 12 || !Number.isInteger(x[1]))  {  //the time is not correct (not bad tho)
        throw new Error('month is off');
      }
      if (x[2] < 1 || x[2] > 31 || !Number.isInteger(x[2])) {  //the time is not correct (not bad tho)
        throw new Error('day is off');
      }
      return true
    })
  ]
}

const mealParamVaidationRules = () => {
  return [
    param('meal')
    .not()
    .isEmpty()
    .isString()
    .custom( value => {
      if (!Object.keys(Day.schema.tree.meals).includes(value)) {
        throw Error('No such meal');
      }
      return true
    })
  ]
}

const mealVaidationRules = () => {
  return [
    body('food')
    .customSanitizer(value => {
      return value.map(x => x.food = Schema.Types.ObjectId(x.food) )
    })
  ]
}


module.exports = {
  mealVaidationRules,
  mealParamVaidationRules,
  dayParamValidationRules,
  foodDetailValidationRules,  
  userValidationRules,
  validate,
}
