import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import Spinner from '../../components/common/Spinner';
import { jobApi } from '../../api/job.api';

const MENU = [
  { to: '/recruiter', label: 'Dashboard', icon: '📊', end: true },
  { to: '/recruiter/post-job', label: 'Post a Job', icon: '➕' },
  { to: '/recruiter/jobs', label: 'Manage Jobs', icon: '💼' },
  { to: '/recruiter/company', label: 'Company Profile', icon: '🏢' },
  { to: '/recruiter/interviews', label: 'Interviews', icon: '🗓️' },
];

const EMPTY = {
  title: '',
  description: '',
  requirements: '',
  responsibilities: '',
  location: '',
  category: '',
  employmentType: 'FULL_TIME',
  experienceLevel: 'MID',
  salaryMin: '',
  salaryMax: '',
  currency: 'USD',
  positions: 1,
  deadline: '',
  status: 'OPEN',
};

export default function EditJob() {
  const { id } = useParams();
  const nav = useNavigate();
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  // Load existing job
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const { data } = await jobApi.getById(id);
        if (!alive) return;
        const j = data.job;
        setForm({
          title: j.title || '',
          description: j.description || '',
          requirements: j.requirements || '',
          responsibilities: j.responsibilities || '',
          location: j.location || '',
          category: j.category || '',
          employmentType: j.employment_type || 'FULL_TIME',
          experienceLevel: j.experience_level || 'MID',
          salaryMin: j.salary_min ?? '',
          salaryMax: j.salary_max ?? '',
          currency: j.currency || 'USD',
          positions: j.positions ?? 1,
          deadline: j.deadline ? String(j.deadline).slice(0, 10) : '',
          status: j.status || 'OPEN',
        });
      } catch (e) {
        toast.error(e.response?.data?.message || 'Failed to load job');
        nav('/recruiter/jobs');
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [id, nav]);

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        title: form.title,
        description: form.description,
        requirements: form.requirements,
        responsibilities: form.responsibilities,
        location: form.location,
        category: form.category,
        employmentType: form.employmentType,
        experienceLevel: form.experienceLevel,
        currency: form.currency,
        positions: Number(form.positions) || 1,
        status: form.status,
        ...(form.salaryMin !== '' && { salaryMin: Number(form.salaryMin) }),
        ...(form.salaryMax !== '' && { salaryMax: Number(form.salaryMax) }),
        ...(form.deadline && { deadline: form.deadline }),
      };
      await jobApi.update(id, payload);
      toast.success('Job updated');
      nav('/recruiter/jobs');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to update job');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Edit Job" items={MENU}>
        <Spinner />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Edit Job" items={MENU}>
      <div className="mb-4 text-sm text-gray-500">
        <Link to="/recruiter/jobs" className="text-primary hover:underline">
          ← Back to Manage Jobs
        </Link>
      </div>

      <form onSubmit={submit} className="card space-y-5 max-w-3xl">
        <div>
          <label className="label">Job Title *</label>
          <input
            required
            className="input"
            value={form.title}
            onChange={(e) => set('title', e.target.value)}
          />
        </div>

        <div>
          <label className="label">Description *</label>
          <textarea
            required
            rows={5}
            className="input"
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="label">Requirements</label>
            <textarea
              rows={3}
              className="input"
              value={form.requirements}
              onChange={(e) => set('requirements', e.target.value)}
            />
          </div>
          <div>
            <label className="label">Responsibilities</label>
            <textarea
              rows={3}
              className="input"
              value={form.responsibilities}
              onChange={(e) => set('responsibilities', e.target.value)}
            />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="label">Location *</label>
            <input
              required
              className="input"
              value={form.location}
              onChange={(e) => set('location', e.target.value)}
            />
          </div>
          <div>
            <label className="label">Category</label>
            <input
              className="input"
              value={form.category}
              onChange={(e) => set('category', e.target.value)}
            />
          </div>
          <div>
            <label className="label">Employment Type *</label>
            <select
              className="input"
              value={form.employmentType}
              onChange={(e) => set('employmentType', e.target.value)}
            >
              <option value="FULL_TIME">Full Time</option>
              <option value="PART_TIME">Part Time</option>
              <option value="INTERNSHIP">Internship</option>
              <option value="CONTRACT">Contract</option>
            </select>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-4">
          <div>
            <label className="label">Experience</label>
            <select
              className="input"
              value={form.experienceLevel}
              onChange={(e) => set('experienceLevel', e.target.value)}
            >
              <option value="ENTRY">Entry</option>
              <option value="MID">Mid</option>
              <option value="SENIOR">Senior</option>
            </select>
          </div>
          <div>
            <label className="label">Salary Min</label>
            <input
              type="number"
              min="0"
              className="input"
              value={form.salaryMin}
              onChange={(e) => set('salaryMin', e.target.value)}
            />
          </div>
          <div>
            <label className="label">Salary Max</label>
            <input
              type="number"
              min="0"
              className="input"
              value={form.salaryMax}
              onChange={(e) => set('salaryMax', e.target.value)}
            />
          </div>
          <div>
            <label className="label">Currency</label>
            <input
              className="input"
              value={form.currency}
              onChange={(e) => set('currency', e.target.value)}
            />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="label">Positions</label>
            <input
              type="number"
              min="1"
              className="input"
              value={form.positions}
              onChange={(e) => set('positions', e.target.value)}
            />
          </div>
          <div>
            <label className="label">Deadline</label>
            <input
              type="date"
              className="input"
              value={form.deadline}
              onChange={(e) => set('deadline', e.target.value)}
            />
          </div>
          <div>
            <label className="label">Status</label>
            <select
              className="input"
              value={form.status}
              onChange={(e) => set('status', e.target.value)}
            >
              <option value="OPEN">Open</option>
              <option value="CLOSED">Closed</option>
              <option value="DRAFT">Draft</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => nav('/recruiter/jobs')}
            className="btn-outline"
          >
            Cancel
          </button>
          <button disabled={saving} className="btn-primary">
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </form>
    </DashboardLayout>
  );
}