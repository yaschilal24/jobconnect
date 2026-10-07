// import { useEffect, useState } from 'react';
// import toast from 'react-hot-toast';
// import DashboardLayout from '../../components/dashboard/DashboardLayout';
// import { userApi } from '../../api/user.api';

// const MENU = [
//   { to: '/seeker', label: 'Dashboard', icon: '📊', end: true },
//   { to: '/seeker/applications', label: 'My Applications', icon: '📝' },
//   { to: '/seeker/saved', label: 'Saved Jobs', icon: '❤️' },
//   { to: '/seeker/profile', label: 'Profile', icon: '👤' },
//   { to: '/seeker/notifications', label: 'Notifications', icon: '🔔' },
// ];

// export default function Profile() {
//   const [profile, setProfile] = useState(null);
//   const [form, setForm] = useState({});
//   const [eduForm, setEduForm] = useState({ institution: '', degree: '', field: '', startYear: '', endYear: '' });
//   const [expForm, setExpForm] = useState({ company: '', position: '', startDate: '', endDate: '', description: '' });
//   const [skillInput, setSkillInput] = useState('');

//   const load = async () => {
//     const { data } = await userApi.me();
//     setProfile(data.profile);
//     setForm({
//       firstName: data.profile.first_name, lastName: data.profile.last_name,
//       phone: data.profile.phone || '', location: data.profile.location || '',
//       headline: data.profile.headline || '', bio: data.profile.bio || '',
//       linkedin: data.profile.linkedin || '', github: data.profile.github || '',
//       portfolio: data.profile.portfolio || '',
//     });
//   };
//   useEffect(() => { load(); }, []);

//   const save = async (e) => {
//     e.preventDefault();
//     try { await userApi.update(form); toast.success('Saved'); load(); }
//     catch { toast.error('Failed'); }
//   };

//   const addEdu = async () => { try { await userApi.addEducation(eduForm); setEduForm({ institution:'',degree:'',field:'',startYear:'',endYear:'' }); load(); } catch { toast.error('Failed'); } };
//   const delEdu = async (id) => { await userApi.removeEducation(id); load(); };
//   const addExp = async () => { try { await userApi.addExperience(expForm); setExpForm({company:'',position:'',startDate:'',endDate:'',description:''}); load(); } catch { toast.error('Failed'); } };
//   const delExp = async (id) => { await userApi.removeExperience(id); load(); };
//   const addSkill = async () => { if (!skillInput.trim()) return; await userApi.addSkill(skillInput.trim()); setSkillInput(''); load(); };
//   const delSkill = async (id) => { await userApi.removeSkill(id); load(); };
//   const uploadResume = async (file) => {
//     const fd = new FormData(); fd.append('resume', file);
//     try { await userApi.uploadResume(fd); toast.success('Resume uploaded'); load(); }
//     catch { toast.error('Upload failed'); }
//   };

//   if (!profile) return <DashboardLayout title="Profile" items={MENU}><p>Loading…</p></DashboardLayout>;

//   return (
//     <DashboardLayout title="My Profile" items={MENU}>
//       <div className="card">
//         <div className="flex items-center justify-between mb-4">
//           <div className="flex items-center gap-4">
//             <div className="w-16 h-16 rounded-full bg-primary text-white grid place-items-center text-2xl font-bold">
//               {profile.first_name?.[0]}{profile.last_name?.[0]}
//             </div>
//             <div>
//               <h2 className="text-xl font-bold">{profile.first_name} {profile.last_name}</h2>
//               <p className="text-gray-500">{profile.email}</p>
//             </div>
//           </div>
//           <div className="text-right">
//             <p className="text-xs text-gray-500">Profile completion</p>
//             <p className="text-2xl font-bold text-primary">{profile.profile_completion || 0}%</p>
//           </div>
//         </div>
//         <div className="w-full bg-gray-200 rounded-full h-2">
//           <div className="bg-primary h-2 rounded-full transition" style={{ width: `${profile.profile_completion || 0}%` }} />
//         </div>
//       </div>

