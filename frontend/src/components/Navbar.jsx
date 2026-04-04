import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Telescope, Home, LayoutDashboard, MessageSquare, Zap, ChevronRight } from 'lucide-react';
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
      className="fixed top-0 left-0 right-0 z-50 px-4 py-4 pointer-events-none"
    >
      <div className="max-w-5xl mx-auto flex items-center justify-between px-6 py-3 bg-slate-900/60 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-2xl pointer-events-auto group/nav hover:border-brand-500/30 transition-all duration-500">
        
        {/* Logo and Current Repo */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2.5 group/logo"
          >
            <div className="w-9 h-9 rounded-xl bg-premium-gradient flex items-center justify-center shadow-lg shadow-brand-500/20 group-hover/logo:scale-110 transition-transform duration-300">
              <Telescope className="w-5 h-5 text-white" />
            </div>
            <span className="font-extrabold text-white text-xl tracking-tight hidden sm:inline">
              Repo<span className="text-brand-400 drop-shadow-[0_0_8px_rgba(139,92,246,0.3)]">Lens</span>
            </span>
          </button>

          {repoInfo && (
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl animate-fade-in">
              <ChevronRight className="w-3 h-3 text-gray-600" />
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest truncate max-w-[120px]">
                {repoInfo.repo}
              </span>
            </div>
          )}
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1 p-1 bg-white/5 rounded-xl border border-white/5">
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
                  `relative flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 ${
                    isDisabled 
                      ? 'opacity-25 cursor-not-allowed text-gray-500 grayscale' 
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
                   <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-slate-700 border border-slate-900" />
                )}
              </NavLink>
            );
          })}
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

      {/* Mobile Nav Overlay */}
      <div className="md:hidden mt-2 flex justify-center">
         <div className="flex items-center gap-4 bg-slate-900/80 backdrop-blur-xl px-4 py-2 rounded-2xl border border-white/10 shadow-xl pointer-events-auto">
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
                    `p-2 rounded-lg transition-all ${
                      isDisabled 
                        ? 'opacity-20 cursor-not-allowed text-gray-700' 
                        : isActive 
                          ? 'text-brand-400 bg-brand-500/10' 
                          : 'text-gray-500 hover:text-gray-300'
                    }`
                  }
                >
                  <Icon className="w-5 h-5" />
                </NavLink>
              );
            })}
         </div>
      </div>
    </motion.nav>
  );
}
