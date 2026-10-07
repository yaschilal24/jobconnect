import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import StatCard from '../../components/dashboard/StatCard';
import { jobApi } from '../../api/job.api';
import { useAuth } from '../../context/AuthContext';

const MENU = [
  { to: '/recruiter', label: 'Dashboard', icon: '📊', end: true },
  { to: '/recruiter/post-job', label: 'Post a Job', icon: '➕' },
  { to: '/recruiter/jobs', label: 'Manage Jobs', icon: '💼' },
  { to: '/recruiter/company', label: 'Company Profile', icon: '🏢' },
  { to: '/recruiter/interviews', label: 'Interviews', icon: '🗓️' },
];

export default function RecruiterDashboard() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    jobApi.mine().then(({ data }) => setJobs(data.jobs)).catch(() => {});
  }, []);

  const totalApps = jobs.reduce((s, j) => s + parseInt(j.applications_count || 0, 10), 0);
  const activeJobs = jobs.filter((j) => j.status === 'OPEN').length;

  return (
    <DashboardLayout title={`Welcome back, ${user?.company?.name || user?.firstName}!`} items={MENU}>
      <p className="text-gray-500 mb-6">Here's your hiring overview.</p>
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Active Jobs" value={activeJobs} icon="💼" />
        <StatCard label="Total Jobs" value={jobs.length} icon="📋" color="text-secondary" />
        <StatCard label="Applications" value={totalApps} icon="📨" color="text-warning" />
        <StatCard label="Interviews" value={0} icon="🗓️" color="text-success" />
      </div>
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold">Recent Jobs</h2>
          <Link to="/recruiter/post-job" className="btn-primary text-sm">+ Post Job</Link>
        </div>
        {jobs.length === 0 ? (
          <p className="text-gray-500 text-sm">No jobs posted yet.</p>
        ) : (
          <div className="space-y-3">
            {jobs.slice(0, 5).map((j) => (
              <div key={j.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                <div>
                  <p className="font-medium">{j.title}</p>
                  <p className="text-xs text-gray-500">{j.location} · {j.employment_type}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-500">{j.applications_count} applicants</span>
                  <Link to={`/recruiter/applicants/${j.id}`} className="btn-outline text-xs">View</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}