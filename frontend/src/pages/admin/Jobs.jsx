import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import StatusBadge from '../../components/applications/StatusBadge';
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

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    adminApi.jobs().then(({ data }) => setJobs(data.jobs)).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const remove = async (id) => {
    if (!confirm('Delete job?')) return;
    try { await adminApi.deleteJob(id); toast.success('Deleted'); load(); }
    catch { toast.error('Failed'); }
  };

  return (
    <DashboardLayout title="Manage Jobs" items={MENU}>
      {loading ? <Spinner /> : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-gray-500 border-b">
              <tr><th className="py-2">Title</th><th>Company</th><th>Type</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {jobs.map((j) => (
                <tr key={j.id} className="border-b last:border-0">
                  <td className="py-3 font-medium">{j.title}</td>
                  <td>{j.company_name}</td>
                  <td>{j.employment_type}</td>
                  <td><StatusBadge status={j.status} /></td>
                  <td><button onClick={() => remove(j.id)} className="text-danger text-xs font-medium">Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  );
}