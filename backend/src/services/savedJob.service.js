const db = require('../config/db');

async function save(userId, jobId) {
  await db.query(
    `INSERT INTO saved_jobs (user_id, job_id) VALUES ($1,$2) ON CONFLICT DO NOTHING`,
    [userId, jobId]
  );
}

async function unsave(userId, jobId) {
  await db.query(`DELETE FROM saved_jobs WHERE user_id=$1 AND job_id=$2`, [userId, jobId]);
}

async function list(userId) {
  const r = await db.query(
    `SELECT j.*, c.name AS company_name, c.logo_url AS company_logo, s.saved_at
     FROM saved_jobs s
     JOIN jobs j ON j.id = s.job_id
     JOIN companies c ON c.id = j.company_id
     WHERE s.user_id=$1
     ORDER BY s.saved_at DESC`,
    [userId]
  );
  return r.rows;
}

module.exports = { save, unsave, list };