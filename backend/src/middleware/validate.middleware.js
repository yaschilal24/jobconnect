const { validationResult } = require('express-validator');
const ApiError = require('../utils/ApiError');

const validate = (rules) => async (req, _res, next) => {
  await Promise.all(rules.map((r) => r.run(req)));
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();
  const formatted = errors.array().map((e) => ({ field: e.path, message: e.msg }));
  next(ApiError.badRequest('Validation failed', formatted));
};

module.exports = { validate };