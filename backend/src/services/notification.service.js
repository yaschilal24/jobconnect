const db = require('../config/db');
const { emitToUser } = require('../config/socket');

async function create({ userId, title, message, type, link }) {
  const r = await db.query(
    `INSERT INTO notifications (user_id, title, message, type, link)
     VALUES ($1,$2,$3,$4,$5) RETURNING *`,
    [userId, title, message, type, link]
  );
  emitToUser(userId, 'notification', r.rows[0]);
  return r.rows[0];
}

async function list(userId) {
  const r = await db.query(
    `SELECT * FROM notifications WHERE user_id=$1 ORDER BY created_at DESC LIMIT 100`,
    [userId]
  );
  return r.rows;
}

async function markRead(userId, id) {
  await db.query(`UPDATE notifications SET is_read=TRUE WHERE id=$1 AND user_id=$2`, [id, userId]);
}

async function markAllRead(userId) {
  await db.query(`UPDATE notifications SET is_read=TRUE WHERE user_id=$1`, [userId]);
}

async function unreadCount(userId) {
  const r = await db.query(
    `SELECT COUNT(*) FROM notifications WHERE user_id=$1 AND is_read=FALSE`,
    [userId]
  );
  return parseInt(r.rows[0].count, 10);
}

module.exports = { create, list, markRead, markAllRead, unreadCount };