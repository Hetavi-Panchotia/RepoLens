import React from 'react';
import SpotlightCard from './SpotlightCard';

export default function ArchitectureCard({ label, value, icon: Icon, colorClass }) {
  return (
    <SpotlightCard className="p-5 flex items-center gap-4 group">
      <div className={`p-3 rounded-xl bg-slate-950/50 group-hover:scale-110 transition-transform duration-300 ${colorClass}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-xs text-gray-400 mb-1">{label}</p>
        <p className="text-xl font-bold text-white tracking-tight">{value}</p>
      </div>
    </SpotlightCard>
  );
}
