import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { companyApi } from '../../api/company.api';

const MENU = [
  { to: '/recruiter', label: 'Dashboard', icon: '📊', end: true },
  { to: '/recruiter/post-job', label: 'Post a Job', icon: '➕' },
  { to: '/recruiter/jobs', label: 'Manage Jobs', icon: '💼' },
  { to: '/recruiter/company', label: 'Company Profile', icon: '🏢' },
  { to: '/recruiter/interviews', label: 'Interviews', icon: '🗓️' },
];

export default function CompanyProfile() {
  const [company, setCompany] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', industry: '', location: '', website: '', email: '', phone: '' });

  const load = async () => {
    const { data } = await companyApi.mine();
    if (data.company) {
      setCompany(data.company);
      setForm({
        name: data.company.name || '', description: data.company.description || '',
        industry: data.company.industry || '', location: data.company.location || '',
        website: data.company.website || '', email: data.company.email || '', phone: data.company.phone || '',
      });
    }
  };
  useEffect(() => { load(); }, []);

  const save = async (e) => {
  e.preventDefault();

  // Required (backend needs these)
  if (!form.name.trim() || form.name.trim().length < 2)
    return toast.error('Company name must be at least 2 characters');
  if (!form.description.trim() || form.description.trim().length < 20)
    return toast.error('Description must be at least 20 characters');
  if (!form.location.trim() || form.location.trim().length < 2)
    return toast.error('Location is required');

  // Clean payload — drop empty optional fields so validators don't reject "" strings
  const payload = {
    name: form.name.trim(),
    description: form.description.trim(),
    location: form.location.trim(),
    ...(form.industry.trim()  && { industry: form.industry.trim() }),
    ...(form.phone.trim()     && { phone: form.phone.trim() }),
    // Only send website if it looks like a URL
    ...(form.website.trim() && /^https?:\/\//i.test(form.website.trim())
        && { website: form.website.trim() }),
    // Only send email if it contains @
    ...(form.email.trim() && /@/.test(form.email.trim())
        && { email: form.email.trim() }),
  };

  try {
    await companyApi.upsert(payload);
    toast.success('Saved');
    load();
  } catch (e) {
    const details = e.response?.data?.details;
    toast.error(details?.[0]?.message || e.response?.data?.message || 'Failed');
  }
};

  return (
    <DashboardLayout title="Company Profile" items={MENU}>
      {company && (
        <div className="card mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-xl">{company.name}</h2>
              <p className="text-sm text-gray-500">{company.industry} · {company.location}</p>
            </div>
            <span className={`badge ${company.verification_status === 'VERIFIED' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
              {company.verification_status}
            </span>
          </div>
        </div>
      )}
      <form onSubmit={save} className="card space-y-4">
        <h3 className="font-bold">{company ? 'Update company' : 'Create company'}</h3>
        <div><label className="label">Company Name *</label><input required className="input" value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} /></div>
        <div><label className="label">Description * (min 20)</label><textarea required rows={4} className="input" value={form.description} onChange={(e)=>setForm({...form,description:e.target.value})} /></div>
        <div className="grid md:grid-cols-2 gap-4">
          <div><label className="label">Industry</label><input className="input" value={form.industry} onChange={(e)=>setForm({...form,industry:e.target.value})} /></div>
          <div><label className="label">Location *</label><input required className="input" value={form.location} onChange={(e)=>setForm({...form,location:e.target.value})} /></div>
          <div><label className="label">Website</label><input className="input" value={form.website} onChange={(e)=>setForm({...form,website:e.target.value})} /></div>
          <div><label className="label">Email</label><input className="input" value={form.email} onChange={(e)=>setForm({...form,email:e.target.value})} /></div>
          <div><label className="label">Phone</label><input className="input" value={form.phone} onChange={(e)=>setForm({...form,phone:e.target.value})} /></div>
        </div>
        <button className="btn-primary">Save</button>
      </form>
    </DashboardLayout>
  );
}