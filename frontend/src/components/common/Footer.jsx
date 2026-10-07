import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div className="col-span-2 md:col-span-1">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-white">
            <span className="w-8 h-8 rounded-lg bg-primary grid place-items-center">J</span>
            JobConnect
          </Link>
          <p className="text-sm mt-3 text-gray-400">
            Connecting talent with opportunity.
          </p>
        </div>

        {/* Candidates */}
        <div>
          <h5 className="text-white font-semibold mb-3">Candidates</h5>
          <ul className="space-y-2 text-sm">
            <li><Link to="/jobs" className="hover:text-white">Browse Jobs</Link></li>
            <li><Link to="/jobs?type=INTERNSHIP" className="hover:text-white">Internships</Link></li>
            <li><Link to="/seeker/saved" className="hover:text-white">Saved Jobs</Link></li>
            <li><Link to="/register" className="hover:text-white">Create Account</Link></li>
          </ul>
        </div>

        {/* Companies */}
        <div>
          <h5 className="text-white font-semibold mb-3">Companies</h5>
          <ul className="space-y-2 text-sm">
            <li><Link to="/recruiter/post-job" className="hover:text-white">Post a Job</Link></li>
            <li><Link to="/recruiter/jobs" className="hover:text-white">Manage Jobs</Link></li>
            <li><Link to="/recruiter/company" className="hover:text-white">Company Profile</Link></li>
            <li><Link to="/register" className="hover:text-white">Become a Partner</Link></li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <h5 className="text-white font-semibold mb-3">Company</h5>
          <ul className="space-y-2 text-sm">
            <li><Link to="/about" className="hover:text-white">About</Link></li>
            <li><Link to="/jobs" className="hover:text-white">Jobs</Link></li>
            <li><Link to="/companies" className="hover:text-white">Companies</Link></li>
            <li><Link to="/login" className="hover:text-white">Sign In</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-800 py-4">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500">
          <p>© {new Date().getFullYear()} JobConnect. All rights reserved.</p>
          <div className="flex gap-4 mt-2 md:mt-0">
            <Link to="/about" className="hover:text-white">Privacy</Link>
            <Link to="/about" className="hover:text-white">Terms</Link>
            <Link to="/about" className="hover:text-white">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}