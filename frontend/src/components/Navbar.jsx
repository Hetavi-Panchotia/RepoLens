import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Telescope, Home, LayoutDashboard, MessageSquare, Zap } from 'lucide-react';

const NAV_LINKS = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/chat', label: 'Chat', icon: MessageSquare },
];

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 px-4 py-4 pointer-events-none"
    >
      <div className="max-w-5xl mx-auto flex items-center justify-between px-6 py-3 bg-slate-900/60 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-2xl pointer-events-auto group/nav hover:border-brand-500/30 transition-all duration-500">
        
        {/* Logo */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2.5 group/logo"
        >
          <div className="w-9 h-9 rounded-xl bg-premium-gradient flex items-center justify-center shadow-lg shadow-brand-500/20 group-hover/logo:scale-110 transition-transform duration-300">
            <Telescope className="w-5 h-5 text-white" />
          </div>
          <span className="font-extrabold text-white text-xl tracking-tight">
            Repo<span className="text-brand-400 drop-shadow-[0_0_8px_rgba(139,92,246,0.3)]">Lens</span>
          </span>
        </button>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1 p-1 bg-white/5 rounded-xl border border-white/5">
          {NAV_LINKS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `relative flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all duration-300 ${
                  isActive ? 'text-white bg-white/10 shadow-inner' : 'text-gray-500 hover:text-gray-300'
                }`
              }
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </NavLink>
          ))}
        </div>

        {/* Global Status */}
        <div className="flex items-center gap-3">
           <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest font-mono">System Ready</span>
           </div>
           
           <div className="p-2 rounded-lg bg-brand-500/10 text-brand-400 border border-brand-500/20 hover:bg-brand-500 hover:text-white transition-all cursor-help" title="Premium Access Active">
              <Zap className="w-4 h-4 fill-current" />
           </div>
        </div>
      </div>

      {/* Mobile Nav Overlay (Optional/Simplified) */}
      <div className="md:hidden mt-2 flex justify-center">
         <div className="flex items-center gap-4 bg-slate-900/80 backdrop-blur-xl px-4 py-2 rounded-2xl border border-white/10 shadow-xl pointer-events-auto">
            {NAV_LINKS.map(({ to, icon: Icon }) => (
              <NavLink 
                key={to} 
                to={to}
                className={({ isActive }) => `p-2 rounded-lg transition-colors ${isActive ? 'text-brand-400 bg-brand-500/10' : 'text-gray-500'}`}
              >
                <Icon className="w-5 h-5" />
              </NavLink>
            ))}
         </div>
      </div>
    </motion.nav>
  );
}
