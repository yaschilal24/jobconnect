// import { useEffect, useState } from 'react';
// import DashboardLayout from '../../components/dashboard/DashboardLayout';
// import StatCard from '../../components/dashboard/StatCard';
// import { adminApi } from '../../api/admin.api';

// const MENU = [
//   { to: '/admin', label: 'Dashboard', icon: '📊', end: true },
//   { to: '/admin/users', label: 'Users', icon: '👥' },
//   { to: '/admin/companies', label: 'Companies', icon: '🏢' },
//   { to: '/admin/jobs', label: 'Jobs', icon: '💼' },
//   { to: '/admin/audit-logs', label: 'Audit Logs', icon: '📜' },
//   { to: '/admin/reports', label: 'Reports', icon: '📈' },
// ];

// export default function Reports() {
//   const [stats, setStats] = useState(null);
//   useEffect(() => {
//     adminApi.stats().then(({ data }) => setStats(data.stats)).catch(() => {});
//   }, []);
//   return (
//     <DashboardLayout title="Reports & Analytics" items={MENU}>
//       <div className="grid md:grid-cols-2 gap-4">
//         <StatCard label="Total Users" value={stats?.totalUsers} icon="👥" />
//         <StatCard label="Total Applications" value={stats?.totalApplications} icon="📨" color="text-secondary" />
//         <StatCard label="Active Jobs" value={stats?.activeJobs} icon="✅" color="text-success" />
//         <StatCard label="Pending Companies" value={stats?.pendingCompanies} icon="⏳" color="text-danger" />
//       </div>
//       <div className="card mt-6">
//         <p className="text-sm text-gray-500">
//           You can plug a chart library (Recharts) here to visualize this data over time.
//           Source: <code className="text-xs bg-gray-100 px-1 rounded">GET /api/admin/stats</code>
//         </p>
//       </div>
//     </DashboardLayout>
//   );
// }


import { useEffect, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell, Legend, BarChart, Bar,
} from 'recharts';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import StatCard from '../../components/dashboard/StatCard';
import Spinner from '../../components/common/Spinner';
import { adminApi } from '../../api/admin.api';

const MENU = [
  { to: '/admin', label: 'Dashboard', icon: '📊', end: true },
  { to: '/admin/users', label: 'Users', icon: '👥' },
  { to: '/admin/companies', label: 'Companies', icon: '🏢' },
  { to: '/admin/jobs', label: 'Jobs', icon: '💼' },
  { to: '/admin/audit-logs', label: 'Audit Logs', icon: '📜' },
  { to: '/admin/reports', label: 'Reports', icon: '📈' },
];

const COLORS = ['#2563EB', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444'];

export default function Reports() {
  const [stats, setStats] = useState(null);
  const [charts, setCharts] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([adminApi.stats(), adminApi.charts()])
      .then(([s, c]) => {
        setStats(s.data.stats);
        setCharts(c.data.charts);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <DashboardLayout title="Reports & Analytics" items={MENU}><Spinner /></DashboardLayout>;
  }

  return (
    <DashboardLayout title="Reports & Analytics" items={MENU}>
      {/* Stat cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Users"         value={stats?.totalUsers}         icon="👥" />
        <StatCard label="Total Applications"  value={stats?.totalApplications}  icon="📨" color="text-secondary" />
        <StatCard label="Active Jobs"         value={stats?.activeJobs}         icon="✅" color="text-success" />
        <StatCard label="Pending Companies"   value={stats?.pendingCompanies}   icon="⏳" color="text-danger" />
      </div>

      {/* Charts grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Applications per day */}
        <div className="card lg:col-span-2">
          <h3 className="font-bold mb-4">Applications — Last 14 Days</h3>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <LineChart data={charts?.applicationsByDay || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#2563EB" strokeWidth={3}
                  dot={{ r: 4, fill: '#2563EB' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Jobs by type (pie) */}
        <div className="card">
          <h3 className="font-bold mb-4">Jobs by Type</h3>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={charts?.jobsByType || []} dataKey="count" nameKey="type"
                  cx="50%" cy="50%" outerRadius={90} label>
                  {(charts?.jobsByType || []).map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top companies (bar) */}
        <div className="card">
          <h3 className="font-bold mb-4">Top Companies by Applications</h3>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <BarChart data={charts?.topCompanies || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="applicationsCount" fill="#8B5CF6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}