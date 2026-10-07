// import { Link } from 'react-router-dom';
// import { useState } from 'react';
// import Navbar from '../../components/common/Navbar';
// import Footer from '../../components/common/Footer';

// const CATEGORIES = [
//   { name: 'Software Development', icon: '💻' },
//   { name: 'Design', icon: '🎨' },
//   { name: 'Marketing', icon: '📈' },
//   { name: 'Data Science', icon: '📊' },
// ];

// export default function Home() {
//   const [q, setQ] = useState('');
//   const [loc, setLoc] = useState('');
//   return (
//     <>
//       <Navbar />
//       <section className="bg-gradient-to-br from-primary to-secondary text-white">
//         <div className="max-w-7xl mx-auto px-4 py-20 text-center">
//           <h1 className="text-4xl md:text-6xl font-bold mb-4">Find Your Dream Job or Internship</h1>
//           <p className="text-lg opacity-90 mb-8">Connect with top companies and launch your career.</p>
//           <div className="bg-white rounded-xl p-2 flex flex-col md:flex-row gap-2 max-w-3xl mx-auto shadow-xl">
//             <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Job title or keyword"
//               className="flex-1 px-4 py-3 rounded-lg outline-none text-gray-800" />
//             <input value={loc} onChange={(e) => setLoc(e.target.value)} placeholder="Location"
//               className="flex-1 px-4 py-3 rounded-lg outline-none text-gray-800 border-l border-gray-200" />
//             <Link to={`/jobs?q=${encodeURIComponent(q)}&location=${encodeURIComponent(loc)}`}
//               className="btn-primary px-8">Search</Link>
//           </div>
//           <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto mt-12">
//             <div><p className="text-3xl font-bold">10K+</p><p className="text-sm opacity-90">Jobs & Internships</p></div>
//             <div><p className="text-3xl font-bold">2K+</p><p className="text-sm opacity-90">Companies</p></div>
//             <div><p className="text-3xl font-bold">50K+</p><p className="text-sm opacity-90">Active Users</p></div>
//           </div>
//         </div>
//       </section>
//       <section className="max-w-7xl mx-auto px-4 py-16">
//         <h2 className="text-2xl font-bold mb-8 text-center">Popular Job Categories</h2>
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//           {CATEGORIES.map((c) => (
//             <Link key={c.name} to={`/jobs?category=${encodeURIComponent(c.name)}`} className="card text-center hover:shadow-md transition">
//               <div className="text-4xl mb-2">{c.icon}</div>
//               <p className="font-medium">{c.name}</p>
//             </Link>
//           ))}
//         </div>
//       </section>
//       <Footer />
//     </>
//   );
// }


// add the new home page code
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import { jobApi } from '../../api/job.api';

const CATEGORY_ICONS = {
  'Software Development': '💻',
  'Design': '🎨',
  'Marketing': '📈',
  'Data Science': '📊',
  'Finance': '💰',
  'Education': '🎓',
  'Healthcare': '⚕️',
  'Engineering': '⚙️',
  'Sales': '🛒',
  'Customer Support': '🎧',
};

export default function Home() {
  const [q, setQ] = useState('');
  const [loc, setLoc] = useState('');
  const [stats, setStats] = useState({ totalJobs: 0, totalCompanies: 0, totalSeekers: 0 });
  const [categories, setCategories] = useState([]);

  // Fetch real data on mount
  useEffect(() => {
    jobApi.publicStats()
      .then(({ data }) => setStats(data.stats))
      .catch(() => {});

    // Derive categories from live jobs
    jobApi.search({ limit: 50 })
      .then(({ data }) => {
        const map = new Map();
        (data.items || []).forEach((j) => {
          if (!j.category) return;
          map.set(j.category, (map.get(j.category) || 0) + 1);
        });
        const list = Array.from(map.entries())
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 6);
        setCategories(list);
      })
      .catch(() => {});
  }, []);

  const pretty = (n) => (n >= 1000 ? `${Math.floor(n / 1000)}K+` : `${n}`);

  return (
    <>
      <Navbar />

      {/* HERO */}
<section className="relative text-white overflow-hidden">
  {/* Background image */}
  <div
    className="absolute inset-0 bg-cover bg-center"
    style={{
      backgroundImage:
        "url('https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1920&q=80')",
    }}
  />
  {/* Overlay for readability */}
  <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/20" />

  {/* Content */}
  <div className="relative max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-red-500 via-blue-100 to-yellow-200 bg-clip-text text-transparent">
  Find Your Dream Job or Internship
</h1>
          <p className="text-lg opacity-90 mb-8">
            Connect with top companies and launch your career.
          </p>

          <div className="bg-white rounded-xl p-2 flex flex-col md:flex-row gap-2 max-w-3xl mx-auto shadow-xl">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Job title or keyword"
              className="flex-1 px-4 py-3 rounded-lg outline-none text-gray-800"
            />
            <input
              value={loc}
              onChange={(e) => setLoc(e.target.value)}
              placeholder="Location"
              className="flex-1 px-4 py-3 rounded-lg outline-none text-gray-800 border-l border-gray-200"
            />
            <Link
              to={`/jobs?q=${encodeURIComponent(q)}&location=${encodeURIComponent(loc)}`}
              className="btn-primary px-8"
            >
              Search
            </Link>
          </div>

          {/* REAL STATS */}
        <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto mt-12">
  <div>
    <p className="text-4xl font-bold bg-gradient-to-r from-yellow-200 via-yellow-420 to-red-400 bg-clip-text text-transparent">
      {pretty(stats.totalJobs)}
    </p>
    <p className="text-sm opacity-90">Jobs & Internships</p>
  </div>
  <div>
    <p className="text-4xl font-bold bg-gradient-to-r from-cyan-200 via-blue-100 to-white bg-clip-text text-transparent">
      {pretty(stats.totalCompanies)}
    </p>
    <p className="text-sm opacity-90">Companies</p>
  </div>
  <div>
    <p className="text-4xl font-bold bg-gradient-to-r from-pink-200 via-purple-100 to-white bg-clip-text text-transparent">
      {pretty(stats.totalSeekers)}
    </p>
    <p className="text-sm opacity-90">Active Seekers</p>
  </div>
</div>
        </div>
        
      </section>

      {/* CATEGORIES FROM DB */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold mb-8 text-center">Popular Job Categories</h2>
        {categories.length === 0 ? (
          <p className="text-center text-gray-500">No jobs posted yet.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((c) => (
              <Link
                key={c.name}
                to={`/jobs?category=${encodeURIComponent(c.name)}`}
                className="card card-hover text-center"
              >
                <div className="text-4xl mb-2">
                  {CATEGORY_ICONS[c.name] || '🧑‍💼'}
                </div>
                <p className="font-medium">{c.name}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {c.count} job{c.count > 1 ? 's' : ''}
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </>
  );
}