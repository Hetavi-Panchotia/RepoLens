import React from 'react';

export default function TypingIndicator() {
  return (
    <div className="flex items-end gap-3 animate-slide-in-left">
      {/* Avatar */}
      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center flex-shrink-0 text-white text-xs font-bold shadow-lg shadow-brand-500/30">
        AI
      </div>

      {/* Bubble */}
      <div className="glass rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-2 h-2 rounded-full bg-brand-400 animate-bounce-dot"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
      <span className="text-xs text-gray-600 mb-1 ml-1">AI is typing…</span>
    </div>
  );
}
