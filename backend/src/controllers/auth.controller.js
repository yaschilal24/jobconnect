const asyncHandler = require('../utils/asyncHandler');
const svc = require('../services/auth.service');

exports.register = asyncHandler(async (req, res) => {
  const result = await svc.register(req.body);
  res.status(201).json({ success: true, ...result });
});

exports.login = asyncHandler(async (req, res) => {
  const result = await svc.login(req.body);
  res.json({ success: true, ...result });
});

exports.me = asyncHandler(async (req, res) => {
  const user = await svc.me(req.user.id);
  res.json({ success: true, user });
});

exports.forgotPassword = asyncHandler(async (req, res) => {
  await svc.requestPasswordReset(req.body.email);
  res.json({ success: true, message: 'If the email exists, a reset link was sent.' });
});

exports.resetPassword = asyncHandler(async (req, res) => {
  await svc.resetPassword(req.body.token, req.body.password);
  res.json({ success: true, message: 'Password reset successful.' });
});

exports.changePassword = asyncHandler(async (req, res) => {
  await svc.changePassword(req.user.id, req.body.oldPassword, req.body.newPassword);
  res.json({ success: true, message: 'Password changed.' });
});