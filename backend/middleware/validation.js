
const Joi = require('joi');

// Schémas de validation
const schemas = {
  register: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    fullName: Joi.string().min(2).max(100).required()
  }),
  
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),
  
  updateProfile: Joi.object({
    fullName: Joi.string().min(2).max(100),
    phone: Joi.string().pattern(/^[+]?[0-9\s\-\(\)]+$/),
    address: Joi.string().max(255)
  }),
  
  resetPassword: Joi.object({
    email: Joi.string().email().required()
  })
};

// Middleware de validation
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schemas[schema].validate(req.body);
    
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Données invalides',
        details: error.details.map(detail => detail.message)
      });
    }
    
    next();
  };
};

module.exports = validate;
