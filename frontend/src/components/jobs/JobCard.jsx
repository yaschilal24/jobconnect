import { Link } from 'react-router-dom';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { savedJobApi } from '../../api/savedJob.api';
import { useAuth } from '../../context/AuthContext';

const badgeColors = {
  INTERNSHIP: 'bg-purple-100 text-purple-700',
  FULL_TIME: 'bg-blue-100 text-blue-700',
  PART_TIME: 'bg-amber-100 text-amber-700',
  CONTRACT: 'bg-emerald-100 text-emerald-700',
};

export default function JobCard({ job, initiallySaved = false, onSaveChange }) {
  const { user } = useAuth();
  const [saved, setSaved] = useState(initiallySaved);

  const toggleSave = async (e) => {
    e.preventDefault(); e.stopPropagation();
    if (!user || user.role !== 'JOB_SEEKER') return toast.error('Only job seekers can save');
    try {
      if (saved) { await savedJobApi.unsave(job.id); setSaved(false); }
      else { await savedJobApi.save(job.id); setSaved(true); toast.success('Saved'); }
      onSaveChange?.();
    } catch { toast.error('Failed'); }
  };

  return (
    <Link to={`/jobs/${job.id}`} className="block card hover:shadow-md transition relative">
      {user?.role === 'JOB_SEEKER' && (
        <button onClick={toggleSave} className="absolute top-3 right-3 text-lg">
          {saved ? '❤️' : '🤍'}
        </button>
      )}
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-lg bg-primary/10 grid place-items-center text-primary font-bold">
          {job.company_name?.[0] || 'C'}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-lg text-gray-900">{job.title}</h3>
          <p className="text-sm text-gray-600">{job.company_name} · {job.location}</p>
          <div className="flex flex-wrap gap-2 mt-3">
            <span className={`badge ${badgeColors[job.employment_type] || 'bg-gray-100 text-gray-700'}`}>
              {job.employment_type?.replace('_', ' ')}
            </span>
            {job.experience_level && <span className="badge bg-gray-100 text-gray-700">{job.experience_level}</span>}
            {job.salary_min && <span className="badge bg-green-50 text-green-700">${job.salary_min}–${job.salary_max}</span>}
          </div>
        </div>
      </div>
    </Link>
  );
}