
const express = require('express');
const router = express.Router();
const logger = require('../utils/logger');
const { getConnection } = require('../db/connection');

// Obtenir toutes les traductions disponibles
router.get('/languages', async (req, res) => {
  try {
    const connection = getConnection();
    const [languages] = await connection.query(`
      SELECT * FROM languages WHERE active = 1
    `);
    
    res.json({ success: true, languages });
  } catch (error) {
    logger.error('Error fetching languages:', error);
    res.status(500).json({ success: false, message: 'Erreur lors de la récupération des langues' });
  }
});

// Obtenir les traductions pour une langue spécifique
router.get('/translations/:lang', async (req, res) => {
  try {
    const { lang } = req.params;
    const connection = getConnection();
    
    const [translations] = await connection.query(`
      SELECT key, value FROM translations WHERE lang_code = ?
    `, [lang]);
    
    // Formater les traductions en objet
    const translationsObject = translations.reduce((obj, item) => {
      obj[item.key] = item.value;
      return obj;
    }, {});
    
    res.json({ success: true, translations: translationsObject });
  } catch (error) {
    logger.error('Error fetching translations:', error);
    res.status(500).json({ success: false, message: 'Erreur lors de la récupération des traductions' });
  }
});

// Traduire un texte à la volée
router.post('/translate', async (req, res) => {
  try {
    const { text, targetLang } = req.body;
    
    if (!text || !targetLang) {
      return res.status(400).json({ success: false, message: 'Le texte et la langue cible sont requis' });
    }
    
    // Simulation d'une API de traduction
    // Dans un environnement de production, vous connecteriez ici une API comme Google Translate
    const translatedText = `[${targetLang}] ${text}`;
    
    res.json({ success: true, translatedText });
  } catch (error) {
    logger.error('Error translating text:', error);
    res.status(500).json({ success: false, message: 'Erreur lors de la traduction du texte' });
  }
});

// Mettre à jour une traduction
router.put('/translations/:lang/:key', async (req, res) => {
  try {
    const { lang, key } = req.params;
    const { value } = req.body;
    
    if (!value) {
      return res.status(400).json({ success: false, message: 'La valeur de traduction est requise' });
    }
    
    const connection = getConnection();
    
    await connection.query(`
      INSERT INTO translations (lang_code, key, value) 
      VALUES (?, ?, ?) 
      ON DUPLICATE KEY UPDATE value = ?
    `, [lang, key, value, value]);
    
    res.json({ success: true, message: 'Traduction mise à jour avec succès' });
  } catch (error) {
    logger.error('Error updating translation:', error);
    res.status(500).json({ success: false, message: 'Erreur lors de la mise à jour de la traduction' });
  }
});

module.exports = router;