//       <form onSubmit={save} className="card mt-6 space-y-4">
//         <h3 className="font-bold">Personal Information</h3>
//         <div className="grid md:grid-cols-2 gap-4">
//           <div><label className="label">First Name</label><input className="input" value={form.firstName || ''} onChange={(e)=>setForm({...form,firstName:e.target.value})} /></div>
//           <div><label className="label">Last Name</label><input className="input" value={form.lastName || ''} onChange={(e)=>setForm({...form,lastName:e.target.value})} /></div>
//           <div><label className="label">Phone</label><input className="input" value={form.phone || ''} onChange={(e)=>setForm({...form,phone:e.target.value})} /></div>
//           <div><label className="label">Location</label><input className="input" value={form.location || ''} onChange={(e)=>setForm({...form,location:e.target.value})} /></div>
//         </div>
//         <div><label className="label">Headline</label><input className="input" value={form.headline || ''} onChange={(e)=>setForm({...form,headline:e.target.value})} /></div>
//         <div><label className="label">Bio</label><textarea rows={3} className="input" value={form.bio || ''} onChange={(e)=>setForm({...form,bio:e.target.value})} /></div>
//         <div className="grid md:grid-cols-3 gap-4">
//           <div><label className="label">LinkedIn</label><input className="input" value={form.linkedin || ''} onChange={(e)=>setForm({...form,linkedin:e.target.value})} /></div>
//           <div><label className="label">GitHub</label><input className="input" value={form.github || ''} onChange={(e)=>setForm({...form,github:e.target.value})} /></div>
//           <div><label className="label">Portfolio</label><input className="input" value={form.portfolio || ''} onChange={(e)=>setForm({...form,portfolio:e.target.value})} /></div>
//         </div>
//         <div>
//           <label className="label">Resume</label>
//           <input type="file" accept=".pdf,.doc,.docx" onChange={(e)=>e.target.files[0] && uploadResume(e.target.files[0])} />
//           {profile.resume_url && <a href={profile.resume_url} target="_blank" rel="noreferrer" className="text-primary text-sm block mt-1">Current: {profile.resume_url}</a>}
//         </div>
//         <button className="btn-primary">Save Profile</button>
//       </form>

//       <div className="card mt-6">
//         <h3 className="font-bold mb-3">Education</h3>
//         {profile.educations?.map((e) => (
//           <div key={e.id} className="flex justify-between items-center border-b py-2 last:border-0">
//             <div><p className="font-medium">{e.institution}</p><p className="text-sm text-gray-500">{e.degree} {e.field} · {e.start_year}–{e.end_year}</p></div>
//             <button onClick={()=>delEdu(e.id)} className="text-danger text-xs">Remove</button>
//           </div>
//         ))}
//         <div className="grid md:grid-cols-5 gap-2 mt-3">
//           <input className="input" placeholder="Institution" value={eduForm.institution} onChange={(e)=>setEduForm({...eduForm,institution:e.target.value})} />
//           <input className="input" placeholder="Degree" value={eduForm.degree} onChange={(e)=>setEduForm({...eduForm,degree:e.target.value})} />
//           <input className="input" placeholder="Field" value={eduForm.field} onChange={(e)=>setEduForm({...eduForm,field:e.target.value})} />
//           <input className="input" placeholder="Start Year" value={eduForm.startYear} onChange={(e)=>setEduForm({...eduForm,startYear:e.target.value})} />
//           <input className="input" placeholder="End Year" value={eduForm.endYear} onChange={(e)=>setEduForm({...eduForm,endYear:e.target.value})} />
//         </div>
//         <button onClick={addEdu} className="btn-outline mt-2 text-sm">+ Add Education</button>
//       </div>

//       <div className="card mt-6">
//         <h3 className="font-bold mb-3">Experience</h3>
//         {profile.experiences?.map((e) => (
//           <div key={e.id} className="flex justify-between items-center border-b py-2 last:border-0">
//             <div><p className="font-medium">{e.position} — {e.company}</p><p className="text-sm text-gray-500">{e.start_date?.slice(0,10)} → {e.current ? 'Present' : e.end_date?.slice(0,10)}</p></div>
//             <button onClick={()=>delExp(e.id)} className="text-danger text-xs">Remove</button>
//           </div>
//         ))}
//         <div className="grid md:grid-cols-2 gap-2 mt-3">
//           <input className="input" placeholder="Company" value={expForm.company} onChange={(e)=>setExpForm({...expForm,company:e.target.value})} />
//           <input className="input" placeholder="Position" value={expForm.position} onChange={(e)=>setExpForm({...expForm,position:e.target.value})} />
//           <input type="date" className="input" value={expForm.startDate} onChange={(e)=>setExpForm({...expForm,startDate:e.target.value})} />
//           <input type="date" className="input" value={expForm.endDate} onChange={(e)=>setExpForm({...expForm,endDate:e.target.value})} />
//         </div>
//         <button onClick={addExp} className="btn-outline mt-2 text-sm">+ Add Experience</button>
//       </div>

//       <div className="card mt-6">
//         <h3 className="font-bold mb-3">Skills</h3>
//         <div className="flex flex-wrap gap-2">
//           {profile.skills?.map((s) => (
//             <span key={s.id} className="badge bg-primary/10 text-primary">
//               {s.name}
//               <button onClick={()=>delSkill(s.id)} className="ml-1 text-danger">×</button>
//             </span>
//           ))}
//         </div>
//         <div className="flex gap-2 mt-3">
//           <input className="input" placeholder="Add skill (React, Node…)" value={skillInput} onChange={(e)=>setSkillInput(e.target.value)} />
//           <button onClick={addSkill} className="btn-primary">Add</button>
//         </div>
//       </div>
//     </DashboardLayout>
//   );
// }



