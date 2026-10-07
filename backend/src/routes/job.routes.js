const router = require('express').Router();
const ctrl = require('../controllers/job.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');
const { validate } = require('../middleware/validate.middleware');
const { createJobRules, searchJobRules } = require('../validators/job.validator');
const { audit } = require('../middleware/audit.middleware');

router.get('/', validate(searchJobRules), ctrl.search);
router.get('/mine', authenticate, authorize('COMPANY'), ctrl.mine);
router.get('/stats/public', ctrl.publicStats);
router.get('/:id', ctrl.getById);
// router.post('/', authenticate, authorize('COMPANY'), validate(createJobRules), ctrl.create);
// router.patch('/:id', authenticate, authorize('COMPANY', 'ADMIN'), ctrl.update);
// router.delete('/:id', authenticate, authorize('COMPANY', 'ADMIN'), ctrl.remove);
router.post('/', authenticate, authorize('COMPANY'),
  audit('CREATE', 'JOB'), validate(createJobRules), ctrl.create);

router.patch('/:id', authenticate, authorize('COMPANY', 'ADMIN'),
  audit('UPDATE', 'JOB'), ctrl.update);

router.delete('/:id', authenticate, authorize('COMPANY', 'ADMIN'),
  audit('DELETE', 'JOB'), ctrl.remove);

module.exports = router;