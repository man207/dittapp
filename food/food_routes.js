const express = require('express');

const {validate} = require('../middleware/validate')
const {foodCreateValidationRules, foodEditValidationRules} = require('./food_validate')

const foodController = require('./food_controller');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.post('/add',
            isAuth,
            foodCreateValidationRules(),
            validate,
            foodController.createFood)

router.get('/search/:foodname', 
            isAuth, 
            validate , 
            foodController.searchFood)


router.get('/deletefoodwarning/:foodId', 
            isAuth, 
            validate , 
            foodController.deleteFoodWarning)
            
router.get('/myfoods', 
                isAuth , 
                foodController.myFoods)
router.get('/:foodId', 
            isAuth , 
            foodController.getFood)


router.put('/:foodId', 
            isAuth, 
            foodEditValidationRules(), 
            validate , 
            foodController.editFood)


router.delete('/:foodId', 
            isAuth , 
            foodController.deleteFood)

module.exports = router;
