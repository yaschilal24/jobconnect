import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import StatCard from '../../components/dashboard/StatCard';
import StatusBadge from '../../components/applications/StatusBadge';
import { adminApi } from '../../api/admin.api';

const MENU = [
  { to: '/admin', label: 'Dashboard', icon: '📊', end: true },
  { to: '/admin/users', label: 'Users', icon: '👥' },
  { to: '/admin/companies', label: 'Companies', icon: '🏢' },
  { to: '/admin/jobs', label: 'Jobs', icon: '💼' },
  { to: '/admin/audit-logs', label: 'Audit Logs', icon: '📜' },
  { to: '/admin/reports', label: 'Reports', icon: '📈' },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [apps, setApps] = useState([]);

  useEffect(() => {
    adminApi.stats().then(({ data }) => setStats(data.stats)).catch(() => {});
    adminApi.recentApplications().then(({ data }) => setApps(data.applications)).catch(() => {});
  }, []);

  return (
    <DashboardLayout title="Platform Overview" items={MENU}>
      <div className="grid md:grid-cols-3 gap-4">
        <StatCard label="Total Users" value={stats?.totalUsers} icon="👥" />
        <StatCard label="Companies" value={stats?.totalCompanies} icon="🏢" color="text-secondary" />
        <StatCard label="Jobs" value={stats?.totalJobs} icon="💼" color="text-warning" />
        <StatCard label="Applications" value={stats?.totalApplications} icon="📨" />
        <StatCard label="Active Jobs" value={stats?.activeJobs} icon="✅" color="text-success" />
        <StatCard label="Pending Companies" value={stats?.pendingCompanies} icon="⏳" color="text-danger" />
      </div>

      <div className="card mt-8">
        <h2 className="font-bold mb-3">Recent Applications</h2>
        <table className="w-full text-sm">
          <thead className="text-left text-gray-500 border-b">
            <tr><th className="py-2">Candidate</th><th>Job</th><th>Company</th><th>Status</th><th>Date</th></tr>
          </thead>
          <tbody>
            {apps.map((a) => (
              <tr key={a.id} className="border-b last:border-0">
                <td className="py-3">{a.first_name} {a.last_name}</td>
                <td>{a.job_title}</td>
                <td>{a.company_name}</td>
                <td><StatusBadge status={a.status} /></td>
                <td>{new Date(a.applied_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}