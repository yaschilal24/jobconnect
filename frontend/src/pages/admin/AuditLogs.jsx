// import { useEffect, useState } from 'react';
// import DashboardLayout from '../../components/dashboard/DashboardLayout';
// import Spinner from '../../components/common/Spinner';
// import { adminApi } from '../../api/admin.api';

// const MENU = [
//   { to: '/admin', label: 'Dashboard', icon: '📊', end: true },
//   { to: '/admin/users', label: 'Users', icon: '👥' },
//   { to: '/admin/companies', label: 'Companies', icon: '🏢' },
//   { to: '/admin/jobs', label: 'Jobs', icon: '💼' },
//   { to: '/admin/audit-logs', label: 'Audit Logs', icon: '📜' },
//   { to: '/admin/reports', label: 'Reports', icon: '📈' },
// ];

// export default function AuditLogs() {
//   const [logs, setLogs] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     adminApi.auditLogs({ limit: 100 })
//       .then(({ data }) => setLogs(data.logs))
//       .finally(() => setLoading(false));
//   }, []);

//   return (
//     <DashboardLayout title="Audit Logs" items={MENU}>
//       {loading ? <Spinner /> : (
//         <div className="card overflow-x-auto">
//           <table className="w-full text-sm">
//             <thead className="text-left text-gray-500 border-b">
//               <tr><th className="py-2">When</th><th>User</th><th>Action</th><th>Entity</th><th>Metadata</th></tr>
//             </thead>
//             <tbody>
//               {logs.map((l) => (
//                 <tr key={l.id} className="border-b last:border-0">
//                   <td className="py-3">{new Date(l.created_at).toLocaleString()}</td>
//                   <td>{l.email || '—'}</td>
//                   <td>{l.action}</td>
//                   <td>{l.entity}</td>
//                   <td className="text-xs text-gray-500">{l.metadata ? JSON.stringify(l.metadata) : '—'}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </DashboardLayout>
//   );
// }
import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import Spinner from '../../components/common/Spinner';
import EmptyState from '../../components/common/EmptyState';
import { adminApi } from '../../api/admin.api';

const MENU = [
  { to: '/admin', label: 'Dashboard', icon: '📊', end: true },
  { to: '/admin/users', label: 'Users', icon: '👥' },
  { to: '/admin/companies', label: 'Companies', icon: '🏢' },
  { to: '/admin/jobs', label: 'Jobs', icon: '💼' },
  { to: '/admin/audit-logs', label: 'Audit Logs', icon: '📜' },
  { to: '/admin/reports', label: 'Reports', icon: '📈' },
];

const ACTION_COLORS = {
  CREATE: 'bg-green-100 text-green-700',
  UPDATE: 'bg-blue-100 text-blue-700',
  DELETE: 'bg-red-100 text-red-700',
  LOGIN:  'bg-purple-100 text-purple-700',
  LOGOUT: 'bg-gray-200 text-gray-700',
};

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.auditLogs({ limit: 100 })
      .then(({ data }) => setLogs(data.logs || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout title="Audit Logs" items={MENU}>
      {loading ? (
        <Spinner />
      ) : logs.length === 0 ? (
        <EmptyState
          title="No audit logs yet"
          message="Actions like creating companies, updating jobs, and verifying users will appear here."
          icon="📜"
        />
      ) : (
        <div className="card overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead className="text-left text-gray-500 border-b bg-gray-50">
              <tr>
                <th className="py-3 px-4">When</th>
                <th className="px-4">User</th>
                <th className="px-4">Action</th>
                <th className="px-4">Entity</th>
                <th className="px-4">Details</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((l) => (
                <tr key={l.id} className="border-b last:border-0 hover:bg-gray-50/50">
                  <td className="py-3 px-4 whitespace-nowrap text-gray-600">
                    {new Date(l.created_at).toLocaleString()}
                  </td>
                  <td className="px-4 text-gray-700">{l.email || '—'}</td>
                  <td className="px-4">
                    <span className={`badge ${ACTION_COLORS[l.action] || 'bg-gray-100 text-gray-700'}`}>
                      {l.action}
                    </span>
                  </td>
                  <td className="px-4 text-gray-700">{l.entity || '—'}</td>
                  <td className="px-4 text-xs text-gray-500 max-w-xs truncate">
                    {l.metadata ? JSON.stringify(l.metadata) : '—'}
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