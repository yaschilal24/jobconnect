const router = require('express').Router();

router.use('/auth', require('./auth.routes'));
router.use('/users', require('./user.routes'));
router.use('/jobs', require('./job.routes'));
router.use('/applications', require('./application.routes'));
router.use('/companies', require('./company.routes'));
router.use('/interviews', require('./interview.routes'));
router.use('/notifications', require('./notification.routes'));
router.use('/saved-jobs', require('./savedJob.routes'));
router.use('/admin', require('./admin.routes'));

router.get('/health', (_req, res) =>
  res.json({ success: true, status: 'ok', timestamp: new Date().toISOString() }));

module.exports = router;