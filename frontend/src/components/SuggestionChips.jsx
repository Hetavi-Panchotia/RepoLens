import React from 'react';
import { motion } from 'framer-motion';
import { Globe, Zap, Code2, Layers } from 'lucide-react';

const SUGGESTIONS = [
  { id: 'nextjs', text: 'vercel/next.js', icon: Zap },
  { id: 'vite', text: 'vitejs/vite', icon: Code2 },
  { id: 'tailwind', text: 'tailwindlabs/tailwindcss', icon: Layers },
  { id: 'shadcn', text: 'shadcn-ui/ui', icon: Globe }
];

export default function SuggestionChips({ onSelect, disabled }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mr-2">Try Analysis:</span>
      {SUGGESTIONS.map((s, i) => (
        <motion.button
          key={s.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 + i * 0.1 }}
          whileHover={{ 
            scale: 1.05,
            backgroundColor: 'rgba(139, 92, 246, 0.1)',
            borderColor: 'rgba(139, 92, 246, 0.4)'
          }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelect(`https://github.com/${s.text}`)}
          disabled={disabled}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/50 border border-white/5 text-[11px] font-bold text-gray-400 hover:text-brand-400 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed group shadow-sm backdrop-blur-sm"
        >
          <s.icon className="w-3 h-3 group-hover:text-brand-400 transition-colors" />
          {s.text}
        </motion.button>
      ))}
    </div>
  );
}
