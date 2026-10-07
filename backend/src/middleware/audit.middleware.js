const auditService = require('../services/audit.service');

const audit = (action, entity) => (req, _res, next) => {
  req.audit = { action, entity };
  next();
};

const writeAudit = (req, res, next) => {
  res.on('finish', async () => {
    if (!req.audit || res.statusCode >= 400 || !req.user) return;
    await auditService.record({
      userId: req.user.id,
      action: req.audit.action,
      entity: req.audit.entity,
      entityId: req.params.id || null,
      metadata: { method: req.method, path: req.originalUrl },
    });
  });
  next();
};

module.exports = { audit, writeAudit };