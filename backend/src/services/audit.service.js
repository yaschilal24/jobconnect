const db = require('../config/db');

async function record({ userId, action, entity, entityId, metadata }) {
  try {
    await db.query(
      `INSERT INTO audit_logs (user_id, action, entity, entity_id, metadata)
       VALUES ($1,$2,$3,$4,$5)`,
      [userId, action, entity, entityId, metadata ? JSON.stringify(metadata) : null]
    );
  } catch (e) {
    console.error('Audit log failed:', e.message);
  }
}

async function list({ page = 1, limit = 50 } = {}) {
  const offset = (page - 1) * limit;
  const r = await db.query(
    `SELECT a.*, u.email FROM audit_logs a
     LEFT JOIN users u ON u.id = a.user_id
     ORDER BY a.created_at DESC LIMIT $1 OFFSET $2`,
    [limit, offset]
  );
  return r.rows;
}

module.exports = { record, list };