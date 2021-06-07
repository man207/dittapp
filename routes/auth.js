const express = require('express');
const {userValidationRules , validate} = require('../middleware/validate')

const authController = require('../controllers/auth');

const router = express.Router();

router.put(
  '/signup',
  userValidationRules(),
  validate,
  authController.signup
);

router.post('/login', authController.login);

module.exports = router;
