
const express = require('express');
const { getConnection } = require('../db/connection');
const logger = require('../utils/logger');

const router = express.Router();

// Route pour vérifier la connexion à la base de données
router.get('/status', async (req, res) => {
  try {
    const pool = getConnection();
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT VERSION() as version');
    
    connection.release();
    
    res.json({
      status: 'connected',
      version: rows[0].version,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME
    });
  } catch (error) {
    logger.error('Erreur lors de la vérification de la connexion à la base de données:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Route pour obtenir les informations sur les tables
router.get('/tables', async (req, res) => {
  try {
    const pool = getConnection();
    const connection = await pool.getConnection();
    
    const [tables] = await connection.query(`
      SELECT 
        table_name, 
        engine, 
        table_rows, 
        data_length, 
        create_time, 
        update_time
      FROM 
        information_schema.tables 
      WHERE 
        table_schema = ?
      ORDER BY 
        table_name
    `, [process.env.DB_NAME]);
    
    connection.release();
    
    res.json({
      status: 'success',
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

// Route pour obtenir les informations sur les colonnes d'une table
router.get('/tables/:tableName/columns', async (req, res) => {
  try {
    const { tableName } = req.params;
    const pool = getConnection();
    const connection = await pool.getConnection();
    
    const [columns] = await connection.query(`
      SELECT 
        column_name,
        column_type,
        is_nullable,
        column_key,
        column_default,
        extra
      FROM 
        information_schema.columns
      WHERE 
        table_schema = ? AND
        table_name = ?
      ORDER BY 
        ordinal_position
    `, [process.env.DB_NAME, tableName]);
    
    connection.release();
    
    res.json({
      status: 'success',
      columns
    });
  } catch (error) {
    logger.error('Erreur lors de la récupération des colonnes:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Route pour exécuter une requête SQL arbitraire (ATTENTION: à sécuriser en production)
router.post('/execute', async (req, res) => {
  const { query, params = [] } = req.body;
  
  if (!query) {
    return res.status(400).json({
      status: 'error',
      message: 'La requête SQL est requise'
    });
  }
  
  try {
    const pool = getConnection();
    const connection = await pool.getConnection();
    
    // Exécution de la requête
    const [results] = await connection.query(query, params);
    
    connection.release();
    
    res.json({
      status: 'success',
      results
    });
  } catch (error) {
    logger.error('Erreur lors de l\'exécution de la requête SQL:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

module.exports = router;
