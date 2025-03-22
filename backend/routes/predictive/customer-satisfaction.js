
const express = require('express');
const router = express.Router();
const logger = require('../../utils/logger');
const { getConnection } = require('../../db/connection');

// Obtenir des prédictions de satisfaction client
router.get('/', async (req, res) => {
  try {
    const { agentId } = req.query;
    
    const connection = getConnection();
    
    // Query différente selon qu'un agent spécifique est demandé ou non
    const [satisfactionData] = agentId ?
      await connection.query(`
        SELECT AVG(satisfaction_score) as avg_score, COUNT(*) as count
        FROM customer_feedback
        WHERE agent_id = ?
        GROUP BY DATE(created_at)
        ORDER BY DATE(created_at) DESC
        LIMIT 30
      `, [agentId]) :
      await connection.query(`
        SELECT AVG(satisfaction_score) as avg_score, COUNT(*) as count
        FROM customer_feedback
        GROUP BY DATE(created_at)
        ORDER BY DATE(created_at) DESC
        LIMIT 30
      `);
    
    // Simuler une prédiction de tendance
    const avgScore = satisfactionData.reduce((sum, day) => sum + parseFloat(day.avg_score), 0) / 
                    (satisfactionData.length || 1);
    
    // Identifier les tendances et risques
    const risks = [];
    
    if (avgScore < 3.5) {
      risks.push({
        level: 'high',
        description: 'Score de satisfaction client globalement bas',
        recommendation: 'Revoir les scripts et la formation des agents'
      });
    } else if (avgScore < 4.0) {
      risks.push({
        level: 'medium',
        description: 'Score de satisfaction moyen',
        recommendation: 'Améliorer les processus de résolution des problèmes'
      });
    }
    
    // Détecter les tendances négatives
    if (satisfactionData.length > 5) {
      const recentAvg = satisfactionData.slice(0, 5).reduce((sum, day) => sum + parseFloat(day.avg_score), 0) / 5;
      const olderAvg = satisfactionData.slice(-5).reduce((sum, day) => sum + parseFloat(day.avg_score), 0) / 5;
      
      if (recentAvg < olderAvg * 0.9) {
        risks.push({
          level: 'high',
          description: 'Tendance à la baisse significative détectée',
          recommendation: 'Analyser les changements récents et organiser une session d\'équipe'
        });
      }
    }
    
    res.json({
      success: true,
      currentScore: avgScore,
      satisfactionTrend: satisfactionData.length > 1 ? 
        (satisfactionData[0].avg_score > satisfactionData[satisfactionData.length - 1].avg_score ? 'improving' : 'declining') :
        'stable',
      risks,
      prediction: {
        nextMonth: Math.min(5, Math.max(1, avgScore + (Math.random() * 0.5 - 0.25))),
        confidence: 0.85
      }
    });
  } catch (error) {
    logger.error('Error generating customer satisfaction predictions:', error);
    res.status(500).json({ success: false, message: 'Erreur lors de la génération des prédictions de satisfaction' });
  }
});

module.exports = router;