// add new profile.jsx
// import { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
// import toast from 'react-hot-toast';
// import DashboardLayout from '../../components/dashboard/DashboardLayout';
// import Spinner from '../../components/common/Spinner';
// import Modal from '../../components/common/Modal';
// import { userApi } from '../../api/user.api';
// import { applicationApi } from '../../api/application.api';
// import { useAuth } from '../../context/AuthContext';
// import { fileUrl } from '../../api/axios';

// const MENU = [
//   { to: '/seeker', label: 'Dashboard', icon: '📊', end: true },
//   { to: '/seeker/applications', label: 'My Applications', icon: '📝' },
//   { to: '/seeker/saved', label: 'Saved Jobs', icon: '❤️' },
//   { to: '/seeker/profile', label: 'Profile', icon: '👤' },
//   { to: '/seeker/notifications', label: 'Notifications', icon: '🔔' },
// ];

// export default function Profile() {
//   const { user, setUser } = useAuth();
//   const [profile, setProfile] = useState(null);
//   const [apps, setApps] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [editOpen, setEditOpen] = useState(false);
//   const [form, setForm] = useState({});
//   const [saving, setSaving] = useState(false);
//   const [skillInput, setSkillInput] = useState('');

//   const load = async () => {
//     setLoading(true);
//     try {
//       const [{ data: meData }, appsRes] = await Promise.all([
//         userApi.me(),
//         applicationApi.mine().catch(() => ({ data: { applications: [] } })),
//       ]);
//       setProfile(meData.profile);
//       setApps(appsRes.data.applications || []);
//     } catch (e) {
//       toast.error(e.response?.data?.message || 'Failed to load profile');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => { load(); }, []);

//   const openEdit = () => {
//     setForm({
//       firstName: profile.first_name || '',
//       lastName: profile.last_name || '',
//       phone: profile.phone || '',
//       location: profile.location || '',
//       headline: profile.headline || '',
//       bio: profile.bio || '',
//       linkedin: profile.linkedin || '',
//       github: profile.github || '',
//       portfolio: profile.portfolio || '',
//     });
//     setEditOpen(true);
//   };

//   const saveProfile = async (e) => {
//     e.preventDefault();
//     setSaving(true);
//     try {
//       const { data } = await userApi.update(form);
//       setProfile(data.profile);
//       if (setUser) setUser((u) => (u ? { ...u, firstName: form.firstName, lastName: form.lastName } : u));
//       toast.success('Profile updated');
//       setEditOpen(false);
//     } catch (e) {
//       toast.error(e.response?.data?.message || 'Failed to save');
//     } finally {
//       setSaving(false);
//     }
//   };

//   const addSkill = async () => {
//     const name = skillInput.trim();
//     if (!name) return;
//     try {
//       await userApi.addSkill(name);
//       setSkillInput('');
//       load();
//     } catch { toast.error('Failed to add skill'); }
//   };

//   const removeSkill = async (id) => {
//     try { await userApi.removeSkill(id); load(); }
//     catch { toast.error('Failed to remove skill'); }
//   };

//   const uploadResume = async (file) => {
//     if (!file) return;
//     const fd = new FormData();
//     fd.append('resume', file);
//     try { await userApi.uploadResume(fd); toast.success('Resume uploaded'); load(); }
//     catch { toast.error('Upload failed'); }
//   };

//   const stats = {
//     total: apps.length,
//     pending: apps.filter((a) => ['APPLIED', 'UNDER_REVIEW'].includes(a.status)).length,
//     shortlisted: apps.filter((a) => a.status === 'SHORTLISTED').length,
//     rejected: apps.filter((a) => a.status === 'REJECTED').length,
//   };

//   if (loading) {
//     return (
//       <DashboardLayout title="My Profile" items={MENU}>
//         <Spinner />
//       </DashboardLayout>
//     );
//   }

//   if (!profile) {
//     return (
//       <DashboardLayout title="My Profile" items={MENU}>
//         <div className="card text-center py-10">
//           <p className="text-gray-500 mb-4">Could not load profile.</p>
//           <button onClick={load} className="btn-primary">Retry</button>
//         </div>
//       </DashboardLayout>
//     );
//   }

//   const initials = `${profile.first_name?.[0] || ''}${profile.last_name?.[0] || ''}`.toUpperCase();

//   return (
//     <DashboardLayout title="My Profile" items={MENU}>
//       <div className="card overflow-hidden p-0">
//         <div className="h-32 bg-gradient-to-r from-primary to-secondary" />
//         <div className="px-6 pb-6 -mt-16 relative">
//           <div className="flex flex-col md:flex-row md:items-end gap-4">
//             <div className="w-28 h-28 rounded-full bg-white p-1 shadow-md">
//               <div className="w-full h-full rounded-full bg-primary text-white grid place-items-center text-3xl font-bold">
//                 {initials || '👤'}
//               </div>
//             </div>
//             <div className="flex-1">
//               <h2 className="text-2xl font-bold">{profile.first_name} {profile.last_name}</h2>
//               <p className="text-sm text-primary font-medium mt-1">
//                 👤 {profile.role === 'JOB_SEEKER' ? 'Job Seeker' : profile.role}
//               </p>
//               <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-600 mt-3">
//                 <span>✉️ {profile.email}</span>
//                 <span>📞 {profile.phone || '—'}</span>
//                 <span>📍 {profile.location || '—'}</span>
//               </div>
//               {profile.bio && <p className="text-sm text-gray-700 mt-3 max-w-2xl">{profile.bio}</p>}
//             </div>
//             <button onClick={openEdit} className="btn-outline whitespace-nowrap">✏️ Edit Profile</button>
//           </div>
//         </div>
//       </div>

