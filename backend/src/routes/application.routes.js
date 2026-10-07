const router = require('express').Router();
const ctrl = require('../controllers/application.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');
const { validate } = require('../middleware/validate.middleware');
const { applyRules, statusRules } = require('../validators/application.validator');
const { upload } = require('../middleware/upload.middleware');

router.post('/',
  authenticate, authorize('JOB_SEEKER'),
  upload.single('resume'), validate(applyRules), ctrl.apply);
router.get('/mine', authenticate, authorize('JOB_SEEKER'), ctrl.mine);
router.get('/job/:jobId', authenticate, authorize('COMPANY'), ctrl.byJob);
router.patch('/:id/status', authenticate, authorize('COMPANY'), validate(statusRules), ctrl.updateStatus);
router.patch('/:id/withdraw', authenticate, authorize('JOB_SEEKER'), ctrl.withdraw);
router.get('/:id/history', authenticate, ctrl.history);

module.exports = router;