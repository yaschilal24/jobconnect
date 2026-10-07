const asyncHandler = require('../utils/asyncHandler');
const svc = require('../services/job.service');

exports.search = asyncHandler(async (req, res) => {
  const result = await svc.search(req.query);
  res.json({ success: true, ...result });
});

exports.getById = asyncHandler(async (req, res) => {
  const job = await svc.getById(req.params.id);
  res.json({ success: true, job });
});

exports.create = asyncHandler(async (req, res) => {
  const job = await svc.create(req.user.id, req.body);
  res.status(201).json({ success: true, job });
});

exports.update = asyncHandler(async (req, res) => {
  const job = await svc.update(req.params.id, req.user.id, req.body);
  res.json({ success: true, job });
});

exports.remove = asyncHandler(async (req, res) => {
  await svc.remove(req.params.id, req.user.id, req.user.role === 'ADMIN');
  res.status(204).send();
});

exports.mine = asyncHandler(async (req, res) => {
  const jobs = await svc.myJobs(req.user.id);
  res.json({ success: true, jobs });
});
 //add the public state
exports.publicStats = asyncHandler(async (_req, res) => {
  const stats = await svc.publicStats();
  res.json({ success: true, stats });
});