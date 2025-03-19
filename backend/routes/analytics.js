
const express = require('express');
const router = express.Router();
const { getConnection } = require('../db/connection');
const logger = require('../utils/logger');
const auth = require('../middleware/auth');

// Middleware pour vérifier les droits d'administrateur
async function checkAdminRights(req, res, next) {
  try {
    const pool = getConnection();
    const [rows] = await pool.query('SELECT role FROM users WHERE id = ?', [req.user.id]);
    
    if (rows.length === 0 || rows[0].role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    next();
  } catch (error) {
    logger.error('Error checking admin rights:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

// Obtenir les statistiques globales (réservé aux admins)
router.get('/stats', auth, checkAdminRights, async (req, res) => {
  try {
    const pool = getConnection();
    
    // Exemple de requête pour obtenir des statistiques
    const [userCount] = await pool.query('SELECT COUNT(*) as count FROM users');
    const [activeUsers] = await pool.query(
      'SELECT COUNT(*) as count FROM users WHERE last_login > DATE_SUB(NOW(), INTERVAL 7 DAY)'
    );
    
    res.json({
      totalUsers: userCount[0].count,
      activeUsers: activeUsers[0].count,
      // Ajoutez d'autres statistiques selon vos besoins
    });
  } catch (error) {
    logger.error('Error fetching analytics:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Obtenir les statistiques de l'utilisateur actuel
router.get('/user-stats', auth, async (req, res) => {
  try {
    const pool = getConnection();
    
    // Exemple de requête pour obtenir des statistiques utilisateur
    const [loginCount] = await pool.query(
      'SELECT COUNT(*) as count FROM user_logins WHERE user_id = ?',
      [req.user.id]
    );
    
    res.json({
      loginCount: loginCount[0].count,
      // Ajoutez d'autres statistiques selon vos besoins
    });
  } catch (error) {
    logger.error('Error fetching user analytics:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
