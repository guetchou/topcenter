
const mysql = require('mysql2/promise');
const logger = require('../utils/logger');

// Configuration de la connexion à la base de données
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Création du pool de connexions
let pool;

async function createConnection() {
  try {
    pool = mysql.createPool(dbConfig);
    
    // Tester la connexion
    const connection = await pool.getConnection();
    connection.release();
    
    logger.info('Database connection pool established');
    return pool;
  } catch (error) {
    logger.error('Error creating database connection:', error);
    throw error;
  }
}

function getConnection() {
  if (!pool) {
    throw new Error('Database connection not initialized');
  }
  return pool;
}

module.exports = {
  createConnection,
  getConnection
};
