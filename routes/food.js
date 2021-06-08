const express = require('express');

const {foodDetailValidationRules , validate} = require('../middleware/validate')
const foodController = require('../controllers/food');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.post('/add', isAuth , foodDetailValidationRules() , validate, foodController.createFood)
router.get('/:foodId', isAuth , foodController.getFood)
router.put('/:foodId', isAuth, foodDetailValidationRules() , validate , foodController.editFood) //all of details should be passed as args
router.delete('/:foodId', isAuth , foodController.deleteFood)

module.exports = router;
