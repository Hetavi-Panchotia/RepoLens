import React from 'react';
import { GitBranch } from 'lucide-react';

export default function RepoInput({ value, onChange, onKeyDown, error }) {
  return (
    <div className="relative w-full">
      {/* Github icon inside input */}
      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
        <GitBranch className="w-5 h-5 text-gray-500" />
      </div>

      <input
        id="repo-url-input"
        type="url"
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder="https://github.com/owner/repository"
        autoComplete="off"
        spellCheck="false"
        className={`
          w-full pl-12 pr-5 py-4 rounded-xl text-sm font-mono
          bg-surface-700/80 border text-gray-100 placeholder-gray-600
          focus:outline-none transition-all duration-200 input-glow
          ${error
            ? 'border-red-500/60 focus:border-red-400'
            : 'border-white/8 focus:border-brand-500/60'
          }
        `}
      />

      {error && (
        <p className="absolute -bottom-6 left-1 text-xs text-red-400 mt-1">
          {error}
        </p>
      )}
    </div>
  );
}
