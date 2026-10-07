import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();

  const dash = user?.role === 'JOB_SEEKER' ? '/seeker'
    : user?.role === 'COMPANY' ? '/recruiter'
    : user?.role === 'ADMIN' ? '/admin' : '/';

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl text-primary">
          <span className="w-8 h-8 rounded-lg bg-primary text-white grid place-items-center">J</span>
          JobConnect
        </Link>
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-700">
          <NavLink to="/" className={({isActive}) => isActive ? 'text-primary' : 'hover:text-primary'}>Home</NavLink>
          <NavLink to="/jobs" className={({isActive}) => isActive ? 'text-primary' : 'hover:text-primary'}>Jobs</NavLink>
          <NavLink to="/companies" className={({isActive}) => isActive ? 'text-primary' : 'hover:text-primary'}>Companies</NavLink>
          <NavLink to="/about" className={({isActive}) => isActive ? 'text-primary' : 'hover:text-primary'}>About</NavLink>
        </div>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link to={dash} className="btn-outline text-sm">Dashboard</Link>
              <button onClick={() => { logout(); nav('/'); }} className="btn-primary text-sm">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-outline text-sm">Login</Link>
              <Link to="/register" className="btn-primary text-sm">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}