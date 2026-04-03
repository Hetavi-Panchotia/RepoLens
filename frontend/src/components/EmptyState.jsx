import React from 'react';
import { Search } from 'lucide-react';

export default function EmptyState({ title = 'No results', message = 'Try adjusting your search.' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
      <div className="w-16 h-16 rounded-2xl bg-surface-700/60 border border-white/5 flex items-center justify-center mb-5">
        <Search className="w-7 h-7 text-gray-600" />
      </div>
      <h3 className="text-base font-semibold text-gray-300 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 max-w-xs leading-relaxed">{message}</p>
    </div>
  );
}
