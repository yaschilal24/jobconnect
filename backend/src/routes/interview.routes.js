const router = require('express').Router();
const ctrl = require('../controllers/interview.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');

router.post('/', authenticate, authorize('COMPANY'), ctrl.schedule);
router.get('/mine', authenticate, ctrl.mine);
router.patch('/:id/cancel', authenticate, authorize('COMPANY'), ctrl.cancel);
router.patch('/:id/reschedule', authenticate, authorize('COMPANY'), ctrl.reschedule);

module.exports = router;