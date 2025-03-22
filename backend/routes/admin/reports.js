
const express = require('express');
const router = express.Router();
const logger = require('../../utils/logger');
const { getConnection } = require('../../db/connection');

// Générer un rapport détaillé
router.post('/generate', async (req, res) => {
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

module.exports = router;
