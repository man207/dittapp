const express = require('express');

const { validate } = require('../../middleware/validate')
//const {consumeCreateValidationRules , consumeEditValidationRules} = require('./consume_validate')
const consumeController = require('./consume_controller');
const isAuth = require('../../middleware/is-auth');

const router = express.Router();

// change to new???
router.post('/add',
    isAuth,
    consumeCreateValidationRules(),
    validate,
    consumeController.createConsume)

router.get('/:consumeId',
    isAuth,
    consumeController.getConsume)

router.put('/:consumeId',
    isAuth,
    consumeEditValidationRules(),
    validate,
    consumeController.editConsume)

router.delete('/:consumeId',
    isAuth,
    consumeController.deleteConsume)



module.exports = router;
