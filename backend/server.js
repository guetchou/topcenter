
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const path = require('path');
const { createConnection } = require('./db/connection');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const logger = require('./utils/logger');
const featureFlags = require('./utils/featureFlags');

// Initialiser l'application Express
const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Vérifier la connexion à la base de données
createConnection()
  .then(() => {
    logger.info('Database connection successful');
  })
  .catch(err => {
    logger.error('Database connection failed:', err);
  });

// Feature flags middleware
app.use(featureFlags.middleware);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Ajouter les routes conditionnelles basées sur les feature flags
if (featureFlags.isEnabled('FEATURE_CHATBOT')) {
  const chatbotRoutes = require('./routes/chatbot');
  app.use('/api/chatbot', chatbotRoutes);
  logger.info('Chatbot feature enabled');
}

if (featureFlags.isEnabled('FEATURE_ANALYTICS')) {
  const analyticsRoutes = require('./routes/analytics');
  app.use('/api/analytics', analyticsRoutes);
  logger.info('Analytics feature enabled');
}

// Servir les fichiers statiques du frontend
app.use(express.static(path.join(__dirname, '../public')));

// Route fallback pour SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

// Gestionnaire d'erreurs
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).send('Something broke!');
});

// Démarrer le serveur
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

module.exports = app;
