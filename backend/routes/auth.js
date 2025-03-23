
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { getConnection } = require('../db/connection');
const logger = require('../utils/logger');

// Helper pour détecter l'environnement
const isDevEnvironment = () => {
  return process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;
};

// Middleware pour vérifier l'existence d'un utilisateur
async function checkUserExists(req, res, next) {
  const { email } = req.body;
  
  try {
    const pool = getConnection();
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    
    if (rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    next();
  } catch (error) {
    logger.error('Error checking user existence:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

// Route d'inscription
router.post('/register', checkUserExists, async (req, res) => {
  const { email, password, fullName } = req.body;
  
  try {
    // Hachage du mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const pool = getConnection();
    
    // Insertion du nouvel utilisateur
    await pool.query(
      'INSERT INTO users (email, password, full_name, created_at) VALUES (?, ?, ?, NOW())',
      [email, hashedPassword, fullName]
    );
    
    res.status(201).json({ message: 'User registered successfully' });
    
  } catch (error) {
    logger.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Route de connexion
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const pool = getConnection();
    
    // Recherche de l'utilisateur
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    
    if (rows.length === 0) {
      // En développement, on peut autoriser des identifiants par défaut
      if (isDevEnvironment() && email === 'admin@topcenter.app') {
        // Créer un utilisateur fictif pour le développement
        const devUser = {
          id: 999,
          email: 'admin@topcenter.app',
          full_name: 'Admin Dev'
        };
        
        // Création du token JWT
        const token = jwt.sign(
          { id: devUser.id, email: devUser.email },
          process.env.JWT_SECRET || 'your_jwt_secret',
          { expiresIn: '1d' }
        );
        
        return res.json({
          token,
          user: {
            id: devUser.id,
            email: devUser.email,
            fullName: devUser.full_name
          }
        });
      }
      
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const user = rows[0];
    
    // En développement, on peut ignorer la vérification du mot de passe
    let isMatch = false;
    if (isDevEnvironment()) {
      isMatch = true; // En dev, on accepte n'importe quel mot de passe
    } else {
      // En production, on vérifie le mot de passe
      isMatch = await bcrypt.compare(password, user.password);
    }
    
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Création du token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '1d' }
    );
    
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name
      }
    });
    
  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
