
const express = require('express');
const router = express.Router();
const logger = require('../../utils/logger');
const { getConnection } = require('../../db/connection');

// Récupérer les logs d'activité
router.get('/', async (req, res) => {
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

module.exports = router;
