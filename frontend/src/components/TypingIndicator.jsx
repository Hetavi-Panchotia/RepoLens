import React from 'react';
import { Bot } from 'lucide-react';

export default function TypingIndicator() {
  return (
    <div className="flex items-start gap-4 animate-fade-in">
      {/* Avatar */}
      <div className="w-10 h-10 rounded-2xl bg-premium-gradient border border-brand-400/30 flex items-center justify-center flex-shrink-0 text-white shadow-lg shadow-brand-500/20">
        <Bot className="w-5 h-5" />
      </div>

      {/* Bubble */}
      <div className="relative bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-[2rem] rounded-tl-none px-6 py-4 flex items-center gap-2">
        <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-brand-500/50 shadow-[2px_0_10px_rgba(139,92,246,0.2)]" />
        
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-brand-400/80 shadow-[0_0_8px_rgba(167,139,250,0.4)] animate-pulse"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
        <span className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] ml-2">Processing Context</span>
      </div>
    </div>
  );
}
