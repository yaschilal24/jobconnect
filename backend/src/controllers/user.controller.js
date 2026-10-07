const asyncHandler = require('../utils/asyncHandler');
const svc = require('../services/user.service');

exports.me = asyncHandler(async (req, res) => {
  const profile = await svc.getProfile(req.user.id);
  res.json({ success: true, profile });
});

exports.update = asyncHandler(async (req, res) => {
  await svc.updateProfile(req.user.id, req.body);
  const profile = await svc.getProfile(req.user.id);
  res.json({ success: true, profile });
});

exports.addEducation = asyncHandler(async (req, res) => {
  const education = await svc.addEducation(req.user.id, req.body);
  res.status(201).json({ success: true, education });
});

exports.removeEducation = asyncHandler(async (req, res) => {
  await svc.removeEducation(req.user.id, req.params.id);
  res.status(204).send();
});

exports.addExperience = asyncHandler(async (req, res) => {
  const experience = await svc.addExperience(req.user.id, req.body);
  res.status(201).json({ success: true, experience });
});

exports.removeExperience = asyncHandler(async (req, res) => {
  await svc.removeExperience(req.user.id, req.params.id);
  res.status(204).send();
});

exports.addSkill = asyncHandler(async (req, res) => {
  await svc.addSkill(req.user.id, req.body.name);
  res.status(201).json({ success: true });
});

exports.removeSkill = asyncHandler(async (req, res) => {
  await svc.removeSkill(req.user.id, req.params.skillId);
  res.status(204).send();
});

exports.uploadResume = asyncHandler(async (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No file' });
  const url = `/uploads/${req.file.filename}`;
  await svc.uploadResume(req.user.id, url);
  res.json({ success: true, url });
});

exports.uploadAvatar = asyncHandler(async (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No file' });
  const url = `/uploads/${req.file.filename}`;
  await require('../config/db').query(
    'UPDATE job_seeker_profiles SET avatar_url=$1 WHERE user_id=$2',
    [url, req.user.id]
  );
  res.json({ success: true, url });
});