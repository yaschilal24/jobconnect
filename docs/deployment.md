# Deployment

## Backend → Render
1. Create PostgreSQL (Neon/Render). Copy DATABASE_URL.
2. New Web Service:
   - Build: `npm install`
   - Start: `npm start`
   - Env: DATABASE_URL, JWT_SECRET, CLIENT_URL, NODE_ENV=production
3. From local: psql $DATABASE_URL -f backend/src/database/schema.sql && psql $DATABASE_URL -f backend/src/database/schema-extra.sql

## Frontend → Vercel
1. Import repo → Root: `frontend/`
2. Build: `npm run build` · Output: `dist`
3. Env: VITE_API_URL=https://your-api.onrender.com/api
4. vercel.json includes SPA rewrite.

## Secrets
Generate a strong JWT: `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`