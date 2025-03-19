
const express = require('express');
const router = express.Router();
const { getConnection } = require('../db/connection');
const logger = require('../utils/logger');
const auth = require('../middleware/auth');

// Récupérer le profil utilisateur
router.get('/profile', auth, async (req, res) => {
  try {
    const pool = getConnection();
    const [rows] = await pool.query('SELECT id, email, full_name, created_at FROM users WHERE id = ?', [req.user.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    logger.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Mettre à jour le profil utilisateur
router.put('/profile', auth, async (req, res) => {
  const { fullName } = req.body;
  
  try {
    const pool = getConnection();
    await pool.query(
      'UPDATE users SET full_name = ?, updated_at = NOW() WHERE id = ?',
      [fullName, req.user.id]
    );
    
    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    logger.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
