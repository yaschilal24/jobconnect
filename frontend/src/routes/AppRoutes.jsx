import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
// add import near the other recruiter imports
import EditJob from '../pages/recruiter/EditJob';

import Home from '../pages/public/Home';
import Jobs from '../pages/public/Jobs';
import JobDetail from '../pages/public/JobDetail';
import Companies from '../pages/public/Companies';
import About from '../pages/public/About';
import Login from '../pages/public/Login';
import Register from '../pages/public/Register';
import ForgotPassword from '../pages/public/ForgotPassword';
import ResetPassword from '../pages/public/ResetPassword';

import SeekerDashboard from '../pages/seeker/SeekerDashboard';
import MyApplications from '../pages/seeker/MyApplications';
import SavedJobs from '../pages/seeker/SavedJobs';
import SeekerProfile from '../pages/seeker/Profile';
import Notifications from '../pages/seeker/Notifications';

import RecruiterDashboard from '../pages/recruiter/RecruiterDashboard';
import PostJob from '../pages/recruiter/PostJob';
import ManageJobs from '../pages/recruiter/ManageJobs';
import Applicants from '../pages/recruiter/Applicants';
import Interviews from '../pages/recruiter/Interviews';
import CompanyProfile from '../pages/recruiter/CompanyProfile';

import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminUsers from '../pages/admin/Users';
import AdminCompanies from '../pages/admin/Companies';
import AdminJobs from '../pages/admin/Jobs';
import AdminAuditLogs from '../pages/admin/AuditLogs';
import AdminReports from '../pages/admin/Reports';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/jobs" element={<Jobs />} />
      <Route path="/jobs/:id" element={<JobDetail />} />
      <Route path="/companies" element={<Companies />} />
      <Route path="/about" element={<About />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      <Route path="/seeker" element={<ProtectedRoute roles={['JOB_SEEKER']}><SeekerDashboard /></ProtectedRoute>} />
      <Route path="/seeker/applications" element={<ProtectedRoute roles={['JOB_SEEKER']}><MyApplications /></ProtectedRoute>} />
      <Route path="/seeker/saved" element={<ProtectedRoute roles={['JOB_SEEKER']}><SavedJobs /></ProtectedRoute>} />
      <Route path="/seeker/profile" element={<ProtectedRoute roles={['JOB_SEEKER']}><SeekerProfile /></ProtectedRoute>} />
      <Route path="/seeker/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />

      <Route path="/recruiter" element={<ProtectedRoute roles={['COMPANY']}><RecruiterDashboard /></ProtectedRoute>} />
      <Route path="/recruiter/post-job" element={<ProtectedRoute roles={['COMPANY']}><PostJob /></ProtectedRoute>} />
      <Route path="/recruiter/jobs" element={<ProtectedRoute roles={['COMPANY']}><ManageJobs /></ProtectedRoute>} />
      // add this route near the other recruiter routes
      <Route path="/recruiter/jobs/:id/edit" element={<ProtectedRoute roles={['COMPANY']}><EditJob /></ProtectedRoute>} />
      <Route path="/recruiter/applicants/:jobId" element={<ProtectedRoute roles={['COMPANY']}><Applicants /></ProtectedRoute>} />
      <Route path="/recruiter/interviews" element={<ProtectedRoute roles={['COMPANY']}><Interviews /></ProtectedRoute>} />
      <Route path="/recruiter/company" element={<ProtectedRoute roles={['COMPANY']}><CompanyProfile /></ProtectedRoute>} />

      <Route path="/admin" element={<ProtectedRoute roles={['ADMIN']}><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute roles={['ADMIN']}><AdminUsers /></ProtectedRoute>} />
      <Route path="/admin/companies" element={<ProtectedRoute roles={['ADMIN']}><AdminCompanies /></ProtectedRoute>} />
      <Route path="/admin/jobs" element={<ProtectedRoute roles={['ADMIN']}><AdminJobs /></ProtectedRoute>} />
      <Route path="/admin/audit-logs" element={<ProtectedRoute roles={['ADMIN']}><AdminAuditLogs /></ProtectedRoute>} />
      <Route path="/admin/reports" element={<ProtectedRoute roles={['ADMIN']}><AdminReports /></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}