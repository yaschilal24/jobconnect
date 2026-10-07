import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import Spinner from '../../components/common/Spinner';
import EmptyState from '../../components/common/EmptyState';
import StatusBadge from '../../components/applications/StatusBadge';
import { jobApi } from '../../api/job.api';
// this error ocure from editjob.jsx file
{/* <Link to={`/recruiter/jobs/${j.id}/edit`} className="text-secondary text-xs font-medium">Edit</Link> */}
// thi

const MENU = [
  { to: '/recruiter', label: 'Dashboard', icon: '📊', end: true },
  { to: '/recruiter/post-job', label: 'Post a Job', icon: '➕' },
  { to: '/recruiter/jobs', label: 'Manage Jobs', icon: '💼' },
  { to: '/recruiter/company', label: 'Company Profile', icon: '🏢' },
  { to: '/recruiter/interviews', label: 'Interviews', icon: '🗓️' },
];

export default function ManageJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    jobApi.mine().then(({ data }) => setJobs(data.jobs)).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const close = async (id) => {
    try { await jobApi.update(id, { status: 'CLOSED' }); toast.success('Closed'); load(); }
    catch { toast.error('Failed'); }
  };
  const remove = async (id) => {
    if (!confirm('Delete this job?')) return;
    try { await jobApi.remove(id); toast.success('Deleted'); load(); }
    catch { toast.error('Failed'); }
  };

  return (
    <DashboardLayout title="Manage Jobs" items={MENU}>
      {loading ? <Spinner /> : jobs.length === 0 ? (
        <EmptyState title="No jobs yet" message="Post your first job." icon="💼" />
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-gray-500 border-b">
              <tr><th className="py-2">Title</th><th>Type</th><th>Location</th><th>Status</th><th>Applicants</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {jobs.map((j) => (
                <tr key={j.id} className="border-b last:border-0">
                  <td className="py-3 font-medium">{j.title}</td>
                  <td>{j.employment_type}</td>
                  <td>{j.location}</td>
                  <td><StatusBadge status={j.status} /></td>
                  <td>{j.applications_count}</td>
                  <td className="flex gap-2 py-3">
                    <Link to={`/recruiter/applicants/${j.id}`} className="text-primary text-xs font-medium">View</Link>
                    {j.status === 'OPEN' && <button onClick={() => close(j.id)} className="text-warning text-xs font-medium">Close</button>}
                    <button onClick={() => remove(j.id)} className="text-danger text-xs font-medium">Delete</button>
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