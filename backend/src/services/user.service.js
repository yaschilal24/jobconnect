const db = require('../config/db');
const ApiError = require('../utils/ApiError');

async function recalculateCompletion(userId) {
  const r = await db.query(
    `SELECT u.phone, u.location, p.headline, p.bio, p.resume_url,
            (SELECT COUNT(*) FROM educations WHERE profile_id=p.id) AS edu_count,
            (SELECT COUNT(*) FROM experiences WHERE profile_id=p.id) AS exp_count,
            (SELECT COUNT(*) FROM user_skills WHERE profile_id=p.id) AS skill_count
     FROM users u JOIN job_seeker_profiles p ON p.user_id = u.id
     WHERE u.id=$1`,
    [userId]
  );
  if (!r.rows.length) return;
  const d = r.rows[0];
  const checks = [
    !!d.phone, !!d.location, !!d.headline, !!d.bio, !!d.resume_url,
    d.edu_count > 0, d.exp_count > 0, d.skill_count > 0,
  ];
  const pct = Math.round((checks.filter(Boolean).length / checks.length) * 100);
  await db.query('UPDATE job_seeker_profiles SET profile_completion=$1 WHERE user_id=$2', [pct, userId]);
}

async function getProfile(userId) {
  const r = await db.query(
    `SELECT u.id, u.email, u.first_name, u.last_name, u.role, u.phone, u.location,
            p.id AS profile_id, p.headline, p.bio, p.linkedin, p.github, p.portfolio,
            p.resume_url, p.avatar_url, p.profile_completion
     FROM users u
     LEFT JOIN job_seeker_profiles p ON p.user_id = u.id
     WHERE u.id=$1`,
    [userId]
  );
  if (!r.rows.length) throw ApiError.notFound();
  const profile = r.rows[0];

  const [edu, exp, skills] = await Promise.all([
    db.query('SELECT * FROM educations WHERE profile_id=$1 ORDER BY end_year DESC NULLS LAST', [profile.profile_id]),
    db.query('SELECT * FROM experiences WHERE profile_id=$1 ORDER BY end_date DESC NULLS LAST', [profile.profile_id]),
    db.query(
      `SELECT s.id, s.name FROM user_skills us
       JOIN skills s ON s.id = us.skill_id
       WHERE us.profile_id=$1`,
      [profile.profile_id]
    ),
  ]);

  return { ...profile, educations: edu.rows, experiences: exp.rows, skills: skills.rows };
}

async function updateProfile(userId, payload) {
  const { firstName, lastName, phone, location, headline, bio, linkedin, github, portfolio } = payload;

  await db.query(
    `UPDATE users SET
       first_name = COALESCE($1, first_name),
       last_name = COALESCE($2, last_name),
       phone = COALESCE($3, phone),
       location = COALESCE($4, location)
     WHERE id=$5`,
    [firstName, lastName, phone, location, userId]
  );

  await db.query(
    `UPDATE job_seeker_profiles SET
       headline = COALESCE($1, headline),
       bio = COALESCE($2, bio),
       linkedin = COALESCE($3, linkedin),
       github = COALESCE($4, github),
       portfolio = COALESCE($5, portfolio),
       updated_at = NOW()
     WHERE user_id=$6`,
    [headline, bio, linkedin, github, portfolio, userId]
  );

  await recalculateCompletion(userId);
}

async function addEducation(userId, data) {
  const prof = await db.query('SELECT id FROM job_seeker_profiles WHERE user_id=$1', [userId]);
  if (!prof.rows.length) throw ApiError.notFound();
  const r = await db.query(
    `INSERT INTO educations (profile_id, institution, degree, field, start_year, end_year, description)
     VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
    [prof.rows[0].id, data.institution, data.degree, data.field, data.startYear, data.endYear, data.description]
  );
  await recalculateCompletion(userId);
  return r.rows[0];
}

async function removeEducation(userId, id) {
  await db.query(
    `DELETE FROM educations WHERE id=$1 AND profile_id=(SELECT id FROM job_seeker_profiles WHERE user_id=$2)`,
    [id, userId]
  );
  await recalculateCompletion(userId);
}

async function addExperience(userId, data) {
  const prof = await db.query('SELECT id FROM job_seeker_profiles WHERE user_id=$1', [userId]);
  if (!prof.rows.length) throw ApiError.notFound();
  const r = await db.query(
    `INSERT INTO experiences (profile_id, company, position, start_date, end_date, current, description)
     VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
    [prof.rows[0].id, data.company, data.position, data.startDate || null,
     data.endDate || null, data.current || false, data.description]
  );
  await recalculateCompletion(userId);
  return r.rows[0];
}

async function removeExperience(userId, id) {
  await db.query(
    `DELETE FROM experiences WHERE id=$1 AND profile_id=(SELECT id FROM job_seeker_profiles WHERE user_id=$2)`,
    [id, userId]
  );
  await recalculateCompletion(userId);
}

async function addSkill(userId, name) {
  const prof = await db.query('SELECT id FROM job_seeker_profiles WHERE user_id=$1', [userId]);
  if (!prof.rows.length) throw ApiError.notFound();
  let skill = await db.query('SELECT id FROM skills WHERE name ILIKE $1', [name]);
  if (!skill.rows.length) {
    skill = await db.query('INSERT INTO skills (name) VALUES ($1) RETURNING id', [name]);
  }
  await db.query(
    `INSERT INTO user_skills (profile_id, skill_id) VALUES ($1,$2) ON CONFLICT DO NOTHING`,
    [prof.rows[0].id, skill.rows[0].id]
  );
  await recalculateCompletion(userId);
}

async function removeSkill(userId, skillId) {
  await db.query(
    `DELETE FROM user_skills WHERE skill_id=$1 AND profile_id=(SELECT id FROM job_seeker_profiles WHERE user_id=$2)`,
    [skillId, userId]
  );
  await recalculateCompletion(userId);
}

async function uploadResume(userId, url) {
  await db.query('UPDATE job_seeker_profiles SET resume_url=$1 WHERE user_id=$2', [url, userId]);
  await recalculateCompletion(userId);
}

module.exports = {
  getProfile, updateProfile, addEducation, removeEducation,
  addExperience, removeExperience, addSkill, removeSkill, uploadResume,
};