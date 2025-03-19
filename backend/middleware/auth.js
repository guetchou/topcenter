
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

module.exports = function(req, res, next) {
  // Récupérer le token du header
  const token = req.header('x-auth-token');
  
  // Vérifier si le token n'existe pas
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }
  
  try {
    // Vérifier le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    
    // Ajouter l'utilisateur à la requête
    req.user = decoded;
    next();
  } catch (err) {
    logger.error('Token verification failed:', err);
    res.status(401).json({ message: 'Token is not valid' });
  }
};
