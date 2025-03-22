
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Import des routes
const callVolumeRoutes = require('./predictive/call-volume');
const customerSatisfactionRoutes = require('./predictive/customer-satisfaction');
const customPredictionRoutes = require('./predictive/custom');

// Application des routes
router.use('/call-volume', auth, callVolumeRoutes);
router.use('/customer-satisfaction', auth, customerSatisfactionRoutes);
router.use('/custom', auth, customPredictionRoutes);

module.exports = router;
