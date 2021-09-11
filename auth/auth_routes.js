const express = require('express');
const { validate} = require('../middleware/validate')
const {userValidationRules} = require('./user_validate')
const isAuth = require('../middleware/is-auth');

const authController = require('./auth_controller.js');

const router = express.Router();

router.post(
  '/signup',
  userValidationRules(),
  validate,
  authController.signup
);

router.post('/login', authController.login);


router.post('/changepassword',isAuth , authController.changePassword);

module.exports = router;
