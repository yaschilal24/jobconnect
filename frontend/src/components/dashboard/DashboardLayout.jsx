


import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function DashboardLayout({ title, items = [], children }) {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const roleLabel = {
    JOB_SEEKER: 'Job Seeker',
    COMPANY: 'Company',
    ADMIN: 'Admin',
  }[user?.role] || user?.role;

  const Sidebar = () => (
    <aside className="flex flex-col h-full">
      {/* User block */}
      <div className="px-6 pt-6 pb-4 border-b border-gray-100">
        <p className="text-[11px] uppercase tracking-wider text-gray-400">Signed in as</p>
        <p className="font-semibold text-gray-900 mt-1 truncate">
          {user?.firstName} {user?.lastName}
        </p>
        <span className="badge bg-primary/10 text-primary mt-2">{roleLabel}</span>
      </div>

      {/* Menu */}
      <nav className="flex-1 overflow-y-auto py-4 space-y-1">
        {items.map((it) => (
          <NavLink
            key={it.to}
            to={it.to}
            end={it.end}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            <span className="text-lg shrink-0">{it.icon}</span>
            <span className="truncate">{it.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-100">
        <button
          onClick={() => { logout(); nav('/'); }}
          className="btn-outline w-full text-sm"
        >
          Logout
        </button>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ---------- MOBILE TOP BAR ---------- */}
      <div className="md:hidden sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-lg hover:bg-gray-100"
          aria-label="Open menu"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <p className="font-bold text-lg text-primary">JobConnect</p>
        <div className="w-9" /> {/* spacer */}
      </div>

      {/* ---------- MOBILE SIDEBAR (half screen) ---------- */}
      {mobileOpen && (
        <>
          {/* Backdrop */}
          <div
            className="md:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setMobileOpen(false)}
          />
          {/* Drawer: 75vw wide, full height */}
          <div className="md:hidden fixed top-0 left-0 h-full w-[75vw] max-w-[320px] bg-white z-50 shadow-2xl ">
            <Sidebar />
          </div>
        </>
      )}

      {/* ---------- DESKTOP LAYOUT ---------- */}
      <div className="hidden md:grid max-w-7xl mx-auto grid-cols-[260px_1fr] gap-6 p-8">
        <div className="sticky top-8 h-[calc(100vh-4rem)] card p-0 overflow-hidden">
          <Sidebar />
        </div>
        <main className="min-w-0">
          <h1 className="text-2xl md:text-3xl font-bold mb-6">{title}</h1>
          {children ? children : <Outlet />}
        </main>
      </div>

      {/* ---------- MOBILE MAIN CONTENT ---------- */}
      <div className="md:hidden px-4 py-5">
        <h1 className="text-2xl font-bold mb-4">{title}</h1>
        {children ? children : <Outlet />}
      </div>
    </div>
  );
}