
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const path = require('path');
const { createConnection } = require('./db/connection');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const deployRoutes = require('./routes/deploy');
const logger = require('./utils/logger');
const { generalLimiter } = require('./middleware/rateLimiter');

// Initialiser l'application Express
const app = express();
const PORT = process.env.PORT || 4000;

// Configuration CORS
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['http://localhost:5173'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware de sécurité et configuration
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));
app.use(cors(corsOptions));
app.use(generalLimiter);
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`, {
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });
  next();
});

// Health check endpoint
app.get('/healthcheck', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/deploy', deployRoutes);

// Route pour l'API info
app.get('/api', (req, res) => {
  res.json({
    name: 'TopCenter API',
    version: process.env.API_VERSION || 'v1',
    description: 'API Backend pour TopCenter',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      deploy: '/api/deploy'
    }
  });
});

// Servir les fichiers statiques du frontend en production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
  
  // Route fallback pour SPA
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist', 'index.html'));
  });
}

// Gestionnaire d'erreurs 404
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route non trouvée',
    path: req.originalUrl
  });
});

// Gestionnaire d'erreurs global
app.use((err, req, res, next) => {
  logger.error('Erreur non gérée:', err);
  
  res.status(err.status || 500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' 
      ? 'Erreur interne du serveur' 
      : err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Initialiser la base de données et démarrer le serveur
const startServer = async () => {
  try {
    await createConnection();
    logger.info('Connexion à la base de données établie');
    
    app.listen(PORT, () => {
      logger.info(`Serveur démarré sur le port ${PORT}`);
      logger.info(`Environnement: ${process.env.NODE_ENV || 'development'}`);
      logger.info(`Health check: http://localhost:${PORT}/healthcheck`);
    });
  } catch (error) {
    logger.error('Erreur lors du démarrage du serveur:', error);
    process.exit(1);
  }
};

// Gestion des signaux pour arrêt propre
process.on('SIGTERM', () => {
  logger.info('SIGTERM reçu, arrêt du serveur...');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT reçu, arrêt du serveur...');
  process.exit(0);
});

startServer();

module.exports = app;
