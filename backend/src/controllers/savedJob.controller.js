const asyncHandler = require('../utils/asyncHandler');
const svc = require('../services/savedJob.service');

exports.save = asyncHandler(async (req, res) => {
  await svc.save(req.user.id, req.params.jobId);
  res.status(201).json({ success: true });
});

exports.unsave = asyncHandler(async (req, res) => {
  await svc.unsave(req.user.id, req.params.jobId);
  res.status(204).send();
});

exports.list = asyncHandler(async (req, res) => {
  const jobs = await svc.list(req.user.id);
  res.json({ success: true, jobs });
});