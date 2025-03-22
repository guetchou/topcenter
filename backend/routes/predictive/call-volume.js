
const express = require('express');
const router = express.Router();
const logger = require('../../utils/logger');
const { getConnection } = require('../../db/connection');

// Obtenir des prédictions pour les volumes d'appels
router.get('/', async (req, res) => {
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

module.exports = router;
