const router = require('express').Router();
const ctrl = require('../controllers/auth.controller');
const { validate } = require('../middleware/validate.middleware');
const { registerRules, loginRules } = require('../validators/auth.validator');
const { authenticate } = require('../middleware/auth.middleware');
const { authLimiter } = require('../middleware/rateLimit.middleware');

router.post('/register', authLimiter, validate(registerRules), ctrl.register);
router.post('/login', authLimiter, validate(loginRules), ctrl.login);
router.post('/forgot-password', authLimiter, ctrl.forgotPassword);
router.post('/reset-password', authLimiter, ctrl.resetPassword);
router.post('/change-password', authenticate, ctrl.changePassword);
router.get('/me', authenticate, ctrl.me);

module.exports = router;