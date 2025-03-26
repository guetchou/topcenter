
const mysql = require('mysql2/promise');
const logger = require('../utils/logger');

// Configuration de la connexion à la base de données
const dbConfig = {
  host: process.env.DB_HOST || 'rj8dl.myd.infomaniak.com',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // Options spécifiques pour MariaDB 10.4
  charset: 'utf8mb4',
  ssl: process.env.DB_SSL === 'true' ? true : undefined
};

// Création du pool de connexions
let pool;

async function createConnection() {
  try {
    logger.info('Tentative de connexion à la base de données Infomaniak...');
    
    pool = mysql.createPool(dbConfig);
    
    // Tester la connexion
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT VERSION() as version');
    
    logger.info(`Connexion établie avec succès à MariaDB version: ${rows[0].version}`);
    
    connection.release();
    
    return pool;
  } catch (error) {
    logger.error('Erreur lors de la connexion à la base de données Infomaniak:', error);
    throw error;
  }
}

function getConnection() {
  if (!pool) {
    throw new Error('La connexion à la base de données n\'est pas initialisée');
  }
  return pool;
}

module.exports = {
  createConnection,
  getConnection
};
