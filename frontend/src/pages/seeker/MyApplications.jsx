import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import StatCard from '../../components/dashboard/StatCard';
import StatusBadge from '../../components/applications/StatusBadge';
import Modal from '../../components/common/Modal';
import Spinner from '../../components/common/Spinner';
import EmptyState from '../../components/common/EmptyState';
import { applicationApi } from '../../api/application.api';

const MENU = [
  { to: '/seeker', label: 'Dashboard', icon: '📊', end: true },
  { to: '/seeker/applications', label: 'My Applications', icon: '📝' },
  { to: '/seeker/saved', label: 'Saved Jobs', icon: '❤️' },
  { to: '/seeker/profile', label: 'Profile', icon: '👤' },
  { to: '/seeker/notifications', label: 'Notifications', icon: '🔔' },
];

const STATUS_OPTIONS = [
  { value: '', label: 'All statuses' },
  { value: 'APPLIED', label: 'Applied' },
  { value: 'UNDER_REVIEW', label: 'Under Review' },
  { value: 'SHORTLISTED', label: 'Shortlisted' },
  { value: 'INTERVIEW', label: 'Interview' },
  { value: 'SELECTED', label: 'Selected' },
  { value: 'REJECTED', label: 'Rejected' },
  { value: 'WITHDRAWN', label: 'Withdrawn' },
];

const WITHDRAWABLE = ['APPLIED', 'UNDER_REVIEW'];

