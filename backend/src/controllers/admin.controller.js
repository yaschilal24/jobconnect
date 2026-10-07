const asyncHandler = require('../utils/asyncHandler');
const svc = require('../services/admin.service');

exports.stats = asyncHandler(async (_req, res) => {
  const stats = await svc.stats();
  res.json({ success: true, stats });
});

exports.users = asyncHandler(async (req, res) => {
  const users = await svc.listUsers(req.query);
  res.json({ success: true, users });
});

exports.toggleUser = asyncHandler(async (req, res) => {
  const user = await svc.toggleUser(req.params.id);
  res.json({ success: true, user });
});

exports.companies = asyncHandler(async (req, res) => {
  const companies = await svc.listCompanies(req.query);
  res.json({ success: true, companies });
});

exports.verifyCompany = asyncHandler(async (req, res) => {
  const company = await svc.verifyCompany(req.params.id, req.body.status);
  res.json({ success: true, company });
});

exports.jobs = asyncHandler(async (req, res) => {
  const jobs = await svc.listJobs(req.query);
  res.json({ success: true, jobs });
});

exports.deleteJob = asyncHandler(async (req, res) => {
  await svc.deleteJob(req.params.id);
  res.status(204).send();
});

exports.recentApplications = asyncHandler(async (_req, res) => {
  const applications = await svc.recentApplications();
  res.json({ success: true, applications });
});

exports.auditLogs = asyncHandler(async (req, res) => {
  const logs = await svc.auditLogs(req.query);
  res.json({ success: true, logs });
});

exports.charts = asyncHandler(async (_req, res) => {
  const [applicationsByDay, topCompanies, jobsByType] = await Promise.all([
    svc.applicationsByDay(14),
    svc.topCompanies(5),
    svc.jobsByType(),
  ]);
  res.json({ success: true, charts: { applicationsByDay, topCompanies, jobsByType } });
});
