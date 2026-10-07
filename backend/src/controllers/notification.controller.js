const asyncHandler = require('../utils/asyncHandler');
const svc = require('../services/notification.service');

exports.list = asyncHandler(async (req, res) => {
  const notifications = await svc.list(req.user.id);
  const unread = await svc.unreadCount(req.user.id);
  res.json({ success: true, notifications, unread });
});

exports.markRead = asyncHandler(async (req, res) => {
  await svc.markRead(req.user.id, req.params.id);
  res.json({ success: true });
});

exports.markAllRead = asyncHandler(async (req, res) => {
  await svc.markAllRead(req.user.id);
  res.json({ success: true });
});