export default function MyApplications() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');

  // Withdraw modal
  const [withdrawTarget, setWithdrawTarget] = useState(null);
  const [withdrawing, setWithdrawing] = useState(false);

  // History modal
  const [historyTarget, setHistoryTarget] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await applicationApi.mine();
      setApps(data.applications || []);
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // Derived stats
  const stats = useMemo(
    () => ({
      total: apps.length,
      active: apps.filter((a) =>
        ['APPLIED', 'UNDER_REVIEW', 'SHORTLISTED'].includes(a.status)
      ).length,
      interviews: apps.filter((a) => a.status === 'INTERVIEW').length,
      offers: apps.filter((a) => a.status === 'SELECTED').length,
    }),
    [apps]
  );

  // Filtered list
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return apps.filter((a) => {
      const matchesStatus = !statusFilter || a.status === statusFilter;
      const matchesSearch =
        !q ||
        a.job_title?.toLowerCase().includes(q) ||
        a.company_name?.toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [apps, statusFilter, search]);

  // ---------- Withdraw ----------
  const openWithdraw = (app) => setWithdrawTarget(app);

  const confirmWithdraw = async () => {
    if (!withdrawTarget) return;
    setWithdrawing(true);
    try {
      await applicationApi.withdraw(withdrawTarget.id);
      toast.success('Application withdrawn');
      setWithdrawTarget(null);
      load();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to withdraw');
    } finally {
      setWithdrawing(false);
    }
  };

  // ---------- History ----------
  const openHistory = async (app) => {
    setHistoryTarget(app);
    setHistory([]);
    setHistoryLoading(true);
    try {
      const { data } = await applicationApi.history(app.id);
      setHistory(data.history || []);
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to load history');
    } finally {
      setHistoryLoading(false);
    }
  };

  return (
    <DashboardLayout title="My Applications" items={MENU}>
      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total" value={stats.total} icon="📝" />
        <StatCard label="Active" value={stats.active} icon="⏳" color="text-secondary" />
        <StatCard label="Interviews" value={stats.interviews} icon="🗓️" color="text-warning" />
        <StatCard label="Offers" value={stats.offers} icon="🎉" color="text-success" />
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="flex flex-col md:flex-row gap-3">
          <input
            className="input md:flex-1"
            placeholder="Search by job title or company…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="input md:w-56"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
          <Link to="/jobs" className="btn-primary md:w-40 whitespace-nowrap">
            Find Jobs
          </Link>
        </div>
      </div>

      {/* List */}
      {loading ? (
        <Spinner />
      ) : apps.length === 0 ? (
        <EmptyState
          title="No applications yet"
          message="Start applying to see your applications here."
          icon="📝"
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No matching applications"
          message="Try changing your filters or search."
          icon="🔍"
        />
      ) : (
        <div className="card overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead className="text-left text-gray-500 border-b bg-gray-50">
              <tr>
                <th className="py-3 px-4">Job</th>
                <th className="px-4">Company</th>
                <th className="px-4">Type</th>
                <th className="px-4">Status</th>
                <th className="px-4">Applied</th>
                <th className="px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => (
                <tr key={a.id} className="border-b last:border-0 hover:bg-gray-50/50">
                  <td className="py-3 px-4">
                    <Link
                      to={`/jobs/${a.job_id}`}
                      className="font-medium text-gray-900 hover:text-primary"
                    >
                      {a.job_title}
                    </Link>
                    {a.location && (
                      <p className="text-xs text-gray-500 mt-0.5">{a.location}</p>
                    )}
                  </td>
                  <td className="px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-md bg-primary/10 grid place-items-center text-primary text-xs font-bold">
                        {a.company_name?.[0] || 'C'}
                      </div>
                      <span>{a.company_name}</span>
                    </div>
                  </td>
                  <td className="px-4 text-gray-600">
                    {a.employment_type?.replace('_', ' ')}
                  </td>
                  <td className="px-4">
                    <StatusBadge status={a.status} />
                  </td>
                  <td className="px-4 text-gray-600">
                    {new Date(a.applied_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 text-right whitespace-nowrap">
                    <button
                      onClick={() => openHistory(a)}
                      className="text-primary text-xs font-medium hover:underline mr-3"
                    >
                      History
                    </button>
                    {WITHDRAWABLE.includes(a.status) && (
                      <button
                        onClick={() => openWithdraw(a)}
                        className="text-danger text-xs font-medium hover:underline"
                      >
                        Withdraw
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Withdraw confirmation modal */}
      <Modal
        open={!!withdrawTarget}
        onClose={() => !withdrawing && setWithdrawTarget(null)}
        title="Withdraw Application"
      >
        {withdrawTarget && (
          <div className="space-y-4">
            <p className="text-sm text-gray-700">
              Are you sure you want to withdraw your application for{' '}
              <span className="font-semibold">{withdrawTarget.job_title}</span> at{' '}
              <span className="font-semibold">{withdrawTarget.company_name}</span>?
            </p>
            <p className="text-xs text-gray-500">
              This action cannot be undone. You would need to apply again if you change your mind.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setWithdrawTarget(null)}
                disabled={withdrawing}
                className="btn-outline"
              >
                Cancel
              </button>
              <button
                onClick={confirmWithdraw}
                disabled={withdrawing}
                className="btn-danger"
              >
                {withdrawing ? 'Withdrawing…' : 'Yes, withdraw'}
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* History modal */}
      <Modal
        open={!!historyTarget}
        onClose={() => setHistoryTarget(null)}
        title={`Application History${
          historyTarget ? ` — ${historyTarget.job_title}` : ''
        }`}
      >
        {historyLoading ? (
          <Spinner />
        ) : history.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">
            No history available.
          </p>
        ) : (
          <ol className="relative border-l border-gray-200 ml-2 space-y-4">
            {history.map((h) => (
              <li key={h.id} className="ml-4">
                <div className="absolute -left-1.5 w-3 h-3 bg-primary rounded-full mt-1.5" />
                <div className="flex items-center gap-2 flex-wrap">
                  {h.old_status && (
                    <>
                      <StatusBadge status={h.old_status} />
                      <span className="text-gray-400 text-xs">→</span>
                    </>
                  )}
                  <StatusBadge status={h.new_status} />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(h.created_at).toLocaleString()}
                  {h.first_name && ` · by ${h.first_name} ${h.last_name || ''}`}
                </p>
                {h.note && (
                  <p className="text-sm text-gray-700 mt-1 italic">“{h.note}”</p>
                )}
              </li>
            ))}
          </ol>
        )}
      </Modal>
    </DashboardLayout>
  );
}