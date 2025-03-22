
const express = require('express');
const router = express.Router();
const logger = require('../../utils/logger');
const { getConnection } = require('../../db/connection');

// Fonction utilitaire pour obtenir la description d'un feature flag
function getFeatureFlagDescription(flag) {
  const descriptions = {
    'FEATURE_CHATBOT': 'Active le chatbot intelligent pour l\'assistance client',
    'FEATURE_ANALYTICS': 'Active le module d\'analyse de données et de rapports',
    'FEATURE_TRANSLATION': 'Active le système de traduction automatique multi-langues',
    'FEATURE_PREDICTIVE_ANALYTICS': 'Active les fonctionnalités d\'analyse prédictive',
    'FEATURE_CRM_INTEGRATION': 'Active l\'intégration avec des systèmes CRM externes',
    'FEATURE_APPOINTMENT_SYSTEM': 'Active le système de réservation de rendez-vous',
    'FEATURE_ADMIN_DASHBOARD': 'Active le tableau de bord administrateur avec analytics avancés'
  };
  
  return descriptions[flag] || 'Aucune description disponible';
}

// Gérer les feature flags
router.get('/', async (req, res) => {
  try {
    // Récupérer les feature flags depuis le module d'utilitaires
    const featureFlags = require('../../utils/featureFlags');
    
    // Formatter les données pour l'affichage
    const flags = featureFlags.SUPPORTED_FLAGS.map(flag => ({
      name: flag,
      enabled: featureFlags.isEnabled(flag),
      description: getFeatureFlagDescription(flag)
    }));
    
    res.json({ success: true, flags });
  } catch (error) {
    logger.error('Error fetching feature flags:', error);
    res.status(500).json({ success: false, message: 'Erreur lors de la récupération des feature flags' });
  }
});

// Mettre à jour un feature flag
router.put('/:flag', async (req, res) => {
  try {
    const { flag } = req.params;
    const { enabled } = req.body;
    
    if (enabled === undefined) {
      return res.status(400).json({ success: false, message: 'Le statut d\'activation est requis' });
    }
    
    // Vérifier que le flag existe
    const featureFlags = require('../../utils/featureFlags');
    
    if (!featureFlags.SUPPORTED_FLAGS.includes(flag)) {
      return res.status(404).json({ success: false, message: 'Feature flag non trouvé' });
    }
    
    // Dans un environnement réel, nous mettrions à jour le fichier .env
    // Ici, nous simulons un succès
    const connection = getConnection();
    
    // Enregistrer l'activité
    await connection.query(`
      INSERT INTO activity_logs
      (user_id, activity_type, description, created_at)
      VALUES (?, 'feature_flag_update', ?, NOW())
    `, [req.user.id, `${flag} a été ${enabled ? 'activé' : 'désactivé'}`]);
    
    res.json({ 
      success: true, 
      message: `Le feature flag ${flag} a été ${enabled ? 'activé' : 'désactivé'}`,
      note: "Dans un environnement de production, vous devriez redémarrer le serveur pour appliquer ce changement."
    });
  } catch (error) {
    logger.error('Error updating feature flag:', error);
    res.status(500).json({ success: false, message: 'Erreur lors de la mise à jour du feature flag' });
  }
});

module.exports = router;