//       <div className="grid md:grid-cols-[1.2fr_1fr] gap-6 mt-6">
//         <div className="space-y-6">
//           <div className="card">
//             <h3 className="font-bold mb-4">👤 Personal Information</h3>
//             <div className="space-y-3 text-sm">
//               <Row label="Full Name" value={`${profile.first_name} ${profile.last_name}`} />
//               <Row label="Email" value={profile.email} />
//               <Row label="Phone" value={profile.phone || '—'} />
//               <Row label="Location" value={profile.location || '—'} />
//               <Row label="Role" value={profile.role === 'JOB_SEEKER' ? 'Job Seeker' : profile.role} />
//             </div>
//           </div>

//           <div className="card">
//             <h3 className="font-bold mb-4">🎓 Education</h3>
//             {profile.educations?.length ? profile.educations.map((e) => (
//               <div key={e.id} className="border-b py-3 last:border-0">
//                 <p className="font-medium">{e.degree || e.institution}</p>
//                 <p className="text-sm text-gray-500">{e.institution}</p>
//                 <p className="text-xs text-gray-400">{e.start_year || '—'} – {e.end_year || 'Present'}</p>
//               </div>
//             )) : <p className="text-sm text-gray-500">No education added yet.</p>}
//           </div>

//           <div className="card">
//             <h3 className="font-bold mb-4">💼 Experience</h3>
//             {profile.experiences?.length ? profile.experiences.map((x) => (
//               <div key={x.id} className="border-b py-3 last:border-0">
//                 <p className="font-medium">{x.position}</p>
//                 <p className="text-sm text-gray-500">{x.company}</p>
//                 {x.description && <p className="text-sm text-gray-600 mt-1">{x.description}</p>}
//               </div>
//             )) : <p className="text-sm text-gray-500">No experience added yet.</p>}
//           </div>
//         </div>

//         <div className="space-y-6">
//           <div className="card">
//             <h3 className="font-bold mb-4">📄 Resume</h3>
//             {profile.resume_url ? (
//               <a href={fileUrl(profile.resume_url)} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50">
//                 <div className="w-10 h-10 rounded bg-red-50 text-red-500 grid place-items-center">📄</div>
//                 <div className="flex-1">
//                   <p className="font-medium text-sm">{profile.first_name}_resume.pdf</p>
//                   <p className="text-xs text-gray-500">Click to view</p>
//                 </div>
//               </a>
//             ) : <p className="text-sm text-gray-500 mb-3">No resume uploaded yet.</p>}
//             <label className="btn-outline w-full mt-3 justify-center cursor-pointer">
//               ⬆️ {profile.resume_url ? 'Upload New Resume' : 'Upload Resume'}
//               <input type="file" accept=".pdf,.doc,.docx" className="hidden"
//                 onChange={(e) => e.target.files[0] && uploadResume(e.target.files[0])} />
//             </label>
//           </div>

//           <div className="card">
//             <h3 className="font-bold mb-4">⚡ Skills</h3>
//             <div className="flex flex-wrap gap-2 mb-3">
//               {profile.skills?.length ? profile.skills.map((s) => (
//                 <span key={s.id} className="badge bg-primary/10 text-primary flex items-center gap-1">
//                   {s.name}
//                   <button onClick={() => removeSkill(s.id)} className="text-danger ml-1">×</button>
//                 </span>
//               )) : <p className="text-sm text-gray-500">No skills added yet.</p>}
//             </div>
//             <div className="flex gap-2">
//               <input className="input" placeholder="Add a skill…" value={skillInput}
//                 onChange={(e) => setSkillInput(e.target.value)}
//                 onKeyDown={(e) => e.key === 'Enter' && addSkill()} />
//               <button onClick={addSkill} className="btn-primary whitespace-nowrap">Add</button>
//             </div>
//           </div>

//           <div className="card">
//             <h3 className="font-bold mb-4">📊 Application Statistics</h3>
//             <div className="grid grid-cols-2 gap-3">
//               <Stat label="Total Applications" value={stats.total} bg="bg-blue-50" color="text-blue-600" icon="📨" />
//               <Stat label="Pending" value={stats.pending} bg="bg-amber-50" color="text-amber-600" icon="⏳" />
//               <Stat label="Shortlisted" value={stats.shortlisted} bg="bg-green-50" color="text-green-600" icon="✅" />
//               <Stat label="Rejected" value={stats.rejected} bg="bg-red-50" color="text-red-600" icon="❌" />
//             </div>
//           </div>

