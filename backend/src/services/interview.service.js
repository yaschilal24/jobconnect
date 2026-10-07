const db = require('../config/db');
const ApiError = require('../utils/ApiError');
const notificationService = require('./notification.service');

/**
 * Schedule an interview for an application.
 * - Only the recruiter who posted the job can schedule.
 * - Moves application.status to INTERVIEW.
 * - Appends to application_status_history.
 * - Sends a notification to the applicant (real-time + DB).
 */
async function schedule(recruiterId, payload) {
  const {
    applicationId,
    interviewType,
    scheduledAt,
    durationMinutes,
    meetingLink,
    location,
    notes,
  } = payload;

  if (!applicationId) throw ApiError.badRequest('applicationId required');
  if (!interviewType) throw ApiError.badRequest('interviewType required');
  if (!scheduledAt) throw ApiError.badRequest('scheduledAt required');

  const app = await db.query(
    `SELECT a.*, j.posted_by, j.title AS job_title
     FROM applications a
     JOIN jobs j ON j.id = a.job_id
     WHERE a.id = $1`,
    [applicationId]
  );
  if (!app.rows.length) throw ApiError.notFound('Application not found');
  if (app.rows[0].posted_by !== recruiterId) throw ApiError.forbidden();

  const result = await db.query(
    `INSERT INTO interviews
       (application_id, scheduled_by, interview_type, scheduled_at,
        duration_minutes, meeting_link, location, notes)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
     RETURNING *`,
    [
      applicationId,
      recruiterId,
      interviewType,
      scheduledAt,
      durationMinutes || 30,
      meetingLink || null,
      location || null,
      notes || null,
    ]
  );

  // Move application to INTERVIEW + append history
  const oldStatus = app.rows[0].status;
  await db.query(`UPDATE applications SET status='INTERVIEW' WHERE id=$1`, [applicationId]);
  await db.query(
    `INSERT INTO application_status_history
       (application_id, old_status, new_status, changed_by, note)
     VALUES ($1,$2,'INTERVIEW',$3,'Interview scheduled')`,
    [applicationId, oldStatus, recruiterId]
  );

  // Notify applicant (real-time + DB)
  await notificationService.create({
    userId: app.rows[0].applicant_id,
    title: 'Interview Scheduled',
    message: `Interview for "${app.rows[0].job_title}" on ${new Date(
      scheduledAt
    ).toLocaleString()}`,
    type: 'INTERVIEW_SCHEDULED',
    link: '/seeker/applications',
  });

  return result.rows[0];
}

/**
 * List interviews for the current user.
 * - COMPANY: interviews they scheduled, enriched with candidate info.
 * - JOB_SEEKER / others: interviews on their applications, enriched with job/company.
 */
async function myInterviews(userId, role) {
  if (role === 'COMPANY') {
    const r = await db.query(
      `SELECT i.*,
              u.first_name, u.last_name, u.email,
              j.title AS job_title
       FROM interviews i
       JOIN applications a ON a.id = i.application_id
       JOIN users u       ON u.id = a.applicant_id
       JOIN jobs  j       ON j.id = a.job_id
       WHERE i.scheduled_by = $1
       ORDER BY i.scheduled_at DESC`,
      [userId]
    );
    return r.rows;
  }

  const r = await db.query(
    `SELECT i.*,
            j.title AS job_title,
            c.name  AS company_name
     FROM interviews i
     JOIN applications a ON a.id = i.application_id
     JOIN jobs         j ON j.id = a.job_id
     JOIN companies    c ON c.id = j.company_id
     WHERE a.applicant_id = $1
     ORDER BY i.scheduled_at DESC`,
    [userId]
  );
  return r.rows;
}

/**
 * Cancel an interview. Only the recruiter who created it can cancel.
 * Reverts application status back to SHORTLISTED and notifies the applicant.
 */
async function cancel(id, userId) {
  const existing = await db.query(
    `SELECT i.*, a.applicant_id, j.title AS job_title
     FROM interviews i
     JOIN applications a ON a.id = i.application_id
     JOIN jobs j         ON j.id = a.job_id
     WHERE i.id = $1`,
    [id]
  );
  if (!existing.rows.length) throw ApiError.notFound('Interview not found');
  const interview = existing.rows[0];
  if (interview.scheduled_by !== userId) throw ApiError.forbidden();

  const r = await db.query(
    `UPDATE interviews SET status='CANCELLED'
     WHERE id=$1 RETURNING *`,
    [id]
  );

  // Revert application status so recruiter can re-shortlist / re-schedule
  await db.query(
    `UPDATE applications SET status='SHORTLISTED' WHERE id=$1`,
    [interview.application_id]
  );
  await db.query(
    `INSERT INTO application_status_history
       (application_id, old_status, new_status, changed_by, note)
     VALUES ($1,'INTERVIEW','SHORTLISTED',$2,'Interview cancelled')`,
    [interview.application_id, userId]
  );

  await notificationService.create({
    userId: interview.applicant_id,
    title: 'Interview Cancelled',
    message: `Your interview for "${interview.job_title}" has been cancelled.`,
    type: 'INTERVIEW_CANCELLED',
    link: '/seeker/applications',
  });

  return r.rows[0];
}

/**
 * Reschedule an interview. Only the recruiter who created it can do this.
 * Notifies the applicant of the new date/time.
 */
async function reschedule(id, userId, scheduledAt) {
  if (!scheduledAt) throw ApiError.badRequest('scheduledAt required');

  const existing = await db.query(
    `SELECT i.*, a.applicant_id, j.title AS job_title
     FROM interviews i
     JOIN applications a ON a.id = i.application_id
     JOIN jobs j         ON j.id = a.job_id
     WHERE i.id = $1`,
    [id]
  );
  if (!existing.rows.length) throw ApiError.notFound('Interview not found');
  const interview = existing.rows[0];
  if (interview.scheduled_by !== userId) throw ApiError.forbidden();

  const r = await db.query(
    `UPDATE interviews
     SET scheduled_at = $1, status = 'SCHEDULED'
     WHERE id = $2
     RETURNING *`,
    [scheduledAt, id]
  );

  await notificationService.create({
    userId: interview.applicant_id,
    title: 'Interview Rescheduled',
    message: `Your interview for "${interview.job_title}" is now on ${new Date(
      scheduledAt
    ).toLocaleString()}`,
    type: 'INTERVIEW_RESCHEDULED',
    link: '/seeker/applications',
  });

  return r.rows[0];
}

/**
 * Get a single interview by id (used by detail views).
 * Access: recruiter who scheduled it, or the applicant.
 */
async function getById(id, userId, role) {
  const r = await db.query(
    `SELECT i.*,
            a.applicant_id, a.job_id, a.status AS application_status,
            j.title AS job_title, j.posted_by,
            c.name AS company_name,
            u.first_name AS applicant_first, u.last_name AS applicant_last, u.email AS applicant_email
     FROM interviews i
     JOIN applications a ON a.id = i.application_id
     JOIN jobs         j ON j.id = a.job_id
     JOIN companies    c ON c.id = j.company_id
     JOIN users        u ON u.id = a.applicant_id
     WHERE i.id = $1`,
    [id]
  );
  if (!r.rows.length) throw ApiError.notFound('Interview not found');
  const iv = r.rows[0];

  const allowed =
    role === 'ADMIN' ||
    iv.scheduled_by === userId ||
    iv.applicant_id === userId;
  if (!allowed) throw ApiError.forbidden();

  return iv;
}

module.exports = { schedule, myInterviews, cancel, reschedule, getById };