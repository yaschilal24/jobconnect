# Interview Prep

## React
- Why protected routes? Prevents unauthorized UI access; server still enforces RBAC.
- Auth state? Context + localStorage + 401 interceptor redirect.
- Difference state vs props? Local for forms, props for reusable display.

## Node/Express
- Why separate controllers/services? Testable business logic.
- asyncHandler purpose? Forwards async errors to error middleware.
- SQL injection prevention? Parameterized `pg` queries.

## PostgreSQL
- Duplicate application enforcement? UNIQUE(job_id, applicant_id).
- Why FTS + GIN? Fast keyword search.
- FOR UPDATE usage? Locks row in transaction.

## JWT
- JWT vs sessions? Stateless for SPA+API.
- Token storage? localStorage (simpler) / httpOnly cookie (safer).
- RBAC mechanism? `authorize('COMPANY')` middleware.

## System Design
- Scale notifications? Redis pub/sub + Socket.IO adapter.
- Large job search? FTS + GIN + pagination + Redis cache.
- CI/CD flow? Push → Actions → tests → build → deploy hooks.