const express = require('express');

const {foodDetailValidationRules , validate} = require('../middleware/validate')
const foodController = require('../controllers/food');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

//router.get('/:foodId', isAuth , foodController.getFood)
router.post('/add', isAuth , foodDetailValidationRules() , validate, foodController.createFood)
router.put('/:foodId', foodDetailValidationRules() , validate , isAuth , foodController.editFood)
router.delete('/:foodId', isAuth , foodController.deleteFood)

module.exports = router;
