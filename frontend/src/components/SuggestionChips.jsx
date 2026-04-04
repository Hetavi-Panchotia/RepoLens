import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, Terminal, FileSearch, HelpCircle } from 'lucide-react';

const SUGGESTIONS = [
  { id: 'logic', text: 'Where is the main logic?', icon: Terminal },
  { id: 'start', text: 'Where should I start?', icon: Lightbulb },
  { id: 'structure', text: 'Explain folder structure', icon: FileSearch },
  { id: 'tech', text: 'What tech stack is used?', icon: HelpCircle }
];

export default function SuggestionChips({ onSelect, disabled }) {
  return (
    <div className="flex flex-wrap gap-2 py-2">
      {SUGGESTIONS.map((s, i) => (
        <motion.button
          key={s.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          whileHover={{ scale: 1.05, borderColor: 'rgba(139, 92, 246, 0.5)' }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelect(s.text)}
          disabled={disabled}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full glass border border-white/10 text-[11px] font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all disabled:opacity-40 disabled:cursor-not-allowed group"
        >
          <s.icon className="w-3 h-3 group-hover:text-brand-400 transition-colors" />
          {s.text}
        </motion.button>
      ))}
    </div>
  );
}
