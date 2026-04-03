import React from 'react';
import { formatDistanceToNow } from '../utils/time';

export default function ChatBubble({ message }) {
  const isUser = message.role === 'user';

  // Parse basic markdown-like bold
  function renderText(text) {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-semibold text-white">{part.slice(2, -2)}</strong>;
      }
      return <span key={i}>{part}</span>;
    });
  }

  return (
    <div className={`flex items-end gap-2.5 ${isUser ? 'flex-row-reverse animate-slide-in-right' : 'flex-row animate-slide-in-left'}`}>
      {/* Avatar */}
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center flex-shrink-0 text-white text-xs font-bold shadow-lg shadow-brand-500/30">
          AI
        </div>
      )}
      {isUser && (
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-surface-600 to-surface-700 flex items-center justify-center flex-shrink-0 text-gray-300 text-xs font-bold border border-white/10">
          U
        </div>
      )}

      {/* Bubble */}
      <div className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
        isUser
          ? 'bg-gradient-to-br from-brand-500 to-brand-600 text-white rounded-br-sm shadow-lg shadow-brand-500/20'
          : 'glass text-gray-200 rounded-bl-sm'
      }`}>
        {message.text.split('\n').map((line, i) => (
          <p key={i} className={i > 0 ? 'mt-1.5' : ''}>{renderText(line)}</p>
        ))}

        {/* Timestamp */}
        <p className={`text-xs mt-2 ${isUser ? 'text-brand-200/60' : 'text-gray-600'}`}>
          {formatDistanceToNow(message.timestamp)}
        </p>
      </div>
    </div>
  );
}
