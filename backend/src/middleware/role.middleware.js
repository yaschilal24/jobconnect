const ApiError = require('../utils/ApiError');

const authorize = (...roles) => (req, _res, next) => {
  if (!req.user) return next(ApiError.unauthorized());
  if (!roles.includes(req.user.role)) {
    return next(ApiError.forbidden('Insufficient role'));
  }
  next();
};

module.exports = { authorize };