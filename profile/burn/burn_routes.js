const express = require('express');

const { validate } = require('../../middleware/validate')
const {burnCreateValidationRules , burnEditValidationRules} = require('./burn_validate')
const {dayParamValidationRules} = require('../day_validate')
const burnController = require('./burn_controller');
const isAuth = require('../../middleware/is-auth');

const router = express.Router();

router.post('/add',
    isAuth,
    burnCreateValidationRules(),
    validate,
    burnController.createBurn)

router.get('/:burnId',
    isAuth,
    burnController.getBurn)

router.get('/day/:date',
    isAuth,
    dayParamValidationRules(),
    validate,
    burnController.getDayBurn)

router.put('/:burnId',
    isAuth,
    burnEditValidationRules(),
    validate,
    burnController.editBurn)

router.delete('/:burnId',
    isAuth,
    burnController.deleteBurn)



module.exports = router;
