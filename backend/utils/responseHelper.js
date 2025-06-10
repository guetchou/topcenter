
// Helpers pour standardiser les réponses API

const successResponse = (res, data, message = 'Succès', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  });
};

const errorResponse = (res, message = 'Erreur serveur', statusCode = 500, details = null) => {
  return res.status(statusCode).json({
    success: false,
    message,
    ...(details && { details }),
    timestamp: new Date().toISOString()
  });
};

const validationErrorResponse = (res, errors) => {
  return res.status(400).json({
    success: false,
    message: 'Erreur de validation',
    errors,
    timestamp: new Date().toISOString()
  });
};

module.exports = {
  successResponse,
  errorResponse,
  validationErrorResponse
};
