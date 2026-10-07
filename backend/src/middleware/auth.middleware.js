const { verifyToken } = require('../utils/jwt');
const ApiError = require('../utils/ApiError');

const authenticate = (req, _res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) return next(ApiError.unauthorized('Missing token'));
  try {
    const payload = verifyToken(header.slice(7));
    req.user = { id: payload.sub, role: payload.role, email: payload.email };
    next();
  } catch {
    next(ApiError.unauthorized('Invalid or expired token'));
  }
};

module.exports = { authenticate };