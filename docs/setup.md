# Setup

## Prerequisites
- Node 20+, PostgreSQL 16 (or Docker), Git

## 1. Clone
git clone <repo> jobconnect && cd jobconnect

## 2. Start DB
docker run --name jc-db -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=jobconnect -p 5432:5432 -d postgres:16-alpine

## 3. Backend
cd backend
cp .env.example .env
npm install
psql postgresql://postgres:postgres@localhost:5432/jobconnect -f src/database/schema.sql
psql postgresql://postgres:postgres@localhost:5432/jobconnect -f src/database/schema-extra.sql
npm run db:seed
npm run dev

## 4. Frontend
cd ../frontend
cp .env.example .env
npm install
npm run dev

## 5. Open
http://localhost:5173