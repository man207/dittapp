const express = require('express');

const { validate } = require('../../middleware/validate')
const {weightCreateValidationRules , weightEditValidationRules} = require('./weight_validate')
const {dayParamValidationRules} = require('../day_validate')
const weightController = require('./weight_controller');
const isAuth = require('../../middleware/is-auth');

const router = express.Router();

// change to new???
router.post('/add',
    isAuth,
    weightCreateValidationRules(),
    validate,
    weightController.createWeight)
    
router.get('/day',
    isAuth,
    dayParamValidationRules(),
    validate,
    weightController.getLatestWeight)

router.get('/:weightId',
    isAuth,
    weightController.getWeight)


router.put('/:weightId',
    isAuth,
    weightEditValidationRules(),
    validate,
    weightController.editWeight)

router.delete('/:weightId',
    isAuth,
    weightController.deleteWeight)


module.exports = router;
