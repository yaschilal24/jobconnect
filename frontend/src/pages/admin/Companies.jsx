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

export default function Companies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    adminApi.companies().then(({ data }) => setCompanies(data.companies)).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const setStatus = async (id, status) => {
    try { await adminApi.verifyCompany(id, status); toast.success(`Company ${status.toLowerCase()}`); load(); }
    catch { toast.error('Failed'); }
  };

  return (
    <DashboardLayout title="Companies" items={MENU}>
      {loading ? <Spinner /> : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-gray-500 border-b">
              <tr><th className="py-2">Name</th><th>Industry</th><th>Location</th><th>Status</th><th>Jobs</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {companies.map((c) => (
                <tr key={c.id} className="border-b last:border-0">
                  <td className="py-3 font-medium">{c.name}</td>
                  <td>{c.industry}</td>
                  <td>{c.location}</td>
                  <td><StatusBadge status={c.verification_status} /></td>
                  <td>{c.jobs_count}</td>
                  <td className="flex gap-2 py-3">
                    {c.verification_status !== 'VERIFIED' && <button onClick={() => setStatus(c.id, 'VERIFIED')} className="text-success text-xs font-medium">Verify</button>}
                    {c.verification_status !== 'REJECTED' && <button onClick={() => setStatus(c.id, 'REJECTED')} className="text-danger text-xs font-medium">Reject</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  );
}