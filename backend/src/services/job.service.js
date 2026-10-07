const db = require('../config/db');
const ApiError = require('../utils/ApiError');

async function search({ q, type, location, category, experienceLevel, salaryMin, sort, page = 1, limit = 10 }) {
  const conditions = [`j.status = 'OPEN'`];
  const params = [];

  if (q) {
    params.push(q);
    conditions.push(`j.search_vector @@ plainto_tsquery('english', $${params.length})`);
  }
  if (type) { params.push(type); conditions.push(`j.employment_type = $${params.length}`); }
  if (location) { params.push(`%${location}%`); conditions.push(`j.location ILIKE $${params.length}`); }
  if (category) { params.push(category); conditions.push(`j.category = $${params.length}`); }
  if (experienceLevel) { params.push(experienceLevel); conditions.push(`j.experience_level = $${params.length}`); }
  if (salaryMin) { params.push(salaryMin); conditions.push(`j.salary_max >= $${params.length}`); }

  const sortMap = {
    newest: 'j.created_at DESC',
    oldest: 'j.created_at ASC',
    salary_desc: 'j.salary_max DESC NULLS LAST',
    salary_asc: 'j.salary_min ASC NULLS LAST',
  };
  const orderBy = sortMap[sort] || sortMap.newest;

  const offset = (page - 1) * limit;
  params.push(limit, offset);

  const sql = `
    SELECT j.*, c.name AS company_name, c.logo_url AS company_logo, c.location AS company_location
    FROM jobs j
    JOIN companies c ON c.id = j.company_id
    WHERE ${conditions.join(' AND ')}
    ORDER BY ${orderBy}
    LIMIT $${params.length - 1} OFFSET $${params.length}
  `;
  const countSql = `SELECT COUNT(*) FROM jobs j WHERE ${conditions.join(' AND ')}`;
  const countParams = params.slice(0, -2);

  const [items, total] = await Promise.all([
    db.query(sql, params),
    db.query(countSql, countParams),
  ]);

  const totalNum = parseInt(total.rows[0].count, 10);
  return { items: items.rows, meta: { page, limit, total: totalNum, pages: Math.ceil(totalNum / limit) } };
}

async function getById(id) {
  const r = await db.query(
    `SELECT j.*, c.name AS company_name, c.description AS company_description,
            c.website AS company_website, c.location AS company_location,
            c.logo_url AS company_logo, c.industry AS company_industry,
            u.first_name AS recruiter_first, u.last_name AS recruiter_last
     FROM jobs j
     JOIN companies c ON c.id = j.company_id
     JOIN users u ON u.id = j.posted_by
     WHERE j.id=$1`,
    [id]
  );
  if (!r.rows.length) throw ApiError.notFound('Job not found');
  return r.rows[0];
}

async function create(userId, payload) {
  const cu = await db.query(
    `SELECT company_id FROM company_users WHERE user_id=$1 LIMIT 1`, [userId]
  );
  if (!cu.rows.length) throw ApiError.badRequest('Create a company profile first');

  const {
    title, description, requirements, responsibilities, location, category,
    employmentType, experienceLevel, salaryMin, salaryMax, currency, positions, deadline,
  } = payload;

  const r = await db.query(
    `INSERT INTO jobs (company_id, posted_by, title, description, requirements, responsibilities,
                       location, category, employment_type, experience_level,
                       salary_min, salary_max, currency, positions, deadline)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15) RETURNING *`,
    [cu.rows[0].company_id, userId, title, description, requirements, responsibilities,
     location, category, employmentType, experienceLevel,
     salaryMin, salaryMax, currency || 'USD', positions || 1, deadline || null]
  );
  return r.rows[0];
}

async function update(id, userId, payload) {
  const job = await db.query('SELECT * FROM jobs WHERE id=$1', [id]);
  if (!job.rows.length) throw ApiError.notFound();
  if (job.rows[0].posted_by !== userId) throw ApiError.forbidden();

  const map = {
    title: 'title', description: 'description', requirements: 'requirements',
    responsibilities: 'responsibilities', location: 'location', category: 'category',
    employmentType: 'employment_type', experienceLevel: 'experience_level',
    salaryMin: 'salary_min', salaryMax: 'salary_max', currency: 'currency',
    positions: 'positions', deadline: 'deadline', status: 'status',
  };
  const fields = [];
  const values = [];

  Object.keys(payload).forEach((key) => {
    if (map[key] && payload[key] !== undefined) {
      values.push(payload[key]);
      fields.push(`${map[key]} = $${values.length}`);
    }
  });
  if (!fields.length) throw ApiError.badRequest('No fields to update');

  values.push(id);
  const r = await db.query(
    `UPDATE jobs SET ${fields.join(', ')} WHERE id = $${values.length} RETURNING *`,
    values
  );
  return r.rows[0];
}

async function remove(id, userId, isAdmin = false) {
  const job = await db.query('SELECT * FROM jobs WHERE id=$1', [id]);
  if (!job.rows.length) throw ApiError.notFound();
  if (!isAdmin && job.rows[0].posted_by !== userId) throw ApiError.forbidden();
  await db.query('DELETE FROM jobs WHERE id=$1', [id]);
}

async function myJobs(userId) {
  const r = await db.query(
    `SELECT j.*, (SELECT COUNT(*) FROM applications a WHERE a.job_id = j.id) AS applications_count
     FROM jobs j WHERE j.posted_by=$1 ORDER BY j.created_at DESC`,
    [userId]
  );
  return r.rows;
}
// add the public state
async function publicStats() {
  const [users, companies, jobs] = await Promise.all([
    db.query(`SELECT COUNT(*) FROM users WHERE role='JOB_SEEKER'`),
    db.query(`SELECT COUNT(*) FROM companies WHERE verification_status='VERIFIED'`),
    db.query(`SELECT COUNT(*) FROM jobs WHERE status='OPEN'`),
  ]);
  return {
    totalSeekers: parseInt(users.rows[0].count, 10),
    totalCompanies: parseInt(companies.rows[0].count, 10),
    totalJobs: parseInt(jobs.rows[0].count, 10),
  };
}

 
module.exports = { search, getById, create, update, remove, myJobs,publicStats };