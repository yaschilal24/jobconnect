# API Documentation

Base URL: `/api`

## Health
- GET /health

## Auth
- POST /auth/register { email, password, firstName, lastName, role }
- POST /auth/login { email, password }
- POST /auth/forgot-password { email }
- POST /auth/reset-password { token, password }
- POST /auth/change-password (auth) { oldPassword, newPassword }
- GET  /auth/me (auth)

## Users
- GET   /users/me (auth)
- PATCH /users/me (auth)
- POST  /users/me/educations (JOB_SEEKER)
- DELETE /users/me/educations/:id (JOB_SEEKER)
- POST  /users/me/experiences (JOB_SEEKER)
- DELETE /users/me/experiences/:id (JOB_SEEKER)
- POST  /users/me/skills (JOB_SEEKER) { name }
- DELETE /users/me/skills/:skillId (JOB_SEEKER)
- POST  /users/me/resume (JOB_SEEKER, multipart "resume")

## Jobs
- GET /jobs?q&type&location&category&experienceLevel&salaryMin&sort&page&limit
- GET /jobs/mine (COMPANY)
- GET /jobs/:id
- POST /jobs (COMPANY)
- PATCH /jobs/:id (COMPANY|ADMIN)
- DELETE /jobs/:id (COMPANY|ADMIN)

## Applications
- POST /applications (JOB_SEEKER, multipart "resume" optional)
- GET /applications/mine (JOB_SEEKER)
- GET /applications/job/:jobId (COMPANY)
- PATCH /applications/:id/status (COMPANY) { status, note? }
- PATCH /applications/:id/withdraw (JOB_SEEKER)
- GET /applications/:id/history (auth)

## Companies
- GET /companies
- GET /companies/mine (COMPANY)
- POST /companies (COMPANY)

## Interviews
- POST /interviews (COMPANY)
- GET /interviews/mine (auth)
- PATCH /interviews/:id/cancel (COMPANY)
- PATCH /interviews/:id/reschedule (COMPANY) { scheduledAt }

## Notifications
- GET /notifications (auth)
- PATCH /notifications/:id/read (auth)
- PATCH /notifications/read-all (auth)

## Saved Jobs
- GET /saved-jobs (JOB_SEEKER)
- POST /saved-jobs/:jobId (JOB_SEEKER)
- DELETE /saved-jobs/:jobId (JOB_SEEKER)

## Admin
- GET /admin/stats
- GET /admin/recent-applications
- GET /admin/audit-logs
- GET /admin/users
- PATCH /admin/users/:id/toggle
- GET /admin/companies
- PATCH /admin/companies/:id/verify { status }
- GET /admin/jobs
- DELETE /admin/jobs/:id