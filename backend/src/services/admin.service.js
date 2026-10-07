const db = require('../config/db');
const ApiError = require('../utils/ApiError');
const auditService = require('./audit.service');

async function stats() {
  const [users, companies, jobs, apps, activeJobs, pendingCompanies] = await Promise.all([
    db.query('SELECT COUNT(*) FROM users'),
    db.query('SELECT COUNT(*) FROM companies'),
    db.query('SELECT COUNT(*) FROM jobs'),
    db.query('SELECT COUNT(*) FROM applications'),
    db.query(`SELECT COUNT(*) FROM jobs WHERE status='OPEN'`),
    db.query(`SELECT COUNT(*) FROM companies WHERE verification_status='PENDING'`),
  ]);
  return {
    totalUsers: parseInt(users.rows[0].count, 10),
    totalCompanies: parseInt(companies.rows[0].count, 10),
    totalJobs: parseInt(jobs.rows[0].count, 10),
    totalApplications: parseInt(apps.rows[0].count, 10),
    activeJobs: parseInt(activeJobs.rows[0].count, 10),
    pendingCompanies: parseInt(pendingCompanies.rows[0].count, 10),
  };
}

async function listUsers({ page = 1, limit = 20, role } = {}) {
  const conditions = [];
  const params = [];
  if (role) { params.push(role); conditions.push(`role = $${params.length}`); }
  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const offset = (page - 1) * limit;
  params.push(limit, offset);

  const r = await db.query(
    `SELECT id, email, first_name, last_name, role, is_active, created_at
     FROM users ${where} ORDER BY created_at DESC
     LIMIT $${params.length - 1} OFFSET $${params.length}`,
    params
  );
  return r.rows;
}

async function toggleUser(id) {
  const r = await db.query(
    `UPDATE users SET is_active = NOT is_active WHERE id=$1 RETURNING id, is_active`,
    [id]
  );
  if (!r.rows.length) throw ApiError.notFound();
  return r.rows[0];
}

async function listCompanies({ status } = {}) {
  const conditions = status ? `WHERE verification_status=$1` : '';
  const params = status ? [status] : [];
  const r = await db.query(
    `SELECT c.*, (SELECT COUNT(*) FROM jobs j WHERE j.company_id=c.id) AS jobs_count
     FROM companies c ${conditions} ORDER BY c.created_at DESC`,
    params
  );
  return r.rows;
}

async function verifyCompany(id, status) {
  if (!['VERIFIED', 'REJECTED', 'PENDING'].includes(status)) throw ApiError.badRequest();
  const r = await db.query(
    `UPDATE companies SET verification_status=$1 WHERE id=$2 RETURNING *`,
    [status, id]
  );
  if (!r.rows.length) throw ApiError.notFound();
  return r.rows[0];
}

async function listJobs({ status } = {}) {
  const conditions = status ? `WHERE j.status=$1` : '';
  const params = status ? [status] : [];
  const r = await db.query(
    `SELECT j.*, c.name AS company_name FROM jobs j
     JOIN companies c ON c.id = j.company_id
     ${conditions} ORDER BY j.created_at DESC`,
    params
  );
  return r.rows;
}

async function deleteJob(id) {
  await db.query('DELETE FROM jobs WHERE id=$1', [id]);
}

async function recentApplications(limit = 10) {
  const r = await db.query(
    `SELECT a.*, j.title AS job_title, c.name AS company_name,
            u.first_name, u.last_name
     FROM applications a
     JOIN jobs j ON j.id = a.job_id
     JOIN companies c ON c.id = j.company_id
     JOIN users u ON u.id = a.applicant_id
     ORDER BY a.applied_at DESC LIMIT $1`,
    [limit]
  );
  return r.rows;
}

async function auditLogs({ page = 1, limit = 50 } = {}) {
  return auditService.list({ page, limit });
}

async function applicationsByDay(days = 14) {
  const r = await db.query(
    `SELECT DATE(applied_at) AS day, COUNT(*) AS count
     FROM applications
     WHERE applied_at >= NOW() - INTERVAL '${days} days'
     GROUP BY day ORDER BY day ASC`
  );
  return r.rows.map((x) => ({ day: x.day, count: parseInt(x.count, 10) }));
}

async function topCompanies(limit = 5) {
  const r = await db.query(
    `SELECT c.name, COUNT(j.id) AS jobs_count,
            (SELECT COUNT(*) FROM applications a WHERE a.job_id IN (SELECT id FROM jobs WHERE company_id = c.id)) AS applications_count
     FROM companies c
     LEFT JOIN jobs j ON j.company_id = c.id
     GROUP BY c.id, c.name
     ORDER BY applications_count DESC
     LIMIT $1`,
    [limit]
  );
  return r.rows.map((x) => ({
    name: x.name,
    jobsCount: parseInt(x.jobs_count, 10),
    applicationsCount: parseInt(x.applications_count, 10),
  }));
}

async function jobsByType() {
  const r = await db.query(
    `SELECT employment_type AS type, COUNT(*) AS count
     FROM jobs GROUP BY employment_type`
  );
  return r.rows.map((x) => ({ type: x.type, count: parseInt(x.count, 10) }));
}


module.exports = {
  stats, listUsers, toggleUser, listCompanies, verifyCompany,
  listJobs, deleteJob, recentApplications, auditLogs,applicationsByDay,
  topCompanies,
  jobsByType,
};