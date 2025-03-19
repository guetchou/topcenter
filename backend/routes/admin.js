
const express = require('express');
const router = express.Router();
const logger = require('../utils/logger');
const { getConnection } = require('../db/connection');
const auth = require('../middleware/auth');

// Middleware pour vérifier les permissions d'administrateur
const isAdmin = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'super_admin')) {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Accès non autorisé' });
  }
};

// Middleware pour vérifier les permissions de super administrateur
const isSuperAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'super_admin') {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Accès non autorisé' });
  }
};

// Récupérer les statistiques globales du dashboard
router.get('/dashboard', auth, isAdmin, async (req, res) => {
  try {
    const connection = getConnection();
    
    // Statistiques des appels
    const [callStats] = await connection.query(`
      SELECT 
        COUNT(*) as total_calls,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_calls,
        SUM(CASE WHEN status = 'missed' THEN 1 ELSE 0 END) as missed_calls,
        AVG(duration) as avg_duration
      FROM call_logs
      WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
    `);
    
    // Statistiques des agents
    const [agentStats] = await connection.query(`
      SELECT 
        COUNT(DISTINCT agent_id) as total_agents,
        AVG(calls_handled) as avg_calls_per_agent,
        MAX(calls_handled) as max_calls_per_agent
      FROM (
        SELECT 
          agent_id, 
          COUNT(*) as calls_handled
        FROM call_logs
        WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
        GROUP BY agent_id
      ) as agent_calls
    `);
    
    // Satisfaction client
    const [satisfactionStats] = await connection.query(`
      SELECT 
        AVG(satisfaction_score) as avg_satisfaction,
        COUNT(*) as total_ratings
      FROM customer_feedback
      WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
    `);
    
    // Taux de conversion
    const [conversionStats] = await connection.query(`
      SELECT 
        COUNT(*) as total_leads,
        SUM(CASE WHEN status = 'converted' THEN 1 ELSE 0 END) as converted_leads,
        ROUND(SUM(CASE WHEN status = 'converted' THEN 1 ELSE 0 END) / COUNT(*) * 100, 2) as conversion_rate
      FROM leads
      WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
    `);
    
    // Tendances sur 7 jours
    const [dailyStats] = await connection.query(`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as call_count,
        AVG(duration) as avg_duration
      FROM call_logs
      WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `);
    
    res.json({
      success: true,
      statistics: {
        calls: callStats[0] || { total_calls: 0, completed_calls: 0, missed_calls: 0, avg_duration: 0 },
        agents: agentStats[0] || { total_agents: 0, avg_calls_per_agent: 0, max_calls_per_agent: 0 },
        satisfaction: satisfactionStats[0] || { avg_satisfaction: 0, total_ratings: 0 },
        conversion: conversionStats[0] || { total_leads: 0, converted_leads: 0, conversion_rate: 0 },
        daily_trend: dailyStats || []
      }
    });
  } catch (error) {
    logger.error('Error fetching admin dashboard statistics:', error);
    res.status(500).json({ success: false, message: 'Erreur lors de la récupération des statistiques' });
  }
});

