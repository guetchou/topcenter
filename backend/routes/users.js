
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { getConnection } = require('../db/connection');
const auth = require('../middleware/auth');
const validate = require('../middleware/validation');
const logger = require('../utils/logger');

// GET /api/users/profile - Récupérer le profil utilisateur
router.get('/profile', auth, async (req, res) => {
  try {
    const pool = getConnection();
    const [rows] = await pool.query(
      'SELECT id, email, full_name, phone, address, created_at FROM users WHERE id = ?',
      [req.user.id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }
    
    res.json({
      success: true,
      user: rows[0]
    });
    
  } catch (error) {
    logger.error('Erreur lors de la récupération du profil:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// PUT /api/users/profile - Mettre à jour le profil
router.put('/profile', [auth, validate('updateProfile')], async (req, res) => {
  const { fullName, phone, address } = req.body;
  
  try {
    const pool = getConnection();
    
    // Construire la requête dynamiquement
    const updateFields = [];
    const updateValues = [];
    
    if (fullName) {
      updateFields.push('full_name = ?');
      updateValues.push(fullName);
    }
    if (phone) {
      updateFields.push('phone = ?');
      updateValues.push(phone);
    }
    if (address) {
      updateFields.push('address = ?');
      updateValues.push(address);
    }
    
    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Aucune donnée à mettre à jour'
      });
    }
    
    updateValues.push(req.user.id);
    
    await pool.query(
      `UPDATE users SET ${updateFields.join(', ')}, updated_at = NOW() WHERE id = ?`,
      updateValues
    );
    
    // Récupérer les données mises à jour
    const [rows] = await pool.query(
      'SELECT id, email, full_name, phone, address FROM users WHERE id = ?',
      [req.user.id]
    );
    
    res.json({
      success: true,
      message: 'Profil mis à jour avec succès',
      user: rows[0]
    });
    
  } catch (error) {
    logger.error('Erreur lors de la mise à jour du profil:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// PUT /api/users/password - Changer le mot de passe
router.put('/password', auth, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  
  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      message: 'Mot de passe actuel et nouveau mot de passe requis'
    });
  }
  
  if (newPassword.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Le nouveau mot de passe doit contenir au moins 6 caractères'
    });
  }
  
  try {
    const pool = getConnection();
    
    // Vérifier le mot de passe actuel
    const [rows] = await pool.query('SELECT password FROM users WHERE id = ?', [req.user.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }
    
    const isMatch = await bcrypt.compare(currentPassword, rows[0].password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Mot de passe actuel incorrect'
      });
    }
    
    // Hacher le nouveau mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    // Mettre à jour le mot de passe
    await pool.query(
      'UPDATE users SET password = ?, updated_at = NOW() WHERE id = ?',
      [hashedPassword, req.user.id]
    );
    
    res.json({
      success: true,
      message: 'Mot de passe mis à jour avec succès'
    });
    
  } catch (error) {
    logger.error('Erreur lors du changement de mot de passe:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

module.exports = router;
