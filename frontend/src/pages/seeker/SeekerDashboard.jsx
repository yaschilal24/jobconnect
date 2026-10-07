import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import StatCard from '../../components/dashboard/StatCard';
import StatusBadge from '../../components/applications/StatusBadge';
import { applicationApi } from '../../api/application.api';
import { useAuth } from '../../context/AuthContext';

const MENU = [
  { to: '/seeker', label: 'Dashboard', icon: '📊', end: true },
  { to: '/seeker/applications', label: 'My Applications', icon: '📝' },
  { to: '/seeker/saved', label: 'Saved Jobs', icon: '❤️' },
  { to: '/seeker/profile', label: 'Profile', icon: '👤' },
  { to: '/seeker/notifications', label: 'Notifications', icon: '🔔' },
];

export default function SeekerDashboard() {
  const { user } = useAuth();
  const [apps, setApps] = useState([]);

  useEffect(() => {
    applicationApi.mine().then(({ data }) => setApps(data.applications)).catch(() => {});
  }, []);

  const stats = {
    applications: apps.length,
    shortlisted: apps.filter((a) => a.status === 'SHORTLISTED').length,
    interviews: apps.filter((a) => a.status === 'INTERVIEW').length,
    offers: apps.filter((a) => a.status === 'SELECTED').length,
  };

  return (
    <DashboardLayout title={`Welcome back, ${user?.firstName || 'Seeker'}! 👋`} items={MENU}>
      <p className="text-gray-500 mb-6">Here's your job search overview.</p>
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Applications" value={stats.applications} icon="📝" />
        <StatCard label="Shortlisted" value={stats.shortlisted} icon="⭐" color="text-secondary" />
        <StatCard label="Interviews" value={stats.interviews} icon="🗓️" color="text-warning" />
        <StatCard label="Offers" value={stats.offers} icon="🎉" color="text-success" />
      </div>
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold">Recent Applications</h2>
          <Link to="/seeker/applications" className="text-sm text-primary">View all</Link>
        </div>
        {apps.length === 0 ? (
          <p className="text-gray-500 text-sm">No applications yet. <Link className="text-primary" to="/jobs">Browse jobs</Link></p>
        ) : (
          <div className="space-y-3">
            {apps.slice(0, 5).map((a) => (
              <div key={a.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                <div>
                  <p className="font-medium">{a.job_title}</p>
                  <p className="text-sm text-gray-500">{a.company_name}</p>
                </div>
                <StatusBadge status={a.status} />
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}