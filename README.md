# JobConnect — Job & Internship Platform

🔗 **Live Demo:** https://jobconnect.vercel.app *(coming soon)*
📚 **API Docs:** `/docs/api-documentation.md`

## 🛠 Tech Stack
- **Frontend:** React, Vite, TailwindCSS, React Router, Socket.IO-client
- **Backend:** Node.js, Express, PostgreSQL, JWT, Multer, Socket.IO
- **DevOps:** Docker Compose, GitHub Actions, Vercel + Render

## ✨ Features
- JWT auth, 3 roles (Job Seeker / Company / Admin)
- Full profiles with education, experience, skills, resume
- Job posting, FTS search, filters, applications
- Interview scheduling, real-time notifications
- Admin dashboard with charts and audit logs

## 🚀 Quick Start
\`\`\`bash
git clone https://github.com/yaschilal24/jobconnect
cd jobconnect/backend && npm install && cp .env.example .env
cd ../frontend && npm install && cp .env.example .env
\`\`\`

See `docs/setup.md` for full instructions.
# JobConnect

A modern full-stack job and internship platform connecting students,
job seekers, recruiters, and companies.

## 🚀 Features

### 👨‍🎓 Job Seekers
- Create an account
- Manage profile
- Search and filter jobs
- View job details
- Apply for jobs
- Save jobs
- Track applications
- Receive notifications
- Manage interviews

### 🏢 Companies / Recruiters
- Create company profile
- Post jobs
- Manage job postings
- Review applications
- Manage candidates
- Schedule interviews

### 👑 Admin
- Dashboard
- Manage users
- Manage companies
- Verify companies
- Manage jobs
- View applications
- Audit logs
- Platform statistics

## 🛠️ Tech Stack

Frontend:
- React
- React Router
- Axios
- Tailwind CSS
- React Hook Form
- Zod
- Recharts

Backend:
- Node.js
- Express.js
- PostgreSQL
- JWT Authentication
- Socket.IO
- REST API

Development:
- Git
- GitHub
- Postman / Thunder Client

## 🏗️ Architecture

React Frontend
       ↓
REST API
       ↓
Express.js Backend
       ↓
PostgreSQL Database

## 📁 Project Structure

jobconnect/
├── frontend/
├── backend/
├── README.md
├── .gitignore
└── LICENSE

## 🔐 Authentication

- JWT-based authentication
- Role-based authorization
- Admin
- Recruiter
- Job Seeker

## 📸 Screenshots

Add screenshots of:
- Landing page
- Login
- Register
- Job search
- Job details
- Job seeker dashboard
- Company dashboard
- Admin dashboard

## ⚙️ Installation

### Clone

git clone YOUR_REPOSITORY_URL

cd jobconnect

### Backend

cd backend
npm install

Create `.env`:

DATABASE_URL=your_database_url
JWT_SECRET=your_secret
CLIENT_URL=http://localhost:5173

npm run dev

### Frontend

cd frontend
npm install
npm run dev

## 🧪 API Testing

API endpoints were tested using Thunder Client/Postman.

## 🎯 Project Goal

JobConnect was developed as a portfolio project to demonstrate
full-stack software engineering skills including frontend development,
backend API development, database design, authentication,
authorization, and real-world application architecture.

## 🔮 Future Improvements

- AI-powered job recommendations
- Resume parsing
- Email notifications
- Advanced analytics
- Video interviews
- Ethiopian job-market localization
- Deployment with CI/CD

## 👨‍💻 Author

Yaschilal Adane

Software Engineering Student