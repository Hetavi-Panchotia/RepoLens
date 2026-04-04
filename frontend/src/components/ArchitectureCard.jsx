import React from 'react';

export default function ArchitectureCard({ label, value, icon: Icon, colorClass }) {
  return (
    <div className="bg-slate-900 border border-white/5 p-5 rounded-2xl flex items-center gap-4 hover:-translate-y-1 transition-transform duration-300 shadow-sm hover:shadow-md">
      <div className={`p-3 rounded-xl bg-slate-950/50 ${colorClass}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-xs text-gray-500 mb-1">{label}</p>
        <p className="text-xl font-bold text-white tracking-tight">{value}</p>
      </div>
    </div>
  );
}
