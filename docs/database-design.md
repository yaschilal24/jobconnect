# Database Design

Tables: users, password_resets, job_seeker_profiles, educations, experiences,
skills, user_skills, companies, company_users, jobs, applications,
application_status_history, interviews, saved_jobs, notifications, audit_logs.

Key constraints:
- users.email UNIQUE
- applications(job_id, applicant_id) UNIQUE
- company_users(company_id, user_id) composite PK
- saved_jobs(user_id, job_id) composite PK

Indexes:
- jobs.search_vector GIN (FTS)
- jobs.location GIN trigram (fuzzy)
- applications(status), applications(job_id), applications(applicant_id)
- notifications(user_id, is_read)

Triggers: set_updated_at on users/jobs/applications/companies
         jobs_search_vector_update on jobs