const router = require('express').Router();
const ctrl = require('../controllers/savedJob.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');

router.get('/', authenticate, authorize('JOB_SEEKER'), ctrl.list);
router.post('/:jobId', authenticate, authorize('JOB_SEEKER'), ctrl.save);
router.delete('/:jobId', authenticate, authorize('JOB_SEEKER'), ctrl.unsave);

module.exports = router;