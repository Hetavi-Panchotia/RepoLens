import React from 'react';
import { GitBranch, Search, Loader2, ArrowRight } from 'lucide-react';

export default function RepoInput({ value, onChange, onKeyDown, error, loading, onSubmit, className = '' }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div className={`w-full max-w-2xl mx-auto transition-all ${className}`}>
      <form onSubmit={handleSubmit} className="relative group animate-slide-up">
        <div className="absolute -inset-1 bg-gradient-to-r from-brand-600 via-brand-400 to-brand-600 rounded-2xl blur-lg opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
        <div className="relative flex items-center bg-slate-900 border border-white/10 rounded-2xl p-2 shadow-sm backdrop-blur-xl transition-all group-hover:border-white/20">
          
          <div className="pl-4 pr-2 text-gray-500">
            <GitBranch className="w-5 h-5 group-hover:text-brand-400 transition-colors" />
          </div>

          <input
            type="url"
            value={value}
            onChange={onChange}
            onKeyDown={onKeyDown}
            placeholder="https://github.com/owner/repository"
            className="flex-1 bg-transparent border-none text-white focus:ring-0 text-sm sm:text-base px-2 placeholder-gray-500 font-medium"
            disabled={loading}
            autoComplete="off"
            spellCheck="false"
          />

          <button
            type="submit"
            disabled={loading || !value.trim()}
            className="flex items-center gap-2 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-all shadow-lg hover:shadow-brand-500/25 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <ArrowRight className="w-4 h-4" />
                <span className="hidden sm:inline tracking-wide">Analyze</span>
              </>
            )}
          </button>
        </div>
      </form>
      {error && (
        <p className="text-red-400 text-sm mt-3 text-center animate-fade-in font-medium px-4 py-2 bg-red-400/10 rounded-lg inline-block w-full">
          {error}
        </p>
      )}
    </div>
  );
}
