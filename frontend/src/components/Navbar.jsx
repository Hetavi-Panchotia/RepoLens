import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Telescope, Home, LayoutDashboard, MessageSquare } from 'lucide-react';

const NAV_LINKS = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/chat', label: 'Chat', icon: MessageSquare },
];

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const isDashboard = location.pathname === '/dashboard';

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-white/5">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">

        {/* ── Logo ── */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2.5 group"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/30 group-hover:scale-110 transition-transform duration-200">
            <Telescope className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-white text-lg tracking-tight">
            Repo<span className="text-brand-400">Lens</span>
          </span>
        </button>

        {/* ── Nav Links ── */}
        <div className="hidden sm:flex items-center gap-6">
          {NAV_LINKS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `nav-link flex items-center gap-1.5 ${isActive ? 'active' : ''}`
              }
            >
              <Icon className="w-3.5 h-3.5 opacity-70" />
              {label}
            </NavLink>
          ))}
        </div>

        {/* ── Status Badge ── */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-700/50 border border-white/5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-gray-400 font-mono hidden sm:inline">v1.0 · Live</span>
        </div>
      </div>

      {/* ── Mobile Nav ── */}
      <div className="sm:hidden flex items-center justify-around px-4 py-2 border-t border-white/5">
        {NAV_LINKS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg text-xs transition-colors duration-200 ${isActive ? 'text-brand-400 bg-brand-500/10' : 'text-gray-500 hover:text-gray-300'
              }`
            }
          >
            <Icon className="w-4 h-4" />
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
