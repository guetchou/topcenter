
const mysql = require('mysql2/promise');
const logger = require('../utils/logger');

// Configuration de la connexion à information_schema
const getInfoSchemaConfig = () => ({
  host: process.env.DB_HOST || 'rj8dl.myd.infomaniak.com',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: 'information_schema', // Connexion spécifique à information_schema
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 0,
  charset: 'utf8mb4',
  ssl: process.env.DB_SSL === 'true' ? true : undefined
});

// Création d'un pool distinct pour information_schema
let infoSchemaPool;

async function createInfoSchemaConnection() {
  try {
    logger.info('Tentative de connexion à information_schema...');
    
    infoSchemaPool = mysql.createPool(getInfoSchemaConfig());
    
    // Tester la connexion
    const connection = await infoSchemaPool.getConnection();
    const [rows] = await connection.query('SELECT database() as current_db');
    
    logger.info(`Connexion établie avec succès à information_schema: ${rows[0].current_db}`);
    
    connection.release();
    
    return infoSchemaPool;
  } catch (error) {
    logger.error('Erreur lors de la connexion à information_schema:', error);
    throw error;
  }
}

function getInfoSchemaConnection() {
  if (!infoSchemaPool) {
    throw new Error('La connexion à information_schema n\'est pas initialisée');
  }
  return infoSchemaPool;
}

// Requêtes utilitaires pour explorer la base de données
async function getDatabaseInfo() {
  try {
    const pool = getInfoSchemaConnection();
    const [rows] = await pool.query(`
      SELECT SCHEMA_NAME as database_name, DEFAULT_CHARACTER_SET_NAME as charset, DEFAULT_COLLATION_NAME as collation
      FROM SCHEMATA
      WHERE SCHEMA_NAME NOT IN ('information_schema', 'performance_schema', 'mysql', 'sys')
      ORDER BY SCHEMA_NAME
    `);
    return rows;
  } catch (error) {
    logger.error('Erreur lors de la récupération des informations de base de données:', error);
    throw error;
  }
}

async function getTablesInfo(databaseName) {
  try {
    const pool = getInfoSchemaConnection();
    const [rows] = await pool.query(`
      SELECT 
        TABLE_NAME as table_name, 
        TABLE_TYPE as table_type,
        ENGINE as engine,
        TABLE_ROWS as row_count,
        CREATE_TIME as created_at,
        UPDATE_TIME as updated_at,
        TABLE_COMMENT as comment
      FROM TABLES
      WHERE TABLE_SCHEMA = ?
      ORDER BY TABLE_NAME
    `, [databaseName]);
    return rows;
  } catch (error) {
    logger.error(`Erreur lors de la récupération des tables pour ${databaseName}:`, error);
    throw error;
  }
}

async function getColumnsInfo(databaseName, tableName) {
  try {
    const pool = getInfoSchemaConnection();
    const [rows] = await pool.query(`
      SELECT 
        COLUMN_NAME as column_name, 
        COLUMN_TYPE as data_type,
        IS_NULLABLE as is_nullable,
        COLUMN_KEY as column_key,
        COLUMN_DEFAULT as default_value,
        EXTRA as extra,
        COLUMN_COMMENT as comment
      FROM COLUMNS
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?
      ORDER BY ORDINAL_POSITION
    `, [databaseName, tableName]);
    return rows;
  } catch (error) {
    logger.error(`Erreur lors de la récupération des colonnes pour ${databaseName}.${tableName}:`, error);
    throw error;
  }
}

async function getViewDefinition(databaseName, viewName) {
  try {
    const pool = getInfoSchemaConnection();
    const [rows] = await pool.query(`
      SELECT VIEW_DEFINITION
      FROM VIEWS
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?
    `, [databaseName, viewName]);
    return rows.length > 0 ? rows[0].VIEW_DEFINITION : null;
  } catch (error) {
    logger.error(`Erreur lors de la récupération de la définition de la vue ${databaseName}.${viewName}:`, error);
    throw error;
  }
}

async function getIndexInfo(databaseName, tableName) {
  try {
    const pool = getInfoSchemaConnection();
    const [rows] = await pool.query(`
      SELECT 
        INDEX_NAME as index_name,
        COLUMN_NAME as column_name,
        NON_UNIQUE as non_unique,
        SEQ_IN_INDEX as seq_in_index,
        INDEX_TYPE as index_type,
        COMMENT as comment
      FROM STATISTICS
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?
      ORDER BY INDEX_NAME, SEQ_IN_INDEX
    `, [databaseName, tableName]);
    return rows;
  } catch (error) {
    logger.error(`Erreur lors de la récupération des index pour ${databaseName}.${tableName}:`, error);
    throw error;
  }
}

module.exports = {
  createInfoSchemaConnection,
  getInfoSchemaConnection,
  getDatabaseInfo,
  getTablesInfo,
  getColumnsInfo,
  getViewDefinition,
  getIndexInfo
};
