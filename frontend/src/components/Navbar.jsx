import React from 'react';
import { Telescope } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 border-b border-white/5 bg-surface-900/80 backdrop-blur-xl">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center shadow-lg">
          <Telescope className="w-4 h-4 text-white" />
        </div>
        <span className="font-bold text-white text-lg tracking-tight">
          Repo<span className="text-brand-400">Lens</span>
        </span>
      </div>

      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-700/50 border border-white/5">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-xs text-gray-400 font-mono">v1.0 · MVP</span>
      </div>
    </nav>
  );
}
