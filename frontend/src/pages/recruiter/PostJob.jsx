import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { jobApi } from '../../api/job.api';

const MENU = [
  { to: '/recruiter', label: 'Dashboard', icon: '📊', end: true },
  { to: '/recruiter/post-job', label: 'Post a Job', icon: '➕' },
  { to: '/recruiter/jobs', label: 'Manage Jobs', icon: '💼' },
  { to: '/recruiter/company', label: 'Company Profile', icon: '🏢' },
  { to: '/recruiter/interviews', label: 'Interviews', icon: '🗓️' },
];

const initial = {
  title: '', description: '', requirements: '', responsibilities: '',
  location: '', category: '', employmentType: 'FULL_TIME',
  experienceLevel: 'MID', salaryMin: '', salaryMax: '', currency: 'USD',
  positions: 1, deadline: '',
};

export default function PostJob() {
  const [form, setForm] = useState(initial);
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();
  const set = (k, v) => setForm({ ...form, [k]: v });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        salaryMin: form.salaryMin ? Number(form.salaryMin) : undefined,
        salaryMax: form.salaryMax ? Number(form.salaryMax) : undefined,
        positions: Number(form.positions) || 1,
        deadline: form.deadline || undefined,
      };
      await jobApi.create(payload);
      toast.success('Job posted!');
      nav('/recruiter/jobs');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed');
    } finally { setLoading(false); }
  };

  return (
    <DashboardLayout title="Post a New Job" items={MENU}>
      <form onSubmit={submit} className="card space-y-5 max-w-3xl">
        <div><label className="label">Job Title *</label>
          <input required className="input" value={form.title} onChange={(e) => set('title', e.target.value)} /></div>
        <div><label className="label">Description *</label>
          <textarea required rows={5} className="input" value={form.description} onChange={(e) => set('description', e.target.value)} /></div>
        <div className="grid md:grid-cols-2 gap-4">
          <div><label className="label">Requirements</label>
            <textarea rows={3} className="input" value={form.requirements} onChange={(e) => set('requirements', e.target.value)} /></div>
          <div><label className="label">Responsibilities</label>
            <textarea rows={3} className="input" value={form.responsibilities} onChange={(e) => set('responsibilities', e.target.value)} /></div>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <div><label className="label">Location *</label>
            <input required className="input" value={form.location} onChange={(e) => set('location', e.target.value)} /></div>
          <div><label className="label">Category</label>
            <input className="input" value={form.category} onChange={(e) => set('category', e.target.value)} /></div>
          <div><label className="label">Employment Type *</label>
            <select className="input" value={form.employmentType} onChange={(e) => set('employmentType', e.target.value)}>
              <option value="FULL_TIME">Full Time</option>
              <option value="PART_TIME">Part Time</option>
              <option value="INTERNSHIP">Internship</option>
              <option value="CONTRACT">Contract</option>
            </select></div>
        </div>
        <div className="grid md:grid-cols-4 gap-4">
          <div><label className="label">Experience</label>
            <select className="input" value={form.experienceLevel} onChange={(e) => set('experienceLevel', e.target.value)}>
              <option value="ENTRY">Entry</option><option value="MID">Mid</option><option value="SENIOR">Senior</option>
            </select></div>
          <div><label className="label">Salary Min</label>
            <input type="number" min="0" className="input" value={form.salaryMin} onChange={(e) => set('salaryMin', e.target.value)} /></div>
          <div><label className="label">Salary Max</label>
            <input type="number" min="0" className="input" value={form.salaryMax} onChange={(e) => set('salaryMax', e.target.value)} /></div>
          <div><label className="label">Currency</label>
            <input className="input" value={form.currency} onChange={(e) => set('currency', e.target.value)} /></div>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <div><label className="label">Positions</label>
            <input type="number" min="1" className="input" value={form.positions} onChange={(e) => set('positions', e.target.value)} /></div>
          <div><label className="label">Deadline</label>
            <input type="date" className="input" value={form.deadline} onChange={(e) => set('deadline', e.target.value)} /></div>
        </div>
        <div className="flex justify-end gap-3">
          <button type="button" onClick={() => nav('/recruiter')} className="btn-outline">Cancel</button>
          <button disabled={loading} className="btn-primary">{loading ? 'Posting…' : 'Publish Job'}</button>
        </div>
      </form>
    </DashboardLayout>
  );
}