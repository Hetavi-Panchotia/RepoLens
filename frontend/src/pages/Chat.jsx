import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, ArrowLeft, LayoutDashboard } from 'lucide-react';
import { seedMessages, mockReplies } from '../data/mockData';
import ChatBubble from '../components/ChatBubble';
import TypingIndicator from '../components/TypingIndicator';

function getRandomReply() {
  return mockReplies[Math.floor(Math.random() * mockReplies.length)];
}

export default function Chat() {
  const [messages, setMessages] = useState(() =>
    seedMessages.map((m) => ({ ...m, timestamp: new Date(m.timestamp) }))
  );
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Auto-scroll on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  async function handleSend() {
    const text = input.trim();
    if (!text || isTyping) return;

    const userMsg = { id: Date.now(), role: 'user', text, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate AI thinking delay (1.0 – 2.0 seconds)
    const delay = 1000 + Math.random() * 1000;
    setTimeout(() => {
      const aiMsg = {
        id: Date.now() + 1,
        role: 'assistant',
        text: getRandomReply(),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, delay);
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="relative flex flex-col min-h-screen pt-16 sm:pt-20 page-enter">
      {/* Background */}
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-100 pointer-events-none" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-brand-600/8 blur-[120px] pointer-events-none" />

      {/* ── Chat Header ── */}
      <div className="relative z-10 glass border-b border-white/5 px-4 sm:px-6 py-3.5 flex items-center gap-4">
        <button
          onClick={() => navigate('/dashboard')}
          className="text-gray-500 hover:text-gray-200 transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
        </button>

        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center text-white text-xs font-bold shadow-md shadow-brand-500/30 flex-shrink-0">
            AI
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">RepoLens Assistant</p>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-gray-500">
                {isTyping ? 'Typing…' : 'vercel/next.js · Ready'}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => navigate('/dashboard')}
          className="hidden sm:flex items-center gap-1.5 text-xs text-gray-500 hover:text-brand-400 transition-colors"
        >
          <LayoutDashboard className="w-3.5 h-3.5" />
          Dashboard
        </button>
      </div>

      {/* ── Messages ── */}
      <div className="relative z-10 flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-5 max-w-3xl w-full mx-auto">
        {messages.map((msg) => (
          <ChatBubble key={msg.id} message={msg} />
        ))}

        {isTyping && <TypingIndicator />}

        <div ref={bottomRef} />
      </div>

      {/* ── Input Bar ── */}
      <div className="relative z-10 glass border-t border-white/5 px-4 sm:px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-end gap-3">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything about vercel/next.js…"
              rows={1}
              className="w-full px-4 py-3 rounded-xl text-sm
                bg-surface-700/80 border border-white/8 text-gray-100 placeholder-gray-600
                focus:outline-none focus:border-brand-500/60 input-glow
                transition-all duration-200 resize-none max-h-36 overflow-y-auto"
              style={{ lineHeight: '1.5' }}
            />
            <p className="absolute bottom-2 right-3 text-xs text-gray-600 pointer-events-none">
              ⏎ Send
            </p>
          </div>

          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="
              w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0
              bg-gradient-to-br from-brand-500 to-brand-600 text-white
              hover:from-brand-400 hover:to-brand-500 hover:scale-105
              active:scale-95 transition-all duration-200
              disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100
              shadow-lg shadow-brand-500/30
            "
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

        {/* Suggestions */}
        <div className="max-w-3xl mx-auto mt-3 flex flex-wrap gap-2">
          {['What does /server do?', 'How are tests structured?', 'Explain the App Router'].map((q) => (
            <button
              key={q}
              onClick={() => { setInput(q); inputRef.current?.focus(); }}
              className="text-xs px-3 py-1.5 rounded-full glass border border-white/8 text-gray-400 hover:text-brand-300 hover:border-brand-500/30 transition-all duration-150"
            >
              {q}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
