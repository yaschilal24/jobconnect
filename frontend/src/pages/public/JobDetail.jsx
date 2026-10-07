import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import Modal from '../../components/common/Modal';
import Spinner from '../../components/common/Spinner';
import { jobApi } from '../../api/job.api';
import { applicationApi } from '../../api/application.api';
import { useAuth } from '../../context/AuthContext';

export default function JobDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [cover, setCover] = useState('');
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    jobApi.getById(id)
      .then(({ data }) => setJob(data.job))
      .catch(() => toast.error('Job not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleApply = async () => {
    if (!user) return nav('/login');
    if (user.role !== 'JOB_SEEKER') return toast.error('Only job seekers can apply');
    if (cover.trim().length < 20) return toast.error('Cover letter must be at least 20 characters');
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('jobId', id);
      fd.append('coverLetter', cover);
      if (file) fd.append('resume', file);
      await applicationApi.apply(fd);
      toast.success('Application submitted!');
      setOpen(false); setCover(''); setFile(null);
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed');
    } finally { setSubmitting(false); }
  };

  if (loading) return <><Navbar /><Spinner /></>;
  if (!job) return <><Navbar /><div className="p-10 text-center">Job not found</div></>;

  return (
    <>
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="card">
          <div className="flex flex-col md:flex-row justify-between gap-6">
            <div className="flex gap-4">
              <div className="w-16 h-16 rounded-lg bg-primary/10 grid place-items-center text-primary font-bold text-2xl">
                {job.company_name?.[0]}
              </div>
              <div>
                <h1 className="text-2xl font-bold">{job.title}</h1>
                <p className="text-gray-600">{job.company_name} · {job.location}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="badge bg-blue-100 text-blue-700">{job.employment_type?.replace('_', ' ')}</span>
                  {job.experience_level && <span className="badge bg-gray-100 text-gray-700">{job.experience_level}</span>}
                  {job.salary_min && <span className="badge bg-green-100 text-green-700">${job.salary_min}–${job.salary_max} {job.currency}</span>}
                </div>
              </div>
            </div>
            <button onClick={() => setOpen(true)} className="btn-primary h-fit">Apply Now</button>
          </div>
        </div>
        <div className="grid md:grid-cols-[2fr_1fr] gap-6 mt-6">
          <div className="space-y-6">
            <div className="card">
              <h2 className="font-bold text-lg mb-3">About the Company</h2>
              <p className="text-gray-700">{job.company_description || 'No description'}</p>
              {job.company_website && <a href={job.company_website} target="_blank" rel="noreferrer" className="text-primary text-sm mt-2 inline-block">{job.company_website}</a>}
            </div>
            <div className="card"><h2 className="font-bold text-lg mb-3">Job Description</h2><p className="text-gray-700 whitespace-pre-line">{job.description}</p></div>
            {job.requirements && <div className="card"><h2 className="font-bold text-lg mb-3">Requirements</h2><p className="text-gray-700 whitespace-pre-line">{job.requirements}</p></div>}
            {job.responsibilities && <div className="card"><h2 className="font-bold text-lg mb-3">Responsibilities</h2><p className="text-gray-700 whitespace-pre-line">{job.responsibilities}</p></div>}
          </div>
          <div className="card h-fit">
            <h3 className="font-bold mb-4">Job Overview</h3>
            <dl className="space-y-3 text-sm">
              <div><dt className="text-gray-500">Category</dt><dd>{job.category || '—'}</dd></div>
              <div><dt className="text-gray-500">Type</dt><dd>{job.employment_type?.replace('_', ' ')}</dd></div>
              <div><dt className="text-gray-500">Positions</dt><dd>{job.positions}</dd></div>
              <div><dt className="text-gray-500">Deadline</dt><dd>{job.deadline ? new Date(job.deadline).toLocaleDateString() : '—'}</dd></div>
              <div><dt className="text-gray-500">Posted</dt><dd>{new Date(job.created_at).toLocaleDateString()}</dd></div>
            </dl>
          </div>
        </div>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Apply for this Job">
        <div className="space-y-4">
          <div>
            <label className="label">Cover Letter *</label>
            <textarea rows={6} className="input" value={cover} onChange={(e) => setCover(e.target.value)} />
          </div>
          <div>
            <label className="label">Resume (PDF/DOCX, optional)</label>
            <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => setFile(e.target.files[0])} />
          </div>
          <div className="flex gap-3 justify-end">
            <button onClick={() => setOpen(false)} className="btn-outline">Cancel</button>
            <button onClick={handleApply} disabled={submitting} className="btn-primary">{submitting ? 'Submitting…' : 'Submit Application'}</button>
          </div>
        </div>
      </Modal>
      <Footer />
    </>
  );
}