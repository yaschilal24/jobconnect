const crypto = require('crypto');
const db = require('../config/db');
const { hashPassword, comparePassword } = require('../utils/password');
const { signToken } = require('../utils/jwt');
const ApiError = require('../utils/ApiError');

const sanitize = (u) => ({
  id: u.id,
  email: u.email,
  firstName: u.first_name,
  lastName: u.last_name,
  role: u.role,
  phone: u.phone,
  location: u.location,
});

async function register({ email, password, firstName, lastName, role }) {
  const existing = await db.query('SELECT id FROM users WHERE email=$1', [email]);
  if (existing.rows.length) throw ApiError.conflict('Email already registered');

  const passwordHash = await hashPassword(password);
  const r = await db.query(
    `INSERT INTO users (email, password_hash, first_name, last_name, role)
     VALUES ($1,$2,$3,$4,$5) RETURNING *`,
    [email, passwordHash, firstName, lastName, role]
  );
  const user = r.rows[0];

  if (role === 'JOB_SEEKER') {
    await db.query(`INSERT INTO job_seeker_profiles (user_id) VALUES ($1)`, [user.id]);
  }

  const token = signToken({ sub: user.id, role: user.role, email: user.email });
  return { user: sanitize(user), token };
}

async function login({ email, password }) {
  const r = await db.query('SELECT * FROM users WHERE email=$1', [email]);
  if (!r.rows.length) throw ApiError.unauthorized('Invalid credentials');
  const user = r.rows[0];
  if (!user.is_active) throw ApiError.forbidden('Account disabled');

  const ok = await comparePassword(password, user.password_hash);
  if (!ok) throw ApiError.unauthorized('Invalid credentials');

  const token = signToken({ sub: user.id, role: user.role, email: user.email });
  return { user: sanitize(user), token };
}

async function me(userId) {
  const r = await db.query(
    `SELECT u.id, u.email, u.first_name, u.last_name, u.role, u.phone, u.location,
            p.headline, p.bio, p.avatar_url, p.resume_url,
            c.id AS company_id, c.name AS company_name, c.verification_status
     FROM users u
     LEFT JOIN job_seeker_profiles p ON p.user_id = u.id
     LEFT JOIN company_users cu ON cu.user_id = u.id
     LEFT JOIN companies c ON c.id = cu.company_id
     WHERE u.id=$1`,
    [userId]
  );
  if (!r.rows.length) throw ApiError.notFound('User not found');
  const row = r.rows[0];
  return {
    id: row.id,
    email: row.email,
    firstName: row.first_name,
    lastName: row.last_name,
    role: row.role,
    phone: row.phone,
    location: row.location,
    profile: {
      headline: row.headline,
      bio: row.bio,
      avatarUrl: row.avatar_url,
      resumeUrl: row.resume_url,
    },
    company: row.company_id
      ? { id: row.company_id, name: row.company_name, verificationStatus: row.verification_status }
      : null,
  };
}

async function requestPasswordReset(email) {
  const user = await db.query('SELECT id FROM users WHERE email=$1', [email]);
  if (!user.rows.length) return;
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
  await db.query(
    `INSERT INTO password_resets (user_id, token, expires_at) VALUES ($1,$2,$3)`,
    [user.rows[0].id, token, expiresAt]
  );
  console.log(`🔐 Password reset token for ${email}: ${token}`);
  return token;
}

async function resetPassword(token, newPassword) {
  const row = await db.query(
    `SELECT * FROM password_resets WHERE token=$1 AND used=FALSE AND expires_at > NOW()`,
    [token]
  );
  if (!row.rows.length) throw ApiError.badRequest('Invalid or expired token');
  const hash = await hashPassword(newPassword);
  await db.query('UPDATE users SET password_hash=$1 WHERE id=$2', [hash, row.rows[0].user_id]);
  await db.query('UPDATE password_resets SET used=TRUE WHERE token=$1', [token]);
}

async function changePassword(userId, oldPassword, newPassword) {
  const user = await db.query('SELECT password_hash FROM users WHERE id=$1', [userId]);
  if (!user.rows.length) throw ApiError.notFound();
  const ok = await comparePassword(oldPassword, user.rows[0].password_hash);
  if (!ok) throw ApiError.badRequest('Current password is incorrect');
  const hash = await hashPassword(newPassword);
  await db.query('UPDATE users SET password_hash=$1 WHERE id=$2', [hash, userId]);
}

module.exports = {
  register, login, me, requestPasswordReset, resetPassword, changePassword,
};