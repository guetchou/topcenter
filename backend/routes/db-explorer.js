
const express = require('express');
const { getConnection } = require('../db/connection');
const logger = require('../utils/logger');

const router = express.Router();

// Get all databases
router.get('/databases', async (req, res) => {
  try {
    const pool = getConnection();
    const connection = await pool.getConnection();
    
    const [rows] = await connection.query('SHOW DATABASES');
    
    connection.release();
    
    // Filtrer les bases de données système si nécessaire
    const databases = rows.map(row => Object.values(row)[0])
      .filter(db => !['information_schema', 'mysql', 'performance_schema', 'sys'].includes(db));
    
    res.json({
      status: 'success',
      databases
    });
  } catch (error) {
    logger.error('Erreur lors de la récupération des bases de données:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Get tables for a specific database
router.get('/databases/:database/tables', async (req, res) => {
  try {
    const { database } = req.params;
    const pool = getConnection();
    const connection = await pool.getConnection();
    
    // Sécurité: éviter l'injection SQL en validant le nom de la base de données
    if (!/^[a-zA-Z0-9_]+$/.test(database)) {
      throw new Error('Nom de base de données invalide');
    }
    
    // Utiliser la base de données spécifiée
    await connection.query(`USE \`${database}\``);
    
    // Récupérer la liste des tables
    const [rows] = await connection.query('SHOW TABLES');
    
    connection.release();
    
    const tables = rows.map(row => Object.values(row)[0]);
    
    res.json({
      status: 'success',
      database,
      tables
    });
  } catch (error) {
    logger.error('Erreur lors de la récupération des tables:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Get columns for a specific table
router.get('/databases/:database/tables/:table/columns', async (req, res) => {
  try {
    const { database, table } = req.params;
    const pool = getConnection();
    const connection = await pool.getConnection();
    
    // Sécurité: éviter l'injection SQL en validant les noms
    if (!/^[a-zA-Z0-9_]+$/.test(database) || !/^[a-zA-Z0-9_]+$/.test(table)) {
      throw new Error('Nom de base de données ou de table invalide');
    }
    
    // Utiliser la base de données spécifiée
    await connection.query(`USE \`${database}\``);
    
    // Récupérer les informations sur les colonnes
    const [columns] = await connection.query(`SHOW COLUMNS FROM \`${table}\``);
    
    // Récupérer un échantillon de données
    const [sampleData] = await connection.query(`SELECT * FROM \`${table}\` LIMIT 5`);
    
    connection.release();
    
    res.json({
      status: 'success',
      database,
      table,
      columns,
      sampleData
    });
  } catch (error) {
    logger.error('Erreur lors de la récupération des colonnes:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Execute a query
router.post('/query', async (req, res) => {
  const { query, params } = req.body;
  
  if (!query) {
    return res.status(400).json({
      status: 'error',
      message: 'La requête SQL est requise'
    });
  }
  
  // Bloquer certaines requêtes dangereuses
  const blockedQueries = ['DROP DATABASE', 'DROP TABLE', 'TRUNCATE TABLE'];
  if (blockedQueries.some(q => query.toUpperCase().includes(q))) {
    return res.status(403).json({
      status: 'error',
      message: 'Cette requête n\'est pas autorisée pour des raisons de sécurité'
    });
  }
  
  try {
    const pool = getConnection();
    const connection = await pool.getConnection();
    
    const [results] = await connection.query(query, params || []);
    
    connection.release();
    
    res.json({
      status: 'success',
      results
    });
  } catch (error) {
    logger.error('Erreur lors de l\'exécution de la requête:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

module.exports = router;
