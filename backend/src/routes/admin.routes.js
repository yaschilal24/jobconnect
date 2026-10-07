const router = require('express').Router();
const ctrl = require('../controllers/admin.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');
const { audit } = require('../middleware/audit.middleware');

router.use(authenticate, authorize('ADMIN'));
router.get('/stats', ctrl.stats);
router.get('/recent-applications', ctrl.recentApplications);
router.get('/audit-logs', ctrl.auditLogs);
router.get('/users', ctrl.users);
router.patch('/users/:id/toggle', ctrl.toggleUser);
router.get('/companies', ctrl.companies);
router.patch('/companies/:id/verify', ctrl.verifyCompany);
router.get('/jobs', ctrl.jobs);
router.delete('/jobs/:id', ctrl.deleteJob);
router.get('/charts', ctrl.charts);

module.exports = router;