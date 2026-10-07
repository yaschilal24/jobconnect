const db = require('../config/db');
const ApiError = require('../utils/ApiError');
const notificationService = require('./notification.service');
const { pool } = db;

async function apply(userId, { jobId, coverLetter, resumeUrl }) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const job = await client.query(
      `SELECT id, status, posted_by, title FROM jobs WHERE id=$1 FOR UPDATE`,
      [jobId]
    );
    if (!job.rows.length) throw ApiError.notFound('Job not found');
    if (job.rows[0].status !== 'OPEN') throw ApiError.badRequest('Job is closed');

    const dup = await client.query(
      `SELECT id FROM applications WHERE job_id=$1 AND applicant_id=$2`,
      [jobId, userId]
    );
    if (dup.rows.length) throw ApiError.conflict('You already applied for this job');

    const app = await client.query(
      `INSERT INTO applications (job_id, applicant_id, cover_letter, resume_url)
       VALUES ($1,$2,$3,$4) RETURNING *`,
      [jobId, userId, coverLetter, resumeUrl]
    );

    await client.query(
      `INSERT INTO application_status_history (application_id, new_status, changed_by, note)
       VALUES ($1,'APPLIED',$2,'Application submitted')`,
      [app.rows[0].id, userId]
    );

    await client.query('COMMIT');

    await notificationService.create({
      userId: job.rows[0].posted_by,
      title: 'New application received',
      message: `You have a new application for "${job.rows[0].title}"`,
      type: 'APPLICATION_NEW',
      link: `/recruiter/applicants/${jobId}`,
    });

    return app.rows[0];
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}

async function myApplications(userId) {
  const r = await db.query(
    `SELECT a.*, j.title AS job_title, j.employment_type, j.location,
            c.name AS company_name, c.logo_url AS company_logo
     FROM applications a
     JOIN jobs j ON j.id = a.job_id
     JOIN companies c ON c.id = j.company_id
     WHERE a.applicant_id=$1
     ORDER BY a.applied_at DESC`,
    [userId]
  );
  return r.rows;
}

async function byJob(jobId, recruiterId) {
  const job = await db.query('SELECT posted_by FROM jobs WHERE id=$1', [jobId]);
  if (!job.rows.length) throw ApiError.notFound();
  if (job.rows[0].posted_by !== recruiterId) throw ApiError.forbidden();

  const r = await db.query(
    `SELECT a.*, u.first_name, u.last_name, u.email, u.phone,
            p.headline, p.resume_url AS profile_resume
     FROM applications a
     JOIN users u ON u.id = a.applicant_id
     LEFT JOIN job_seeker_profiles p ON p.user_id = u.id
     WHERE a.job_id=$1
     ORDER BY a.applied_at DESC`,
    [jobId]
  );
  return r.rows;
}

async function updateStatus(applicationId, recruiterId, status, note) {
  const app = await db.query(
    `SELECT a.*, j.posted_by, j.title AS job_title
     FROM applications a JOIN jobs j ON j.id = a.job_id
     WHERE a.id=$1`,
    [applicationId]
  );
  if (!app.rows.length) throw ApiError.notFound();
  if (app.rows[0].posted_by !== recruiterId) throw ApiError.forbidden();

  const oldStatus = app.rows[0].status;

  await db.query(`UPDATE applications SET status=$1 WHERE id=$2`, [status, applicationId]);
  await db.query(
    `INSERT INTO application_status_history (application_id, old_status, new_status, changed_by, note)
     VALUES ($1,$2,$3,$4,$5)`,
    [applicationId, oldStatus, status, recruiterId, note || null]
  );

  await notificationService.create({
    userId: app.rows[0].applicant_id,
    title: 'Application status updated',
    message: `Your application for "${app.rows[0].job_title}" is now ${status}`,
    type: 'APPLICATION_STATUS',
    link: '/seeker/applications',
  });

  return { id: applicationId, status };
}

async function withdraw(applicationId, userId) {
  const r = await db.query(
    `UPDATE applications SET status='WITHDRAWN'
     WHERE id=$1 AND applicant_id=$2 AND status IN ('APPLIED','UNDER_REVIEW')
     RETURNING *`,
    [applicationId, userId]
  );
  if (!r.rows.length) throw ApiError.badRequest('Cannot withdraw this application');
  return r.rows[0];
}

async function history(applicationId, userId) {
  const r = await db.query(
    `SELECT h.*, u.first_name, u.last_name
     FROM application_status_history h
     LEFT JOIN users u ON u.id = h.changed_by
     WHERE h.application_id=$1
       AND (
         (SELECT applicant_id FROM applications WHERE id=$1) = $2
         OR (SELECT posted_by FROM jobs WHERE id=(SELECT job_id FROM applications WHERE id=$1)) = $2
       )
     ORDER BY h.created_at ASC`,
    [applicationId, userId]
  );
  return r.rows;
}

module.exports = { apply, myApplications, byJob, updateStatus, withdraw, history };