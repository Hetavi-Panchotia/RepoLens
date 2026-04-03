import React from 'react';
import { Telescope } from 'lucide-react';

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-surface-900 page-enter">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-brand-600/10 blur-[120px] pointer-events-none" />

      {/* Logo + spinner */}
      <div className="relative z-10 flex flex-col items-center gap-6 mb-12">
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center shadow-2xl shadow-brand-500/40">
            <Telescope className="w-8 h-8 text-white animate-float" />
          </div>
          {/* Spinning ring */}
          <div className="absolute -inset-2 rounded-3xl border-2 border-brand-500/30 border-t-brand-400 animate-spin" />
        </div>

        <div className="text-center">
          <p className="text-white font-bold text-lg tracking-tight">
            Repo<span className="text-brand-400">Lens</span>
          </p>
          <p className="text-gray-500 text-sm mt-1 animate-pulse">Analyzing repository structure…</p>
        </div>
      </div>

      {/* Skeleton Cards */}
      <div className="relative z-10 w-full max-w-3xl px-6 space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="glass rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl skeleton rounded-xl" />
              <div className="flex-1 space-y-2">
                <div className="h-3 skeleton rounded-md w-32" />
                <div className="h-2.5 skeleton rounded-md w-20" />
              </div>
              <div className="h-5 w-16 skeleton rounded-md" />
            </div>
            <div className="space-y-2">
              <div className="h-2.5 skeleton rounded-md w-full" />
              <div className="h-2.5 skeleton rounded-md w-4/5" />
            </div>
            <div className="flex gap-2 mt-3">
              <div className="h-5 w-16 skeleton rounded-md" />
              <div className="h-5 w-20 skeleton rounded-md" />
              <div className="h-5 w-14 skeleton rounded-md" />
            </div>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="relative z-10 mt-8 w-full max-w-xs">
        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
          <div className="h-full rounded-full bg-gradient-to-r from-brand-600 to-brand-400"
            style={{ animation: 'progressFill 1.5s ease-out forwards' }}
          />
        </div>
        <style>{`
          @keyframes progressFill {
            from { width: 0%; }
            to   { width: 100%; }
          }
        `}</style>
      </div>
    </div>
  );
}
