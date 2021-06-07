const express = require('express');
const { mealVaidationRules, dayParamValidationRules , mealParamVaidationRules , validate } = require('../middleware/validate');

const mainController = require('../controllers/day');
const isAuth = require('../middleware/is-auth');


const router = express.Router();

router.get('/:date', isAuth, dayParamValidationRules(), validate, mainController.getDay)
//outer.post('/:date', isAuth, dayValidationRules(), validate, mainController.createDay)
router.put('/:date/:meal', isAuth, dayParamValidationRules(), mealVaidationRules(), mealParamVaidationRules(), validate, mainController.updateMeal)
router.get('/:date/:meal', isAuth, dayParamValidationRules(), mealParamVaidationRules(), validate, mainController.getMeal)

module.exports = router;
