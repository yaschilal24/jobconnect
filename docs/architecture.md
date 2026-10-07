# Architecture

React (SPA) → Axios → Express REST API → Services → PostgreSQL
Real-time: Socket.IO room per user

Layers:
- Routes: URL → controller
- Controllers: req/res only
- Services: business logic + SQL
- Middleware: auth, RBAC, validation, uploads, audit, errors
- Database: normalized schema with FTS + trigram indexes