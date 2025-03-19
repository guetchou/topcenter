
const express = require('express');
const router = express.Router();
const logger = require('../utils/logger');
const { getConnection } = require('../db/connection');

// Récupérer tous les systèmes CRM intégrés
router.get('/systems', async (req, res) => {
  try {
    const connection = getConnection();
    const [crmSystems] = await connection.query(`
      SELECT * FROM crm_systems WHERE active = 1
    `);
    
    res.json({ success: true, crmSystems });
  } catch (error) {
    logger.error('Error fetching CRM systems:', error);
    res.status(500).json({ success: false, message: 'Erreur lors de la récupération des systèmes CRM' });
  }
});

// Récupérer les détails d'intégration d'un système CRM
router.get('/systems/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const connection = getConnection();
    
    const [crmSystem] = await connection.query(`
      SELECT * FROM crm_systems WHERE id = ?
    `, [id]);
    
    if (!crmSystem.length) {
      return res.status(404).json({ success: false, message: 'Système CRM non trouvé' });
    }
    
    // Ne pas renvoyer les clés API/secrets sensibles
    const systemData = { ...crmSystem[0] };
    if (systemData.api_key) systemData.api_key = '•••••••••';
    if (systemData.api_secret) systemData.api_secret = '•••••••••';
    
    res.json({ success: true, crmSystem: systemData });
  } catch (error) {
    logger.error('Error fetching CRM system:', error);
    res.status(500).json({ success: false, message: 'Erreur lors de la récupération du système CRM' });
  }
});

// Synchroniser les contacts avec un système CRM
router.post('/sync/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { direction = 'from_crm' } = req.body;
    
    const connection = getConnection();
    
    // Vérifier que le système CRM existe
    const [crmSystem] = await connection.query(`
      SELECT * FROM crm_systems WHERE id = ?
    `, [id]);
    
    if (!crmSystem.length) {
      return res.status(404).json({ success: false, message: 'Système CRM non trouvé' });
    }
    
    // Simuler une synchronisation
    // Dans un environnement réel, vous utiliseriez l'API du CRM
    const syncResults = {
      timestamp: new Date().toISOString(),
      status: 'success',
      direction,
      statistics: {
        total: Math.floor(Math.random() * 100) + 50,
        created: Math.floor(Math.random() * 20),
        updated: Math.floor(Math.random() * 30),
        unchanged: Math.floor(Math.random() * 50),
        failed: Math.floor(Math.random() * 5)
      }
    };
    
    // Enregistrer le résultat de synchronisation
    await connection.query(`
      INSERT INTO crm_sync_logs 
      (crm_system_id, direction, status, statistics, created_at)
      VALUES (?, ?, ?, ?, NOW())
    `, [id, direction, syncResults.status, JSON.stringify(syncResults.statistics)]);
    
    res.json({ success: true, syncResults });
  } catch (error) {
    logger.error('Error syncing with CRM:', error);
    res.status(500).json({ success: false, message: 'Erreur lors de la synchronisation avec le CRM' });
  }
});

// Ajouter un système CRM
router.post('/systems', async (req, res) => {
  try {
    const { 
      name, 
      type, 
      api_url, 
      api_key, 
      api_secret,
      sync_frequency,
      sync_enabled
    } = req.body;
    
    if (!name || !type || !api_url) {
      return res.status(400).json({ 
        success: false, 
        message: 'Le nom, le type et l\'URL API sont requis'
      });
    }
    
    const connection = getConnection();
    
    // Insérer le nouveau système CRM
    const [result] = await connection.query(`
      INSERT INTO crm_systems
      (name, type, api_url, api_key, api_secret, sync_frequency, sync_enabled, active, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, 1, NOW())
    `, [name, type, api_url, api_key, api_secret, sync_frequency || 'daily', sync_enabled || 0]);
    
    res.status(201).json({ 
      success: true, 
      message: 'Système CRM ajouté avec succès',
      id: result.insertId
    });
  } catch (error) {
    logger.error('Error adding CRM system:', error);
    res.status(500).json({ success: false, message: 'Erreur lors de l\'ajout du système CRM' });
  }
});

// Mettre à jour un système CRM
router.put('/systems/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      api_url,
      api_key,
      api_secret,
      sync_frequency,
      sync_enabled,
      active
    } = req.body;
    
    const connection = getConnection();
    
    // Vérifier que le système CRM existe
    const [crmSystem] = await connection.query(`
      SELECT * FROM crm_systems WHERE id = ?
    `, [id]);
    
    if (!crmSystem.length) {
      return res.status(404).json({ success: false, message: 'Système CRM non trouvé' });
    }
    
    // Préparer la requête de mise à jour
    const updates = [];
    const values = [];
    
    if (name !== undefined) {
      updates.push('name = ?');
      values.push(name);
    }
    
    if (api_url !== undefined) {
      updates.push('api_url = ?');
      values.push(api_url);
    }
    
    if (api_key !== undefined) {
      updates.push('api_key = ?');
      values.push(api_key);
    }
    
    if (api_secret !== undefined) {
      updates.push('api_secret = ?');
      values.push(api_secret);
    }
    
    if (sync_frequency !== undefined) {
      updates.push('sync_frequency = ?');
      values.push(sync_frequency);
    }
    
    if (sync_enabled !== undefined) {
      updates.push('sync_enabled = ?');
      values.push(sync_enabled);
    }
    
    if (active !== undefined) {
      updates.push('active = ?');
      values.push(active);
    }
    
    updates.push('updated_at = NOW()');
    
    // Si aucune mise à jour n'est requise
    if (updates.length === 1) {
      return res.json({ success: true, message: 'Aucune modification nécessaire' });
    }
    
    // Exécuter la mise à jour
    await connection.query(`
      UPDATE crm_systems
      SET ${updates.join(', ')}
      WHERE id = ?
    `, [...values, id]);
    
    res.json({ success: true, message: 'Système CRM mis à jour avec succès' });
  } catch (error) {
    logger.error('Error updating CRM system:', error);
    res.status(500).json({ success: false, message: 'Erreur lors de la mise à jour du système CRM' });
  }
});

module.exports = router;
