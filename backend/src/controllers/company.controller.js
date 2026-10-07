const asyncHandler = require('../utils/asyncHandler');
const svc = require('../services/company.service');

exports.upsert = asyncHandler(async (req, res) => {
  const company = await svc.upsert(req.user.id, req.body);
  res.json({ success: true, company });
});

exports.mine = asyncHandler(async (req, res) => {
  const company = await svc.getMine(req.user.id);
  res.json({ success: true, company });
});

exports.list = asyncHandler(async (req, res) => {
  const result = await svc.list(req.query);
  res.json({ success: true, ...result });
});