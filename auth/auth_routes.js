const express = require('express');
const { validate} = require('../middleware/validate')
const {userValidationRules} = require('./user_validate')

const authController = require('./auth_controller.js');

const router = express.Router();

router.put(
  '/signup',
  userValidationRules(),
  validate,
  authController.signup
);

router.post('/login', authController.login);

module.exports = router;
