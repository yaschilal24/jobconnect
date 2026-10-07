import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import StatusBadge from '../../components/applications/StatusBadge';
import Modal from '../../components/common/Modal';
import Spinner from '../../components/common/Spinner';
import EmptyState from '../../components/common/EmptyState';
//import { applicationApi } from '../../api/application.api';
import { applicationApi } from '../../api/application.api';
import { fileUrl } from '../../api/axios';
import { interviewApi } from '../../api/interview.api';

const MENU = [
  { to: '/recruiter', label: 'Dashboard', icon: '📊', end: true },
  { to: '/recruiter/post-job', label: 'Post a Job', icon: '➕' },
  { to: '/recruiter/jobs', label: 'Manage Jobs', icon: '💼' },
  { to: '/recruiter/company', label: 'Company Profile', icon: '🏢' },
  { to: '/recruiter/interviews', label: 'Interviews', icon: '🗓️' },
];

const STATUSES = ['UNDER_REVIEW', 'SHORTLISTED', 'INTERVIEW', 'SELECTED', 'REJECTED'];

export default function Applicants() {
  const { jobId } = useParams();
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [interviewFor, setInterviewFor] = useState(null);
  const [form, setForm] = useState({
    interviewType: 'ONLINE', scheduledAt: '', durationMinutes: 30,
    meetingLink: '', location: '', notes: '',
  });

  const load = () => {
    setLoading(true);
    applicationApi.byJob(jobId)
      .then(({ data }) => setApps(data.applications))
      .catch(() => toast.error('Failed'))
      .finally(() => setLoading(false));
  };
  useEffect(load, [jobId]);

  const setStatus = async (id, status) => {
    try { await applicationApi.updateStatus(id, { status }); toast.success(`Marked ${status}`); load(); }
    catch { toast.error('Failed'); }
  };

  const submitInterview = async () => {
    try {
      await interviewApi.schedule({ ...form, applicationId: interviewFor.id });
      toast.success('Interview scheduled');
      setInterviewFor(null);
      load();
    } catch (e) { toast.error(e.response?.data?.message || 'Failed'); }
  };

  return (
    <DashboardLayout title="Applicants" items={MENU}>
      {loading ? <Spinner /> : apps.length === 0 ? (
        <EmptyState title="No applicants yet" icon="📨" />
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-gray-500 border-b">
              <tr><th className="py-2">Candidate</th><th>Headline</th><th>Status</th><th>Resume</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {apps.map((a) => (
                <tr key={a.id} className="border-b last:border-0">
                  <td className="py-3"><p className="font-medium">{a.first_name} {a.last_name}</p><p className="text-xs text-gray-500">{a.email}</p></td>
                  <td className="text-xs">{a.headline || '—'}</td>
                  <td><StatusBadge status={a.status} /></td>
<td>
  {a.resume_url ? (
    <a
      href={fileUrl(a.resume_url)}
      target="_blank"
      rel="noreferrer"
      className="text-primary text-xs font-medium hover:underline"
    >
      View
    </a>
  ) : (
    <span className="text-gray-400 text-xs">—</span>
  )}
</td>
                  <td className="py-3">
                    <div className="flex gap-2 flex-wrap">
                      <select className="text-xs border rounded px-2 py-1" value=""
                        onChange={(e) => e.target.value && setStatus(a.id, e.target.value)}>
                        <option value="">Set status…</option>
                        {STATUSES.map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                      </select>
                      <button onClick={() => setInterviewFor(a)} className="text-primary text-xs font-medium">Schedule</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={!!interviewFor} onClose={() => setInterviewFor(null)} title="Schedule Interview">
        <div className="space-y-3">
          <div><label className="label">Type</label>
            <select className="input" value={form.interviewType} onChange={(e) => setForm({ ...form, interviewType: e.target.value })}>
              <option value="ONLINE">Online</option><option value="IN_PERSON">In Person</option><option value="PHONE">Phone</option>
            </select></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="label">Date & Time</label>
              <input type="datetime-local" className="input" value={form.scheduledAt}
                onChange={(e) => setForm({ ...form, scheduledAt: e.target.value })} /></div>
            <div><label className="label">Duration</label>
              <input type="number" className="input" value={form.durationMinutes}
                onChange={(e) => setForm({ ...form, durationMinutes: Number(e.target.value) })} /></div>
          </div>
          {form.interviewType === 'ONLINE' ? (
            <div><label className="label">Meeting Link</label>
              <input className="input" value={form.meetingLink} onChange={(e) => setForm({ ...form, meetingLink: e.target.value })} /></div>
          ) : (
            <div><label className="label">Location</label>
              <input className="input" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></div>
          )}
          <div><label className="label">Notes</label>
            <textarea rows={3} className="input" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></div>
          <div className="flex justify-end gap-3">
            <button onClick={() => setInterviewFor(null)} className="btn-outline">Cancel</button>
            <button onClick={submitInterview} className="btn-primary">Schedule</button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}