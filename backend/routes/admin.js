
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Middleware
const isAdmin = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'super_admin')) {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Accès non autorisé' });
  }
};

const isSuperAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'super_admin') {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Accès non autorisé' });
  }
};

// Sous-routes
const dashboardRoutes = require('./admin/dashboard');
const activityLogsRoutes = require('./admin/activity-logs');
const reportsRoutes = require('./admin/reports');
const settingsRoutes = require('./admin/settings');
const featureFlagsRoutes = require('./admin/feature-flags');

// Appliquer l'authentification et les droits d'accès
router.use('/dashboard', auth, isAdmin, dashboardRoutes);
router.use('/activity-logs', auth, isAdmin, activityLogsRoutes);
router.use('/reports', auth, isAdmin, reportsRoutes);
router.use('/settings', auth, isAdmin, settingsRoutes);
router.use('/feature-flags', auth, featureFlagsRoutes);

// Route pour la mise à jour des feature flags (restreinte aux super admins)
router.put('/feature-flags/:flag', auth, isSuperAdmin);

module.exports = router;
