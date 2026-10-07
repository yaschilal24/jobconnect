require('dotenv').config();
const bcrypt = require('bcryptjs');
const db = require('../config/db');

async function seed() {
  try {
    const pw = await bcrypt.hash('Password@123', 10);

    // Admin
    await db.query(
      `INSERT INTO users (email, password_hash, first_name, last_name, role)
       VALUES ($1,$2,'System','Admin','ADMIN')
       ON CONFLICT (email) DO NOTHING`,
      ['admin@jobconnect.dev', pw]
    );

    // Recruiter
    const rec = await db.query(
      `INSERT INTO users (email, password_hash, first_name, last_name, role)
       VALUES ($1,$2,'Rita','Recruiter','COMPANY')
       ON CONFLICT (email) DO UPDATE SET email=EXCLUDED.email
       RETURNING id`,
      ['recruiter@abctech.dev', pw]
    );
    const recruiterId = rec.rows[0].id;

    let comp = await db.query(`SELECT id FROM companies WHERE name='ABC Technology'`);
    if (!comp.rows.length) {
      comp = await db.query(
        `INSERT INTO companies (name, description, industry, location, website, email, verification_status)
         VALUES ('ABC Technology','A leading software development company.',
                 'Software Development','Addis Ababa, Ethiopia',
                 'https://abctech.dev','hr@abctech.dev','VERIFIED')
         RETURNING id`
      );
    }
    const companyId = comp.rows[0].id;

    await db.query(
      `INSERT INTO company_users (company_id, user_id, role) VALUES ($1,$2,'OWNER')
       ON CONFLICT DO NOTHING`,
      [companyId, recruiterId]
    );

    // Seeker
    const seeker = await db.query(
      `INSERT INTO users (email, password_hash, first_name, last_name, role)
       VALUES ($1,$2,'Yaschilal','Adane','JOB_SEEKER')
       ON CONFLICT (email) DO UPDATE SET email=EXCLUDED.email
       RETURNING id`,
      ['seeker@dev.com', pw]
    );
    const seekerId = seeker.rows[0].id;

    const prof = await db.query(
      `INSERT INTO job_seeker_profiles (user_id, headline, bio)
       VALUES ($1,'Full-Stack Developer','Passionate about building web apps.')
       ON CONFLICT (user_id) DO UPDATE SET headline=EXCLUDED.headline
       RETURNING id`,
      [seekerId]
    );
    const profileId = prof.rows[0].id;

    for (const s of ['React', 'Node.js', 'PostgreSQL', 'JavaScript']) {
      const skill = await db.query(
        `INSERT INTO skills (name) VALUES ($1) ON CONFLICT (name) DO UPDATE SET name=EXCLUDED.name RETURNING id`,
        [s]
      );
      await db.query(
        `INSERT INTO user_skills (profile_id, skill_id) VALUES ($1,$2) ON CONFLICT DO NOTHING`,
        [profileId, skill.rows[0].id]
      );
    }

    // Jobs
    const jobCount = await db.query('SELECT COUNT(*) FROM jobs');
    if (parseInt(jobCount.rows[0].count) === 0) {
      await db.query(
        `INSERT INTO jobs (company_id, posted_by, title, description, requirements, location,
                           category, employment_type, experience_level, salary_min, salary_max)
         VALUES
         ($1,$2,'Frontend Developer','Build modern UIs with React and Tailwind.',
          'React, TypeScript, Tailwind experience','Remote','Software Development','FULL_TIME','MID',3000,5000),
         ($1,$2,'Software Engineering Intern','Join our team as an intern and grow your skills.',
          'Currently pursuing CS or related field','Remote','Software Development','INTERNSHIP','ENTRY',500,1000),
         ($1,$2,'Backend Developer','Node.js + PostgreSQL APIs.',
          'Node.js, Express, SQL experience','Addis Ababa','Software Development','FULL_TIME','MID',4000,6000)`,
        [companyId, recruiterId]
      );
    }

    console.log('✅ Seed complete');
    console.log('   admin@jobconnect.dev / Password@123');
    console.log('   recruiter@abctech.dev / Password@123');
    console.log('   seeker@dev.com / Password@123');
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

seed();