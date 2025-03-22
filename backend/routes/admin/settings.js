
const express = require('express');
const router = express.Router();
const logger = require('../../utils/logger');
const { getConnection } = require('../../db/connection');

// Gérer les paramètres du système
router.get('/', async (req, res) => {
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
router.put('/:key', async (req, res) => {
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

module.exports = router;
