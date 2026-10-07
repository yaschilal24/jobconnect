import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
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

export default function Users() {
  const [users, setUsers] = useState([]);
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    adminApi.users({ role: role || undefined })
      .then(({ data }) => setUsers(data.users))
      .finally(() => setLoading(false));
  };
  useEffect(load, [role]);

  const toggle = async (id) => {
    try { await adminApi.toggleUser(id); toast.success('Updated'); load(); }
    catch { toast.error('Failed'); }
  };

  return (
    <DashboardLayout title="Manage Users" items={MENU}>
      <div className="mb-4">
        <select className="input max-w-xs" value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="">All roles</option>
          <option value="JOB_SEEKER">Job Seekers</option>
          <option value="COMPANY">Companies</option>
          <option value="ADMIN">Admins</option>
        </select>
      </div>
      {loading ? <Spinner /> : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-gray-500 border-b">
              <tr><th className="py-2">Name</th><th>Email</th><th>Role</th><th>Status</th><th></th></tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b last:border-0">
                  <td className="py-3">{u.first_name} {u.last_name}</td>
                  <td>{u.email}</td>
                  <td><span className="badge bg-gray-100 text-gray-700">{u.role}</span></td>
                  <td>
                    <span className={`badge ${u.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {u.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <button onClick={() => toggle(u.id)} className="text-primary text-xs font-medium">
                      {u.is_active ? 'Deactivate' : 'Activate'}
                    </button>
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