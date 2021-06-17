const { body, validationResult, param } = require('express-validator')
const User = require('../auth/user')


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
  
  
  module.exports = {
    userValidationRules
  }
  