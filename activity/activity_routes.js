const express = require('express');

const {activityDetailValidationRules , validate} = require('../middleware/validate')
const activityController = require('./activity_controller');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.post('/add',
            isAuth,
            activityDetailValidationRules(),
            validate,
            activityController.createActivity)

router.get('/:activityId', 
            isAuth , 
            activityController.getActivity)

router.put('/:activityId', 
            isAuth, 
            activityDetailValidationRules() , 
            validate , 
            activityController.editActivity) //all of details should be passed as args
            
router.delete('/:activityId', 
            isAuth , 
            activityController.deleteActivity)

module.exports = router;
