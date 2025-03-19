
const logger = require('./logger');

// Liste des feature flags supportés
const SUPPORTED_FLAGS = [
  'FEATURE_CHATBOT',
  'FEATURE_ANALYTICS',
  'FEATURE_TRANSLATION',
  'FEATURE_PREDICTIVE_ANALYTICS',
  'FEATURE_CRM_INTEGRATION',
  'FEATURE_APPOINTMENT_SYSTEM',
  'FEATURE_ADMIN_DASHBOARD'
];

// Fonction pour vérifier si un feature flag est activé
function isEnabled(flag) {
  if (!SUPPORTED_FLAGS.includes(flag)) {
    logger.warn(`Unsupported feature flag: ${flag}`);
    return false;
  }
  
  return process.env[flag] === 'true';
}

// Middleware pour ajouter les feature flags à la requête
function middleware(req, res, next) {
  req.features = {};
  
  SUPPORTED_FLAGS.forEach(flag => {
    req.features[flag] = isEnabled(flag);
  });
  
  next();
}

module.exports = {
  isEnabled,
  middleware,
  SUPPORTED_FLAGS
};
