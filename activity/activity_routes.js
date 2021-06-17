const express = require('express');

const {validate} = require('../middleware/validate')
const {activityCreateValidationRules , activityEditValidationRules} = require('./activity_validate')
const activityController = require('./activity_controller');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.post('/add',
            isAuth,
            activityCreateValidationRules(),
            validate,
            activityController.createActivity)

router.get('/:activityId', 
            isAuth , 
            activityController.getActivity)

router.put('/:activityId', 
            isAuth, 
            activityEditValidationRules() , 
            validate , 
            activityController.editActivity) 
            
router.delete('/:activityId', 
            isAuth , 
            activityController.deleteActivity)

module.exports = router;
