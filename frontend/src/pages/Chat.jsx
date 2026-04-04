import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Send, ArrowLeft, LayoutDashboard, AlertCircle } from 'lucide-react';
import ChatBubble from '../components/ChatBubble';
import TypingIndicator from '../components/TypingIndicator';

export default function Chat() {
  const location = useLocation();
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const bottomRef = useRef(null);

  const { repoInfo, analysis } = location.state || {};
  const repoName = repoInfo ? `${repoInfo.owner}/${repoInfo.repo}` : 'Repository';

  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      text: `Hello! I'm RepoLens AI. I've analyzed \`${repoName}\` completely. What would you like to know about its code?`,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [errorStatus, setErrorStatus] = useState(null);

  // Auto-scroll on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, errorStatus]);

  useEffect(() => {
    if (!analysis) {
      navigate('/');
    }
  }, [analysis, navigate]);

  async function handleSend() {
    const text = input.trim();
    if (!text || isTyping) return;

    const userMsg = { id: Date.now(), role: 'user', text, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    setErrorStatus(null);

    if (!repoInfo || !repoInfo.owner || !repoInfo.repo) {
      setErrorStatus("Repository information is missing. Go back to Home.");
      setIsTyping(false);
      return;
    }

    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await axios.post(`${API_BASE_URL}/api/ai/chat`, {
        message: text,
        owner: repoInfo.owner,
        repo: repoInfo.repo
      });

      const aiMsg = {
        id: Date.now() + 1,
        role: 'assistant',
        text: response.data.answer,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 429) {
        setErrorStatus("Too many requests. Please wait a few seconds 😭");
      } else {
        setErrorStatus("Something went wrong. Try again.");
      }
    } finally {
      setIsTyping(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
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
                {isTyping ? 'Typing…' : `${repoName} · Ready`}
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

        {errorStatus && (
          <div className="flex items-center gap-2 text-rose-400 bg-rose-500/10 border border-rose-500/20 p-3 rounded-xl text-sm font-medium animate-slide-up w-max">
            <AlertCircle className="w-4 h-4" />
            {errorStatus}
          </div>
        )}

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
              disabled={isTyping}
              placeholder={isTyping ? "Analyzing repository..." : `Ask anything about ${repoName}…`}
              rows={1}
              className="w-full px-4 py-3 rounded-xl text-sm
                bg-surface-700/80 border border-white/8 text-gray-100 placeholder-gray-600
                focus:outline-none focus:border-brand-500/60 input-glow
                transition-all duration-200 resize-none max-h-36 overflow-y-auto
                disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ lineHeight: '1.5' }}
            />
            {!isTyping && (
              <p className="absolute bottom-2 right-3 text-xs text-gray-600 pointer-events-none">
                ⏎ Send
              </p>
            )}
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
          {['What does this project do?', 'Where is the main logic?', 'Explain folder structure', 'Where should a new developer start?'].map((q) => (
            <button
              key={q}
              onClick={() => { setInput(q); inputRef.current?.focus(); }}
              disabled={isTyping}
              className="text-xs px-3 py-1.5 rounded-full glass border border-white/8 text-gray-400 hover:text-brand-300 hover:border-brand-500/30 transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {q}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
