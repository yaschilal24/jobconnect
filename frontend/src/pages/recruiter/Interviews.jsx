// import { useEffect, useState } from 'react';
// import toast from 'react-hot-toast';
// import DashboardLayout from '../../components/dashboard/DashboardLayout';
// import Spinner from '../../components/common/Spinner';
// import EmptyState from '../../components/common/EmptyState';
// import { interviewApi } from '../../api/interview.api';

// const MENU = [
//   { to: '/recruiter', label: 'Dashboard', icon: '📊', end: true },
//   { to: '/recruiter/post-job', label: 'Post a Job', icon: '➕' },
//   { to: '/recruiter/jobs', label: 'Manage Jobs', icon: '💼' },
//   { to: '/recruiter/company', label: 'Company Profile', icon: '🏢' },
//   { to: '/recruiter/interviews', label: 'Interviews', icon: '🗓️' },
// ];

// export default function Interviews() {
//   const [items, setItems] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const load = () => {
//     setLoading(true);
//     interviewApi.mine().then(({ data }) => setItems(data.interviews)).finally(() => setLoading(false));
//   };
//   useEffect(load, []);

//   const cancel = async (id) => {
//     if (!confirm('Cancel this interview?')) return;
//     try { await interviewApi.cancel(id); toast.success('Cancelled'); load(); }
//     catch { toast.error('Failed'); }
//   };

//   return (
//     <DashboardLayout title="Interviews" items={MENU}>
//       {loading ? <Spinner /> : items.length === 0 ? (
//         <EmptyState title="No interviews scheduled" icon="🗓️" />
//       ) : (
//         <div className="space-y-3">
//           {items.map((i) => (
//             <div key={i.id} className="card">
//               <div className="flex justify-between">
//                 <div>
//                   <p className="font-medium">{i.first_name} {i.last_name}</p>
//                   <p className="text-sm text-gray-500">{i.job_title}</p>
//                 </div>
//                 <div className="text-right text-sm">
//                   <p className="font-medium">{new Date(i.scheduled_at).toLocaleString()}</p>
//                   <p className="text-gray-500">{i.interview_type} · {i.duration_minutes} min · {i.status}</p>
//                   <button onClick={() => cancel(i.id)} className="text-danger text-xs mt-2">Cancel</button>
//                 </div>
//               </div>
//               {i.meeting_link && <a href={i.meeting_link} target="_blank" rel="noreferrer" className="text-primary text-sm mt-2 inline-block">Join meeting</a>}
//             </div>
//           ))}
//         </div>
//       )}
//     </DashboardLayout>
//   );
// }


import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import Spinner from '../../components/common/Spinner';
import EmptyState from '../../components/common/EmptyState';
import { interviewApi } from '../../api/interview.api';

const MENU = [
  { to: '/recruiter', label: 'Dashboard', icon: '📊', end: true },
  { to: '/recruiter/post-job', label: 'Post a Job', icon: '➕' },
  { to: '/recruiter/jobs', label: 'Manage Jobs', icon: '💼' },
  { to: '/recruiter/company', label: 'Company Profile', icon: '🏢' },
  { to: '/recruiter/interviews', label: 'Interviews', icon: '🗓️' },
];

export default function Interviews() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await interviewApi.mine();
      console.log('interviews response:', data); // ← open console to inspect
      setItems(data.interviews || []);
    } catch (e) {
      console.error('interviews error:', e.response?.data || e.message);
      toast.error(e.response?.data?.message || 'Failed to load interviews');
    } finally {
      setLoading(false); // ← ALWAYS runs
    }
  };

  useEffect(() => { load(); }, []);

  const cancel = async (id) => {
    if (!confirm('Cancel this interview?')) return;
    try {
      await interviewApi.cancel(id);
      toast.success('Cancelled');
      load();
    } catch {
      toast.error('Failed to cancel');
    }
  };

  return (
    <DashboardLayout title="Interviews" items={MENU}>
      {loading ? (
        <Spinner />
      ) : items.length === 0 ? (
        <EmptyState
          title="No interviews scheduled"
          message="Schedule an interview from the Applicants page."
          icon="🗓️"
        />
      ) : (
        <div className="space-y-3">
          {items.map((i) => (
            <div key={i.id} className="card">
              <div className="flex justify-between">
                <div>
                  <p className="font-medium">{i.first_name} {i.last_name}</p>
                  <p className="text-sm text-gray-500">{i.job_title}</p>
                  <p className="text-xs text-gray-400">{i.email}</p>
                </div>
                <div className="text-right text-sm">
                  <p className="font-medium">{new Date(i.scheduled_at).toLocaleString()}</p>
                  <p className="text-gray-500">
                    {i.interview_type} · {i.duration_minutes} min · {i.status}
                  </p>
                  <button onClick={() => cancel(i.id)} className="text-danger text-xs mt-2">
                    Cancel
                  </button>
                </div>
              </div>
              {i.meeting_link && (
                <a
                  href={i.meeting_link}
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary text-sm mt-2 inline-block"
                >
                  Join meeting
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}