//           <div className="card">
//             <h3 className="font-bold mb-4">⚡ Quick Actions</h3>
//             <div className="grid grid-cols-2 gap-3">
//               <Link to="/jobs" className="btn-primary justify-center">🔍 Browse Jobs</Link>
//               <Link to="/seeker/applications" className="btn-outline justify-center">📝 View Applications</Link>
//             </div>
//           </div>
//         </div>
//       </div>

//       <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit Profile">
//         <form onSubmit={saveProfile} className="space-y-4">
//           <div className="grid grid-cols-2 gap-3">
//             <div><label className="label">First Name</label>
//               <input className="input" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} /></div>
//             <div><label className="label">Last Name</label>
//               <input className="input" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} /></div>
//           </div>
//           <div className="grid grid-cols-2 gap-3">
//             <div><label className="label">Phone</label>
//               <input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
//             <div><label className="label">Location</label>
//               <input className="input" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></div>
//           </div>
//           <div><label className="label">Headline</label>
//             <input className="input" value={form.headline} onChange={(e) => setForm({ ...form, headline: e.target.value })} /></div>
//           <div><label className="label">Bio</label>
//             <textarea rows={3} className="input" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} /></div>
//           <div className="grid grid-cols-3 gap-3">
//             <div><label className="label">LinkedIn</label>
//               <input className="input" value={form.linkedin} onChange={(e) => setForm({ ...form, linkedin: e.target.value })} /></div>
//             <div><label className="label">GitHub</label>
//               <input className="input" value={form.github} onChange={(e) => setForm({ ...form, github: e.target.value })} /></div>
//             <div><label className="label">Portfolio</label>
//               <input className="input" value={form.portfolio} onChange={(e) => setForm({ ...form, portfolio: e.target.value })} /></div>
//           </div>
//           <div className="flex justify-end gap-3 pt-2">
//             <button type="button" onClick={() => setEditOpen(false)} className="btn-outline">Cancel</button>
//             <button disabled={saving} className="btn-primary">{saving ? 'Saving…' : 'Save Changes'}</button>
//           </div>
//         </form>
//       </Modal>
//     </DashboardLayout>
//   );
// }

// function Row({ label, value }) {
//   return (
//     <div className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0">
//       <span className="text-gray-500 w-32 shrink-0">{label}</span>
//       <span className="text-gray-900">{value}</span>
//     </div>
//   );
// }

// function Stat({ label, value, bg, color, icon }) {
//   return (
//     <div className={`${bg} rounded-lg p-3`}>
//       <div className={`${color} text-lg`}>{icon}</div>
//       <p className="text-2xl font-bold mt-1">{value}</p>
//       <p className="text-xs text-gray-600">{label}</p>
//     </div>
//   );
// }


 //addational three


 import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import Spinner from '../../components/common/Spinner';
import Modal from '../../components/common/Modal';
import { userApi } from '../../api/user.api';
import { applicationApi } from '../../api/application.api';
import { fileUrl } from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const MENU = [
  { to: '/seeker', label: 'Dashboard', icon: '📊', end: true },
  { to: '/seeker/applications', label: 'My Applications', icon: '📝' },
  { to: '/seeker/saved', label: 'Saved Jobs', icon: '❤️' },
  { to: '/seeker/profile', label: 'Profile', icon: '👤' },
  { to: '/seeker/notifications', label: 'Notifications', icon: '🔔' },
];

