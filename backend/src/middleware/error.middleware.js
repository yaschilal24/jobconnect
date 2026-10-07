const ApiError = require('../utils/ApiError');
const { NODE_ENV } = require('../config/env');

const notFound = (_req, _res, next) => next(ApiError.notFound('Route not found'));

const errorHandler = (err, _req, res, _next) => {
  if (err instanceof ApiError) {
    return res.status(err.status).json({ success: false, message: err.message, details: err.details });
  }
  console.error('❌ Unhandled error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    ...(NODE_ENV === 'development' && { error: err.message }),
  });
};

module.exports = { notFound, errorHandler };