import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import { jobApi } from '../../api/job.api';

const VALUES = [
  { icon: '🎯', title: 'Transparency', text: 'Honest listings, clear timelines, real companies.' },
  { icon: '⚡', title: 'Speed',        text: 'Apply in seconds, hear back fast, move forward.' },
  { icon: '🤝', title: 'Trust',        text: 'Verified companies, quality candidates.' },
  { icon: '🌍', title: 'Accessibility',text: 'Built for every candidate, everywhere.' },
];

export default function About() {
  // ✅ Hooks INSIDE the component
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalCompanies: 0,
    totalSeekers: 0,
  });

  useEffect(() => {
    jobApi.publicStats()
      .then(({ data }) => setStats(data.stats))
      .catch(() => {});
  }, []);

  const statItems = [
    { value: stats.totalJobs,      label: 'Jobs & Internships' },
    { value: stats.totalCompanies, label: 'Companies' },
    { value: stats.totalSeekers,   label: 'Active Seekers' },
  ];

  return (
    <>
      <Navbar />

      {/* HERO */}
      <section className="relative text-white overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/hero.jpg')" }}  /* ✅ correct path */
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-second" />
        <div className="relative max-w-4xl mx-auto px-4 py-24 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About JobConnect</h1>
          <p className="text-lg opacity-95 max-w-2xl mx-auto">
            Connecting job seekers, internship seekers, companies, and administrators
            in one modern platform — from discovery to hire.
          </p>
        </div>
      </section>

      {/* MISSION */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
        <p className="text-gray-700 leading-relaxed">
          To simplify the job search and recruitment process, empowering candidates
          and companies to find the right fit faster. We believe every candidate
          deserves a fair shot and every company deserves great people — without
          the friction of traditional job boards.
        </p>
      </section>

      {/* STATS — real data from DB */}
      <section className="bg-gray-50 border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-14 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {statItems.map((s) => (
            <div key={s.label}>
              <p className="text-3xl md:text-4xl font-bold text-primary">{s.value}</p>
              <p className="text-sm text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* VALUES */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-10">What We Value</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {VALUES.map((v) => (
            <div key={v.title} className="card card-hover flex gap-4">
              <div className="w-12 h-12 shrink-0 rounded-xl bg-primary/10 grid place-items-center text-2xl">
                {v.icon}
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">{v.title}</h3>
                <p className="text-sm text-gray-600">{v.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <h2 className="text-3xl font-bold text-center mb-10">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { n: '1', t: 'Create Your Profile', d: 'Sign up, add your education, skills, and resume in minutes.' },
            { n: '2', t: 'Find Opportunities',  d: 'Search by keyword, location, type, or category. Save what you like.' },
            { n: '3', t: 'Apply & Track',       d: 'One-click apply, then follow every status change in real time.' },
          ].map((s) => (
            <div key={s.n} className="card text-center">
              <div className="w-12 h-12 mx-auto rounded-full bg-primary text-white grid place-items-center font-bold text-lg mb-3">
                {s.n}
              </div>
              <h3 className="font-bold mb-1">{s.t}</h3>
              <p className="text-sm text-gray-600">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-primary to-secondary text-white">
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h2 className="text-3xl font-bold mb-3">Ready to find your next opportunity?</h2>
          <p className="opacity-95 mb-6">Join thousands of candidates and companies already on JobConnect.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/register" className="btn bg-white text-primary hover:bg-gray-100">
              Get Started — It's Free
            </Link>
            <Link to="/jobs" className="btn border border-white text-white hover:bg-white/10">
              Browse Jobs
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}