export default function Profile() {
  const { setUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit modal
  const [editOpen, setEditOpen] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  // Inline forms
  const [eduForm, setEduForm] = useState({ institution: '', degree: '', field: '', startYear: '', endYear: '' });
  const [expForm, setExpForm] = useState({ company: '', position: '', startDate: '', endDate: '', current: false, description: '' });
  const [skillInput, setSkillInput] = useState('');

  const avatarInputRef = useRef(null);

  const load = async () => {
    setLoading(true);
    try {
      const [{ data: meData }, appsRes] = await Promise.all([
        userApi.me(),
        applicationApi.mine().catch(() => ({ data: { applications: [] } })),
      ]);
      setProfile(meData.profile);
      setApps(appsRes.data.applications || []);
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); /* eslint-disable-next-line */ }, []);

  const openEdit = () => {
    setForm({
      firstName: profile.first_name || '',
      lastName: profile.last_name || '',
      phone: profile.phone || '',
      location: profile.location || '',
      headline: profile.headline || '',
      bio: profile.bio || '',
      linkedin: profile.linkedin || '',
      github: profile.github || '',
      portfolio: profile.portfolio || '',
    });
    setEditOpen(true);
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await userApi.update(form);
      setProfile(data.profile);
      if (setUser) setUser((u) => (u ? { ...u, firstName: form.firstName, lastName: form.lastName } : u));
      toast.success('Profile updated');
      setEditOpen(false);
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  // ---- Education ----
  const addEducation = async () => {
    if (!eduForm.institution.trim()) return toast.error('Institution is required');
    try {
      await userApi.addEducation(eduForm);
      setEduForm({ institution: '', degree: '', field: '', startYear: '', endYear: '' });
      toast.success('Education added');
      load();
    } catch (e) { toast.error(e.response?.data?.message || 'Failed'); }
  };
  const removeEducation = async (id) => {
    try { await userApi.removeEducation(id); load(); }
    catch { toast.error('Failed to remove'); }
  };

  // ---- Experience ----
  const addExperience = async () => {
    if (!expForm.company.trim() || !expForm.position.trim()) return toast.error('Company and position required');
    try {
      await userApi.addExperience(expForm);
      setExpForm({ company: '', position: '', startDate: '', endDate: '', current: false, description: '' });
      toast.success('Experience added');
      load();
    } catch (e) { toast.error(e.response?.data?.message || 'Failed'); }
  };
  const removeExperience = async (id) => {
    try { await userApi.removeExperience(id); load(); }
    catch { toast.error('Failed to remove'); }
  };

  // ---- Skills ----
  const addSkill = async () => {
    const name = skillInput.trim();
    if (!name) return;
    try { await userApi.addSkill(name); setSkillInput(''); load(); }
    catch { toast.error('Failed to add skill'); }
  };
  const removeSkill = async (id) => {
    try { await userApi.removeSkill(id); load(); }
    catch { toast.error('Failed to remove skill'); }
  };

  // ---- Resume ----
  const uploadResume = async (file) => {
    if (!file) return;
    const fd = new FormData();
    fd.append('resume', file);
    try { await userApi.uploadResume(fd); toast.success('Resume uploaded'); load(); }
    catch { toast.error('Upload failed'); }
  };

  // ---- Avatar ----
  const uploadAvatar = async (file) => {
    if (!file) return;
    const fd = new FormData();
    fd.append('avatar', file);
    try {
      // Uses the same /users/me/resume pattern; add /users/me/avatar on backend if not present
      await userApi.uploadAvatar?.(fd);
      toast.success('Photo updated');
      load();
    } catch {
      toast.error('Avatar upload not configured yet — see note below');
    }
  };

  if (loading) return <DashboardLayout title="My Profile" items={MENU}><Spinner /></DashboardLayout>;
  if (!profile) {
    return (
      <DashboardLayout title="My Profile" items={MENU}>
        <div className="card text-center py-10">
          <p className="text-gray-500 mb-4">Could not load profile.</p>
          <button onClick={load} className="btn-primary">Retry</button>
        </div>
      </DashboardLayout>
    );
  }

  const initials = `${profile.first_name?.[0] || ''}${profile.last_name?.[0] || ''}`.toUpperCase();

  const stats = {
    total: apps.length,
    pending: apps.filter((a) => ['APPLIED', 'UNDER_REVIEW'].includes(a.status)).length,
    shortlisted: apps.filter((a) => a.status === 'SHORTLISTED').length,
    rejected: apps.filter((a) => a.status === 'REJECTED').length,
  };

  return (
    <DashboardLayout title="My Profile" items={MENU}>
      {/* ---------------- HERO HEADER ---------------- */}
      <div className="card overflow-hidden p-0 mb-6">
        <div className="h-40 bg-gradient-to-r from-primary via-blue-600 to-secondary" />

        <div className="px-6 md:px-8 pb-6 -mt-16 relative">
          <div className="flex flex-col md:flex-row md:items-end gap-5">
            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-white p-1 shadow-lg">
                {profile.avatar_url ? (
                  <img
                    src={fileUrl(profile.avatar_url)}
                    alt="avatar"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-primary to-secondary text-white grid place-items-center text-4xl font-bold">
                    {initials || '👤'}
                  </div>
                )}
              </div>
              <button
                onClick={() => avatarInputRef.current?.click()}
                title="Upload photo"
                className="absolute bottom-1 right-1 w-9 h-9 rounded-full bg-gray-900 text-white grid place-items-center shadow-md hover:bg-black transition"
              >
                📷
              </button>
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files[0] && uploadAvatar(e.target.files[0])}
              />
            </div>

            {/* Name + meta */}
            <div className="flex-1 md:pb-2">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                {profile.first_name} {profile.last_name}
              </h2>
              <p className="text-sm text-primary font-semibold mt-1">
                👤 {profile.role === 'JOB_SEEKER' ? 'Job Seeker' : profile.role}
              </p>

              <div className="flex flex-wrap gap-x-6 gap-y-1.5 text-sm text-gray-600 mt-3">
                <span className="flex items-center gap-1.5">✉️ {profile.email}</span>
                <span className="flex items-center gap-1.5">📞 {profile.phone || '—'}</span>
                <span className="flex items-center gap-1.5">📍 {profile.location || '—'}</span>
              </div>

              {profile.bio && (
                <p className="text-sm text-gray-700 mt-3 max-w-2xl leading-relaxed">{profile.bio}</p>
              )}
            </div>

            <button onClick={openEdit} className="btn-outline whitespace-nowrap md:mb-2">
              ✏️ Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* ---------------- GRID ---------------- */}
      <div className="grid md:grid-cols-[1.2fr_1fr] gap-6">
        {/* LEFT COLUMN */}
        <div className="space-y-6">
          {/* Personal Info */}
          <div className="card">
            <h3 className="section-title">
              <span className="section-icon">👤</span> Personal Information
            </h3>
            <div className="space-y-3 text-sm">
              <Row label="Full Name" value={`${profile.first_name} ${profile.last_name}`} />
              <Row label="Email" value={profile.email} />
              <Row label="Phone" value={profile.phone || '—'} />
              <Row label="Location" value={profile.location || '—'} />
              <Row label="Role" value={profile.role === 'JOB_SEEKER' ? 'Job Seeker' : profile.role} />
            </div>
          </div>

          {/* Education */}
          <div className="card">
            <h3 className="section-title">
              <span className="section-icon">🎓</span> Education
            </h3>

            {profile.educations?.length > 0 ? (
              <div className="space-y-3 mb-5">
                {profile.educations.map((e) => (
                  <div key={e.id} className="flex justify-between items-start p-3 rounded-xl bg-gray-50">
                    <div>
                      <p className="font-semibold text-gray-900">{e.degree || e.institution}</p>
                      <p className="text-sm text-gray-500">{e.institution}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {e.start_year || '—'} – {e.end_year || 'Present'}
                        {e.field ? ` · ${e.field}` : ''}
                      </p>
                    </div>
                    <button onClick={() => removeEducation(e.id)} className="text-danger text-xs hover:underline">
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 mb-4">No education added yet.</p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 rounded-xl border border-dashed border-gray-200">
              <input className="input" placeholder="Institution *" value={eduForm.institution}
                onChange={(e) => setEduForm({ ...eduForm, institution: e.target.value })} />
              <input className="input" placeholder="Degree (BSc, MSc…)" value={eduForm.degree}
                onChange={(e) => setEduForm({ ...eduForm, degree: e.target.value })} />
              <input className="input" placeholder="Field of study" value={eduForm.field}
                onChange={(e) => setEduForm({ ...eduForm, field: e.target.value })} />
              <div className="grid grid-cols-2 gap-2">
                <input className="input" placeholder="From (2020)" value={eduForm.startYear}
                  onChange={(e) => setEduForm({ ...eduForm, startYear: e.target.value })} />
                <input className="input" placeholder="To (2024)" value={eduForm.endYear}
                  onChange={(e) => setEduForm({ ...eduForm, endYear: e.target.value })} />
              </div>
              <button type="button" onClick={addEducation} className="btn-primary md:col-span-2">
                ➕ Add Education
              </button>
            </div>
          </div>

          {/* Experience */}
          <div className="card">
            <h3 className="section-title">
              <span className="section-icon">💼</span> Experience
            </h3>

            {profile.experiences?.length > 0 ? (
              <div className="space-y-3 mb-5">
                {profile.experiences.map((x) => (
                  <div key={x.id} className="flex justify-between items-start p-3 rounded-xl bg-gray-50">
                    <div>
                      <p className="font-semibold text-gray-900">{x.position}</p>
                      <p className="text-sm text-gray-500">{x.company}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {x.start_date?.slice(0, 10) || '—'} – {x.current ? 'Present' : (x.end_date?.slice(0, 10) || '—')}
                      </p>
                      {x.description && <p className="text-sm text-gray-600 mt-1">{x.description}</p>}
                    </div>
                    <button onClick={() => removeExperience(x.id)} className="text-danger text-xs hover:underline">
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 mb-4">No experience added yet.</p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 rounded-xl border border-dashed border-gray-200">
              <input className="input" placeholder="Company *" value={expForm.company}
                onChange={(e) => setExpForm({ ...expForm, company: e.target.value })} />
              <input className="input" placeholder="Position *" value={expForm.position}
                onChange={(e) => setExpForm({ ...expForm, position: e.target.value })} />
              <input type="date" className="input" value={expForm.startDate}
                onChange={(e) => setExpForm({ ...expForm, startDate: e.target.value })} />
              <input type="date" className="input" value={expForm.endDate}
                onChange={(e) => setExpForm({ ...expForm, endDate: e.target.value })}
                disabled={expForm.current} />
              <label className="flex items-center gap-2 text-sm text-gray-600 md:col-span-2">
                <input type="checkbox" checked={expForm.current}
                  onChange={(e) => setExpForm({ ...expForm, current: e.target.checked })} />
                I currently work here
              </label>
              <textarea rows={2} className="input md:col-span-2" placeholder="Description (optional)"
                value={expForm.description}
                onChange={(e) => setExpForm({ ...expForm, description: e.target.value })} />
              <button type="button" onClick={addExperience} className="btn-primary md:col-span-2">
                ➕ Add Experience
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">
          {/* Resume */}
          <div className="card">
            <h3 className="section-title"><span className="section-icon">📄</span> Resume</h3>
            {profile.resume_url ? (
              <a href={fileUrl(profile.resume_url)} target="_blank" rel="noreferrer"
                className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition">
                <div className="w-10 h-10 rounded-lg bg-red-50 text-red-500 grid place-items-center">📄</div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{profile.first_name}_resume.pdf</p>
                  <p className="text-xs text-gray-500">Click to view / download</p>
                </div>
              </a>
            ) : (
              <p className="text-sm text-gray-500 mb-3">No resume uploaded yet.</p>
            )}
            <label className="btn-outline w-full mt-3 justify-center cursor-pointer">
              ⬆️ {profile.resume_url ? 'Upload New Resume' : 'Upload Resume'}
              <input type="file" accept=".pdf,.doc,.docx" className="hidden"
                onChange={(e) => e.target.files[0] && uploadResume(e.target.files[0])} />
            </label>
          </div>

          {/* Skills */}
          <div className="card">
            <h3 className="section-title"><span className="section-icon">⚡</span> Skills</h3>
            <div className="flex flex-wrap gap-2 mb-3">
              {profile.skills?.length > 0 ? profile.skills.map((s) => (
                <span key={s.id} className="badge bg-primary/10 text-primary">
                  {s.name}
                  <button onClick={() => removeSkill(s.id)} className="text-danger ml-1 leading-none">×</button>
                </span>
              )) : <p className="text-sm text-gray-500">No skills added yet.</p>}
            </div>
            <div className="flex gap-2">
              <input className="input" placeholder="Add a skill (React, Node…)" value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addSkill()} />
              <button onClick={addSkill} className="btn-primary whitespace-nowrap">Add</button>
            </div>
          </div>

          {/* Application Statistics */}
          <div className="card">
            <h3 className="section-title"><span className="section-icon">📊</span> Application Statistics</h3>
            <div className="grid grid-cols-2 gap-3">
              <Stat label="Total Applications" value={stats.total}       bg="bg-blue-50"    color="text-blue-600"    icon="📨" />
              <Stat label="Pending"            value={stats.pending}     bg="bg-amber-50"   color="text-amber-600"   icon="⏳" />
              <Stat label="Shortlisted"        value={stats.shortlisted} bg="bg-green-50"   color="text-green-600"   icon="✅" />
              <Stat label="Rejected"           value={stats.rejected}    bg="bg-red-50"     color="text-red-600"     icon="❌" />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card">
            <h3 className="section-title"><span className="section-icon">⚡</span> Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <Link to="/jobs" className="btn-primary justify-center">🔍 Browse Jobs</Link>
              <Link to="/seeker/applications" className="btn-outline justify-center">📝 View Applications</Link>
            </div>
          </div>
        </div>
      </div>

      {/* ---------------- EDIT MODAL ---------------- */}
      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit Profile">
        <form onSubmit={saveProfile} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div><label className="label">First Name</label>
              <input className="input" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} /></div>
            <div><label className="label">Last Name</label>
              <input className="input" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="label">Phone</label>
              <input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
            <div><label className="label">Location</label>
              <input className="input" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></div>
          </div>
          <div><label className="label">Headline</label>
            <input className="input" value={form.headline} onChange={(e) => setForm({ ...form, headline: e.target.value })} /></div>
          <div><label className="label">Bio</label>
            <textarea rows={3} className="input" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} /></div>
          <div className="grid grid-cols-3 gap-3">
            <div><label className="label">LinkedIn</label>
              <input className="input" value={form.linkedin} onChange={(e) => setForm({ ...form, linkedin: e.target.value })} /></div>
            <div><label className="label">GitHub</label>
              <input className="input" value={form.github} onChange={(e) => setForm({ ...form, github: e.target.value })} /></div>
            <div><label className="label">Portfolio</label>
              <input className="input" value={form.portfolio} onChange={(e) => setForm({ ...form, portfolio: e.target.value })} /></div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setEditOpen(false)} className="btn-outline">Cancel</button>
            <button disabled={saving} className="btn-primary">{saving ? 'Saving…' : 'Save Changes'}</button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
}

// ---------- helpers ----------
function Row({ label, value }) {
  return (
    <div className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0">
      <span className="text-gray-500 w-32 shrink-0">{label}</span>
      <span className="text-gray-900">{value}</span>
    </div>
  );
}

function Stat({ label, value, bg, color, icon }) {
  return (
    <div className={`${bg} rounded-xl p-4`}>
      <div className={`${color} text-lg`}>{icon}</div>
      <p className="text-2xl font-bold mt-1">{value}</p>
      <p className="text-xs text-gray-600">{label}</p>
    </div>
  );
}