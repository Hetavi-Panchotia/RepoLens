import React from 'react';
import { Search, X } from 'lucide-react';

export default function SearchBar({ value, onChange, placeholder = 'Search folders…', count }) {
  return (
    <div className="relative w-full max-w-md">
      {/* Search Icon */}
      <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none">
        <Search className="w-4 h-4 text-gray-500" />
      </div>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-2.5 rounded-xl text-sm
          bg-surface-700/60 border border-white/8 text-gray-100 placeholder-gray-600
          focus:outline-none focus:border-brand-500/60 focus:bg-surface-700/80
          transition-all duration-200 input-glow backdrop-blur-xl"
      />

      {/* Clear Button */}
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-300 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      {/* Live count */}
      {count !== undefined && value && (
        <span className="absolute -bottom-5 left-1 text-xs text-gray-500">
          {count} result{count !== 1 ? 's' : ''} found
        </span>
      )}
    </div>
  );
}
