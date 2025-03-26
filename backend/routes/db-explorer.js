
const express = require('express');
const router = express.Router();
const infoSchema = require('../db/information-schema');
const logger = require('../utils/logger');

// Middleware pour initialiser la connexion à information_schema
router.use(async (req, res, next) => {
  try {
    if (!global.infoSchemaInitialized) {
      await infoSchema.createInfoSchemaConnection();
      global.infoSchemaInitialized = true;
    }
    next();
  } catch (error) {
    logger.error('Erreur d\'initialisation information_schema:', error);
    res.status(500).json({ 
      error: 'Erreur de connexion à information_schema',
      details: error.message
    });
  }
});

// Récupérer la liste des bases de données
router.get('/databases', async (req, res) => {
  try {
    const databases = await infoSchema.getDatabaseInfo();
    res.json({ databases });
  } catch (error) {
    logger.error('Erreur lors de la récupération des bases de données:', error);
    res.status(500).json({ error: error.message });
  }
});

// Récupérer les tables d'une base de données
router.get('/databases/:database/tables', async (req, res) => {
  try {
    const { database } = req.params;
    const tables = await infoSchema.getTablesInfo(database);
    res.json({ database, tables });
  } catch (error) {
    logger.error(`Erreur lors de la récupération des tables pour ${req.params.database}:`, error);
    res.status(500).json({ error: error.message });
  }
});

// Récupérer les colonnes d'une table
router.get('/databases/:database/tables/:table/columns', async (req, res) => {
  try {
    const { database, table } = req.params;
    const columns = await infoSchema.getColumnsInfo(database, table);
    res.json({ database, table, columns });
  } catch (error) {
    logger.error(`Erreur lors de la récupération des colonnes pour ${req.params.database}.${req.params.table}:`, error);
    res.status(500).json({ error: error.message });
  }
});

// Récupérer la définition d'une vue
router.get('/databases/:database/views/:view/definition', async (req, res) => {
  try {
    const { database, view } = req.params;
    const definition = await infoSchema.getViewDefinition(database, view);
    res.json({ database, view, definition });
  } catch (error) {
    logger.error(`Erreur lors de la récupération de la définition de la vue ${req.params.database}.${req.params.view}:`, error);
    res.status(500).json({ error: error.message });
  }
});

// Récupérer les index d'une table
router.get('/databases/:database/tables/:table/indexes', async (req, res) => {
  try {
    const { database, table } = req.params;
    const indexes = await infoSchema.getIndexInfo(database, table);
    res.json({ database, table, indexes });
  } catch (error) {
    logger.error(`Erreur lors de la récupération des index pour ${req.params.database}.${req.params.table}:`, error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
