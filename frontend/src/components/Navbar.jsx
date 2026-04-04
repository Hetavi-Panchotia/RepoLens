import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Telescope, Home, LayoutDashboard, MessageSquare, Zap, GitBranch } from 'lucide-react';
import { useRepo } from '../context/RepoContext';

const NAV_LINKS = [
  { to: '/', label: 'Home', icon: Home, requiresRepo: false },
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, requiresRepo: true },
  { to: '/chat', label: 'Chat', icon: MessageSquare, requiresRepo: true },
];

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { analysis, repoInfo } = useRepo();

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4 pointer-events-none"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-8 py-3.5 bg-slate-900/60 backdrop-blur-2xl rounded-[2.5rem] border border-white/10 shadow-2xl pointer-events-auto group/nav hover:border-brand-500/20 transition-all duration-500">
        
        {/* Logo and Current Repo */}
        <div className="flex items-center gap-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-3 group/logo"
          >
            <div className="w-11 h-11 rounded-2xl bg-premium-gradient flex items-center justify-center shadow-lg shadow-brand-500/20 group-hover/logo:scale-110 transition-transform duration-300">
              <Telescope className="w-6 h-6 text-white" />
            </div>
            <span className="font-black text-white text-2xl tracking-tighter hidden sm:inline">
              Repo<span className="text-brand-400 drop-shadow-[0_0_10px_rgba(139,92,246,0.3)]">Lens</span>
            </span>
          </button>

          {repoInfo && (
            <div className="hidden xl:flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/5 rounded-2xl animate-fade-in group-hover/nav:border-brand-500/10 transition-colors">
              <GitBranch className="w-4 h-4 text-gray-500" />
              <span className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] truncate max-w-[180px]">
                {repoInfo.repo}
              </span>
            </div>
          )}
        </div>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-2 p-1.5 bg-white/[0.03] rounded-2xl border border-white/5">
          {NAV_LINKS.map(({ to, label, icon: Icon, requiresRepo }) => {
            const isDisabled = requiresRepo && !analysis;
            return (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                onClick={(e) => {
                  if (isDisabled) {
                    e.preventDefault();
                    return;
                  }
                }}
                className={({ isActive }) =>
                  `relative flex items-center gap-3 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${
                    isDisabled 
                      ? 'opacity-20 cursor-not-allowed text-gray-500 grayscale' 
                      : isActive 
                        ? 'text-white bg-white/10 shadow-[inset_0_0_10px_rgba(255,255,255,0.05)] border border-white/10' 
                        : 'text-gray-500 hover:text-gray-200 hover:bg-white/5'
                  }`
                }
                title={isDisabled ? "Select a repository to unlock this tab" : ""}
              >
                <Icon className={`w-4 h-4 ${isDisabled ? 'text-gray-700' : ''}`} />
                {label}
                {isDisabled && (
                   <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-slate-700 border border-slate-900 shadow-sm" />
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Global Status */}
        <div className="flex items-center gap-6">
           <div className="hidden lg:flex items-center gap-3 px-4 py-2 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.4)]" />
              <span className="text-[10px] text-emerald-400 font-black uppercase tracking-[0.2em]">Engine Active</span>
           </div>
           
           <div className="p-2.5 rounded-xl bg-brand-500/10 text-brand-400 border border-brand-500/20 hover:bg-brand-500 hover:text-white transition-all cursor-help shadow-inner" title="Premium Access Active">
              <Zap className="w-5 h-5 fill-current" />
           </div>
        </div>
      </div>

      {/* Mobile Nav Overlay */}
      <div className="lg:hidden mt-4 flex justify-center shadow-2xl">
         <div className="flex items-center gap-6 bg-slate-900/90 backdrop-blur-3xl px-8 py-3 rounded-[2rem] border border-white/10 shadow-3xl pointer-events-auto ring-1 ring-white/5">
            {NAV_LINKS.map(({ to, icon: Icon, requiresRepo }) => {
              const isDisabled = requiresRepo && !analysis;
              return (
                <NavLink 
                  key={to} 
                  to={to}
                  onClick={(e) => {
                    if (isDisabled) {
                      e.preventDefault();
                      return;
                    }
                  }}
                  className={({ isActive }) => 
                    `p-3 rounded-2xl transition-all duration-300 ${
                      isDisabled 
                        ? 'opacity-10 cursor-not-allowed text-gray-700' 
                        : isActive 
                          ? 'text-brand-400 bg-brand-500/10 shadow-[inset_0_0_10px_rgba(139,92,246,0.1)]' 
                          : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                    }`
                  }
                >
                  <Icon className="w-6 h-6" />
                </NavLink>
              );
            })}
         </div>
      </div>
    </motion.nav>
  );
}
