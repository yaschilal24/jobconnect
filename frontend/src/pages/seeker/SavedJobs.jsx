import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import JobCard from '../../components/jobs/JobCard';
import Spinner from '../../components/common/Spinner';
import EmptyState from '../../components/common/EmptyState';
import { savedJobApi } from '../../api/savedJob.api';

const MENU = [
  { to: '/seeker', label: 'Dashboard', icon: '📊', end: true },
  { to: '/seeker/applications', label: 'My Applications', icon: '📝' },
  { to: '/seeker/saved', label: 'Saved Jobs', icon: '❤️' },
  { to: '/seeker/profile', label: 'Profile', icon: '👤' },
  { to: '/seeker/notifications', label: 'Notifications', icon: '🔔' },
];

export default function SavedJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    savedJobApi.list()
      .then(({ data }) => setJobs(data.jobs))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  return (
    <DashboardLayout title="Saved Jobs" items={MENU}>
      {loading ? <Spinner /> : jobs.length === 0 ? (
        <EmptyState title="No saved jobs" message="Save jobs from the jobs page." icon="❤️" />
      ) : (
        <div className="grid gap-4">
          {jobs.map((j) => <JobCard key={j.id} job={j} initiallySaved onSaveChange={load} />)}
        </div>
      )}
      <Link to="/jobs" className="btn-outline mt-6 inline-block">Browse more jobs</Link>
    </DashboardLayout>
  );
}