import React from 'react';
import { Github, Loader2, ArrowRight } from 'lucide-react';

export default function RepoInput({ value, onChange, onKeyDown, error, loading, onSubmit, className = '' }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!value.trim() || loading) return;
    onSubmit();
  };

  return (
    <div className={`w-full transition-all duration-300 ${className}`}>
      <form onSubmit={handleSubmit} className="relative group animate-slide-up">
        {/* Border Glow Gradient */}
        <div className="absolute -inset-1 bg-gradient-to-r from-brand-600 via-pink-400 to-sky-500 rounded-3xl blur-xl opacity-20 group-hover:opacity-40 group-focus-within:opacity-50 transition duration-1000 group-hover:duration-300" />
        
        <div className="relative flex items-center bg-slate-900/60 border border-white/10 rounded-2xl p-2.5 shadow-2xl backdrop-blur-2xl transition-all duration-500 group-hover:border-brand-500/30">
          
          {/* GitHub Icon Indicator */}
          <div className="pl-5 pr-3 text-gray-500 border-r border-white/5 mr-2">
            <Github className="w-5 h-5 group-hover:text-brand-400 transition-colors" />
          </div>

          <input
            type="url"
            value={value}
            onChange={onChange}
            onKeyDown={onKeyDown}
            placeholder="Paste GitHub repository URL..."
            className="flex-1 bg-transparent border-none text-white focus:ring-0 text-base px-2 placeholder-gray-600 font-medium selection:bg-brand-500/30"
            disabled={loading}
            autoComplete="off"
            spellCheck="false"
          />

          <button
            type="submit"
            disabled={loading || !value.trim()}
            className="relative inline-flex h-12 overflow-hidden rounded-xl p-[1px] focus:outline-none hover:scale-[1.05] active:scale-[0.95] transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed group/btn ml-2"
          >
            <span className="absolute inset-[-1000%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#8b5cf6_0%,#ec4899_50%,#8b5cf6_100%)] opacity-80 group-hover/btn:opacity-100 transition-opacity" />
            <span className="inline-flex h-full w-full items-center justify-center rounded-xl bg-slate-950 px-8 py-2 text-sm font-black text-white uppercase tracking-widest backdrop-blur-3xl gap-2 transition-all hover:bg-slate-900 group-hover/btn:shadow-[0_0_25px_rgba(139,92,246,0.4)]">
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-brand-400" />
                  <span className="hidden sm:inline">Analyzing...</span>
                </>
              ) : (
                <>
                  <span className="hidden sm:inline">Analyze</span>
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </>
              )}
            </span>
          </button>
        </div>
      </form>

      {error && (
        <motion.p 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-400 text-[11px] font-black uppercase tracking-widest mt-4 text-center px-4 py-2 bg-red-400/5 rounded-lg border border-red-400/10"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}
