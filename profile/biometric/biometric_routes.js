const express = require('express');

const { validate } = require('../../middleware/validate')
const {biometricCreateValidationRules} = require('./biometric_validate')
const biometricController = require('./biometric_controller');
const isAuth = require('../../middleware/is-auth');

const router = express.Router();

router.post('/add',
    isAuth,
    biometricCreateValidationRules(),
    validate,
    biometricController.addBiometric)
    
    
    router.get('/',
    isAuth,
    biometricController.getBiometric)
    
router.post('/edit',
        isAuth,
        biometricCreateValidationRules(),
        validate,
        biometricController.editBiometric)

module.exports = router;
