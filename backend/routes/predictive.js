
const express = require('express');
const router = express.Router();
const logger = require('../utils/logger');
const { getConnection } = require('../db/connection');

// Obtenir des prédictions pour les volumes d'appels
router.get('/call-volume', async (req, res) => {
  try {
    const { days = 7 } = req.query;
    
    // Dans un scénario réel, on utiliserait un modèle d'apprentissage automatique
    // Ici, nous simulons des prédictions basées sur des données historiques
    const connection = getConnection();
    const [historicalData] = await connection.query(`
      SELECT DATE(created_at) as date, COUNT(*) as count 
      FROM call_logs 
      GROUP BY DATE(created_at) 
      ORDER BY date DESC 
      LIMIT ?
    `, [parseInt(days)]);
    
    // Générer des prédictions simples (moyenne + tendance)
    const predictions = [];
    let lastDate = new Date();
    
    // Calculer la moyenne et la tendance
    const totalCalls = historicalData.reduce((sum, day) => sum + day.count, 0);
    const avgCalls = totalCalls / historicalData.length || 0;
    
    // Simuler une tendance linéaire simple
    const trend = historicalData.length > 1 ? 
      (historicalData[0].count - historicalData[historicalData.length - 1].count) / historicalData.length : 0;
    
    // Prédire les 7 prochains jours
    for (let i = 1; i <= 7; i++) {
      lastDate.setDate(lastDate.getDate() + 1);
      const predictedCalls = Math.round(avgCalls + (trend * i));
      
      predictions.push({
        date: lastDate.toISOString().split('T')[0],
        predicted: Math.max(0, predictedCalls), // Éviter les prédictions négatives
        confidence: 0.95 - (i * 0.05) // La confiance diminue avec le temps
      });
    }
    
    res.json({ 
      success: true, 
      historicalData,
      predictions,
      metadata: {
        averageCalls: avgCalls,
        trend: trend > 0 ? 'increasing' : trend < 0 ? 'decreasing' : 'stable',
        trendValue: trend
      }
    });
  } catch (error) {
    logger.error('Error generating call volume predictions:', error);
    res.status(500).json({ success: false, message: 'Erreur lors de la génération des prédictions' });
  }
});

// Obtenir des prédictions de satisfaction client
router.get('/customer-satisfaction', async (req, res) => {
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

// Obtenir des prédictions personnalisées basées sur les données client
router.post('/custom', async (req, res) => {
  try {
    const { 
      dataPoints, 
      predictionTarget, 
      timeRange,
      customerSegment 
    } = req.body;
    
    if (!dataPoints || !predictionTarget) {
      return res.status(400).json({ 
        success: false, 
        message: 'Les points de données et la cible de prédiction sont requis' 
      });
    }
    
    // Dans un environnement réel, nous appellerions ici une API de ML ou
    // exécuterions un modèle de prédiction pré-entraîné
    
    // Simuler une réponse de prédiction
    const predictions = Array.from({ length: timeRange || 5 }, (_, i) => ({
      period: `Période ${i + 1}`,
      value: Math.round(Math.random() * 100),
      lowerBound: Math.round(Math.random() * 70),
      upperBound: Math.round(Math.random() * 30) + 70,
      confidence: Math.random() * 0.3 + 0.7
    }));
    
    res.json({
      success: true,
      predictions,
      insights: [
        "Les données montrent une tendance positive pour les 3 prochaines périodes",
        "Il y a un risque de baisse d'activité pendant la période 4",
        "Le segment client 'Premium' montre les meilleures perspectives de croissance"
      ]
    });
  } catch (error) {
    logger.error('Error generating custom predictions:', error);
    res.status(500).json({ success: false, message: 'Erreur lors de la génération des prédictions personnalisées' });
  }
});

module.exports = router;