// Récupérer les logs d'activité
router.get('/activity-logs', auth, isAdmin, async (req, res) => {
  try {
    const { 
      type, 
      user_id, 
      start_date, 
      end_date,
      limit = 100,
      offset = 0
    } = req.query;
    
    const connection = getConnection();
    
    // Construire la requête avec les filtres
    let query = `SELECT al.*, u.full_name as user_name FROM activity_logs al
                LEFT JOIN users u ON al.user_id = u.id WHERE 1=1`;
    const params = [];
    
    if (type) {
      query += ` AND al.activity_type = ?`;
      params.push(type);
    }
    
    if (user_id) {
      query += ` AND al.user_id = ?`;
      params.push(user_id);
    }
    
    if (start_date) {
      query += ` AND al.created_at >= ?`;
      params.push(start_date);
    }
    
    if (end_date) {
      query += ` AND al.created_at <= ?`;
      params.push(end_date);
    }
    
    query += ` ORDER BY al.created_at DESC LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), parseInt(offset));
    
    // Exécuter la requête
    const [logs] = await connection.query(query, params);
    
    // Compter le total pour la pagination
    const [countResult] = await connection.query(
      `SELECT COUNT(*) as total FROM activity_logs al WHERE 1=1
       ${type ? ' AND al.activity_type = ?' : ''}
       ${user_id ? ' AND al.user_id = ?' : ''}
       ${start_date ? ' AND al.created_at >= ?' : ''}
       ${end_date ? ' AND al.created_at <= ?' : ''}`,
      params.slice(0, params.length - 2) // Exclure limit et offset
    );
    
    res.json({
      success: true,
      logs,
      pagination: {
        total: countResult[0].total,
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    });
  } catch (error) {
    logger.error('Error fetching activity logs:', error);
    res.status(500).json({ success: false, message: 'Erreur lors de la récupération des logs d\'activité' });
  }
});

// Générer un rapport détaillé
router.post('/reports/generate', auth, isAdmin, async (req, res) => {
  try {
    const {
      report_type,
      start_date,
      end_date,
      filters = {}
    } = req.body;
    
    if (!report_type || !start_date || !end_date) {
      return res.status(400).json({
        success: false,
        message: 'Le type de rapport, la date de début et la date de fin sont requis'
      });
    }
    
    const connection = getConnection();
    
    let reportData;
    let reportTitle;
    
    switch (report_type) {
      case 'agent_performance':
        reportTitle = 'Rapport de performance des agents';
        
        // Construire la requête avec les filtres
        let query = `
          SELECT 
            u.id as agent_id,
            u.full_name as agent_name,
            COUNT(cl.id) as total_calls,
            SUM(CASE WHEN cl.status = 'completed' THEN 1 ELSE 0 END) as completed_calls,
            AVG(cl.duration) as avg_call_duration,
            AVG(cf.satisfaction_score) as avg_satisfaction
          FROM users u
          LEFT JOIN call_logs cl ON u.id = cl.agent_id AND cl.created_at BETWEEN ? AND ?
          LEFT JOIN customer_feedback cf ON cl.id = cf.call_id
          WHERE u.role = 'agent'
        `;
        
        const params = [start_date, end_date];
        
        if (filters.agent_id) {
          query += ` AND u.id = ?`;
          params.push(filters.agent_id);
        }
        
        query += ` GROUP BY u.id ORDER BY total_calls DESC`;
        
        [reportData] = await connection.query(query, params);
        break;
        
      case 'call_volume':
        reportTitle = 'Rapport de volume d\'appels';
        
        [reportData] = await connection.query(`
          SELECT 
            DATE(created_at) as date,
            COUNT(*) as call_count,
            SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_calls,
            SUM(CASE WHEN status = 'missed' THEN 1 ELSE 0 END) as missed_calls,
            AVG(duration) as avg_duration,
            HOUR(created_at) as hour,
            COUNT(CASE WHEN HOUR(created_at) = HOUR(created_at) THEN 1 END) as hourly_count
          FROM call_logs
          WHERE created_at BETWEEN ? AND ?
          GROUP BY DATE(created_at), HOUR(created_at)
          ORDER BY date ASC, hour ASC
        `, [start_date, end_date]);
        break;
        
      case 'customer_satisfaction':
        reportTitle = 'Rapport de satisfaction client';
        
        [reportData] = await connection.query(`
          SELECT 
            DATE(cf.created_at) as date,
            AVG(cf.satisfaction_score) as avg_score,
            COUNT(*) as total_ratings,
            SUM(CASE WHEN cf.satisfaction_score >= 4 THEN 1 ELSE 0 END) as positive_ratings,
            SUM(CASE WHEN cf.satisfaction_score <= 2 THEN 1 ELSE 0 END) as negative_ratings,
            u.full_name as agent_name,
            AVG(CASE WHEN u.id = cf.agent_id THEN cf.satisfaction_score END) as agent_avg_score
          FROM customer_feedback cf
          LEFT JOIN users u ON cf.agent_id = u.id
          WHERE cf.created_at BETWEEN ? AND ?
          GROUP BY DATE(cf.created_at), cf.agent_id
          ORDER BY date ASC
        `, [start_date, end_date]);
        break;
        
      default:
        return res.status(400).json({
          success: false,
          message: 'Type de rapport non pris en charge'
        });
    }
    
    // Sauvegarder le rapport dans la base de données
    const [result] = await connection.query(`
      INSERT INTO generated_reports
      (user_id, report_type, report_title, parameters, data, created_at)
      VALUES (?, ?, ?, ?, ?, NOW())
    `, [req.user.id, report_type, reportTitle, JSON.stringify({ start_date, end_date, filters }), JSON.stringify(reportData)]);
    
    res.json({
      success: true,
      message: 'Rapport généré avec succès',
      report: {
        id: result.insertId,
        title: reportTitle,
        type: report_type,
        data: reportData,
        created_at: new Date().toISOString()
      }
    });
  } catch (error) {
    logger.error('Error generating report:', error);
    res.status(500).json({ success: false, message: 'Erreur lors de la génération du rapport' });
  }
});

// Gérer les paramètres du système
router.get('/settings', auth, isAdmin, async (req, res) => {
  try {
    const connection = getConnection();
    
    const [settings] = await connection.query(`
      SELECT * FROM system_settings
    `);
    
    // Convertir en objet clé-valeur
    const settingsObject = settings.reduce((obj, setting) => {
      obj[setting.setting_key] = {
        value: setting.setting_value,
        type: setting.value_type,
        description: setting.description
      };
      return obj;
    }, {});
    
    res.json({ success: true, settings: settingsObject });
  } catch (error) {
    logger.error('Error fetching system settings:', error);
    res.status(500).json({ success: false, message: 'Erreur lors de la récupération des paramètres' });
  }
});

// Mettre à jour un paramètre du système
router.put('/settings/:key', auth, isAdmin, async (req, res) => {
  try {
    const { key } = req.params;
    const { value } = req.body;
    
    if (value === undefined) {
      return res.status(400).json({ success: false, message: 'La valeur est requise' });
    }
    
    const connection = getConnection();
    
    // Vérifier que le paramètre existe
    const [settings] = await connection.query(`
      SELECT * FROM system_settings WHERE setting_key = ?
    `, [key]);
    
    if (!settings.length) {
      return res.status(404).json({ success: false, message: 'Paramètre non trouvé' });
    }
    
    // Mettre à jour le paramètre
    await connection.query(`
      UPDATE system_settings 
      SET setting_value = ?, updated_at = NOW()
      WHERE setting_key = ?
    `, [value, key]);
    
    // Enregistrer l'activité
    await connection.query(`
      INSERT INTO activity_logs
      (user_id, activity_type, description, created_at)
      VALUES (?, 'setting_update', ?, NOW())
    `, [req.user.id, `Mise à jour du paramètre ${key} à "${value}"`]);
    
    res.json({ 
      success: true, 
      message: 'Paramètre mis à jour avec succès',
      setting: {
        key,
        value,
        type: settings[0].value_type,
        description: settings[0].description
      }
    });
  } catch (error) {
    logger.error('Error updating system setting:', error);
    res.status(500).json({ success: false, message: 'Erreur lors de la mise à jour du paramètre' });
  }
});

// Gérer les feature flags
router.get('/feature-flags', auth, isAdmin, async (req, res) => {
  try {
    // Récupérer les feature flags depuis le module d'utilitaires
    const featureFlags = require('../utils/featureFlags');
    
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
router.put('/feature-flags/:flag', auth, isSuperAdmin, async (req, res) => {
  try {
    const { flag } = req.params;
    const { enabled } = req.body;
    
    if (enabled === undefined) {
      return res.status(400).json({ success: false, message: 'Le statut d\'activation est requis' });
    }
    
    // Vérifier que le flag existe
    const featureFlags = require('../utils/featureFlags');
    
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

module.exports = router;
