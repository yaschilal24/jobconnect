const db = require('../config/db');
const ApiError = require('../utils/ApiError');

async function upsert(userId, payload) {
  const existing = await db.query(
    'SELECT company_id FROM company_users WHERE user_id=$1 LIMIT 1', [userId]
  );

  if (existing.rows.length) {
    const r = await db.query(
      `UPDATE companies SET name=$1, description=$2, industry=$3, location=$4,
                            website=$5, email=$6, phone=$7
       WHERE id=$8 RETURNING *`,
      [payload.name, payload.description, payload.industry, payload.location,
       payload.website, payload.email, payload.phone, existing.rows[0].company_id]
    );
    return r.rows[0];
  }

  const created = await db.query(
    `INSERT INTO companies (name, description, industry, location, website, email, phone)
     VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
    [payload.name, payload.description, payload.industry, payload.location,
     payload.website, payload.email, payload.phone]
  );
  await db.query(
    `INSERT INTO company_users (company_id, user_id, role) VALUES ($1,$2,'OWNER')`,
    [created.rows[0].id, userId]
  );
  return created.rows[0];
}

async function getMine(userId) {
  const r = await db.query(
    `SELECT c.* FROM companies c
     JOIN company_users cu ON cu.company_id = c.id
     WHERE cu.user_id=$1 LIMIT 1`,
    [userId]
  );
  return r.rows[0] || null;
}

async function list({ page = 1, limit = 20 } = {}) {
  const offset = (page - 1) * limit;
  const [items, total] = await Promise.all([
    db.query(
      `SELECT c.*, (SELECT COUNT(*) FROM jobs j WHERE j.company_id=c.id) AS jobs_count
       FROM companies c WHERE c.verification_status='VERIFIED'
       ORDER BY c.created_at DESC LIMIT $1 OFFSET $2`,
      [limit, offset]
    ),
    db.query(`SELECT COUNT(*) FROM companies WHERE verification_status='VERIFIED'`),
  ]);
  const totalNum = parseInt(total.rows[0].count, 10);
  return { items: items.rows, meta: { page, limit, total: totalNum, pages: Math.ceil(totalNum / limit) } };
}

module.exports = { upsert, getMine, list };