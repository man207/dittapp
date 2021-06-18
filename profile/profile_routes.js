const express = require('express');

const consumeRoutes = require('./consume/consume_routes');
const burnRoutes = require('./burn/burn_routes');
const weightRoutes = require('./weight/weight_routes');

const router = express.Router();

router.use('/consume' , consumeRoutes)
router.use('/burn' , burnRoutes)
router.use('/weight' , weightRoutes)

module.exports = router;
