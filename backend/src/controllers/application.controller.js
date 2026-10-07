const asyncHandler = require('../utils/asyncHandler');
const svc = require('../services/application.service');

exports.apply = asyncHandler(async (req, res) => {
  const resumeUrl = req.file ? `/uploads/${req.file.filename}` : req.body.resumeUrl;
  const application = await svc.apply(req.user.id, { ...req.body, resumeUrl });
  res.status(201).json({ success: true, application });
});

exports.mine = asyncHandler(async (req, res) => {
  const applications = await svc.myApplications(req.user.id);
  res.json({ success: true, applications });
});

exports.byJob = asyncHandler(async (req, res) => {
  const applications = await svc.byJob(req.params.jobId, req.user.id);
  res.json({ success: true, applications });
});

exports.updateStatus = asyncHandler(async (req, res) => {
  const { status, note } = req.body;
  const application = await svc.updateStatus(req.params.id, req.user.id, status, note);
  res.json({ success: true, application });
});

exports.withdraw = asyncHandler(async (req, res) => {
  const application = await svc.withdraw(req.params.id, req.user.id);
  res.json({ success: true, application });
});

exports.history = asyncHandler(async (req, res) => {
  const history = await svc.history(req.params.id, req.user.id);
  res.json({ success: true, history });
});