
const express = require('express');
const router = express.Router();
const logger = require('../../utils/logger');
const { getConnection } = require('../../db/connection');

// Récupérer les statistiques globales du dashboard
router.get('/', async (req, res) => {
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

module.exports = router;
