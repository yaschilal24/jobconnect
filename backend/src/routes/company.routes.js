const router = require('express').Router();
const ctrl = require('../controllers/company.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');
const { validate } = require('../middleware/validate.middleware');
const { companyRules } = require('../validators/company.validator');
const { audit } = require('../middleware/audit.middleware');

router.get('/', ctrl.list);
router.get('/mine', authenticate, authorize('COMPANY'), ctrl.mine);
router.post('/', authenticate, authorize('COMPANY'), validate(companyRules), ctrl.upsert);

module.exports = router;