import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { Send, ArrowLeft, LayoutDashboard, AlertCircle, Sparkles, Bot, User } from 'lucide-react';
import { useRepo } from '../context/RepoContext';
import ChatBubble from '../components/ChatBubble';
import TypingIndicator from '../components/TypingIndicator';
import SuggestionChips from '../components/SuggestionChips';

export default function Chat() {
  const location = useLocation();
  const navigate = useNavigate();
  const { analysis, repoInfo } = useRepo();
  const inputRef = useRef(null);
  const bottomRef = useRef(null);

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

  useEffect(() => {
    // Small delay ensures the scroll happens after the new message animation starts,
    // creating a more fluid tracking experience.
    const timer = setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
    return () => clearTimeout(timer);
  }, [messages, isTyping]);

  useEffect(() => {
    if (!analysis) {
      navigate('/');
    }
  }, [analysis, navigate]);

  const getMockResponse = (text) => {
    const q = text.toLowerCase();
    const summary = analysis?.summary || "This is a complex codebase.";

    if (q.includes('logic') || q.includes('entry')) {
      return `Based on my analysis, the main logic starts in the root entries mentioned in the summary: ${summary?.slice(0, 100) || 'Main entry points'}... You should check the principal components first.`;
    }
    if (q.includes('folder') || q.includes('structure')) {
      return `The folder structure follows a standard pattern. I've summarized the key directories in your dashboard. Most of the business logic resides in the primary source folders.`;
    }
    if (q.includes('start') || q.includes('new developer')) {
      return `A new developer should start by reading the README and then looking into the main entry points. Basically: ${summary?.slice(0, 150) || 'Read the structure summary'}.`;
    }
    return `I'm currently having trouble connecting to my brain, but based on the initial scan: ${summary || 'This repository has a complex structure.'}`;
  };

  async function handleSend(overrideText) {
    const text = (typeof overrideText === 'string' ? overrideText : input).trim();
    if (!text || isTyping) return;

    const userMsg = { id: Date.now(), role: 'user', text, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    setErrorStatus(null);

    // AI thinking delay
    const start = Date.now();

    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await axios.post(`${API_BASE_URL}/api/ai/chat`, {
        message: text,
        owner: repoInfo.owner,
        repo: repoInfo.repo
      }, { timeout: 8000 }); // 8s timeout for fallback

      const aiMsg = {
        id: Date.now() + 1,
        role: 'assistant',
        text: response.data.answer,
        timestamp: new Date(),
      };

      // Ensure at least 1s delay for "thinking" feel
      const elapsed = Date.now() - start;
      if (elapsed < 1000) await new Promise(r => setTimeout(r, 1000 - elapsed));

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error('Chat Error:', err);

      // FALLBACK LOGIC
      const mockText = getMockResponse(text);
      const aiMsg = {
        id: Date.now() + 2,
        role: 'assistant',
        text: `[Fallback Mode] ${mockText}`,
        timestamp: new Date(),
      };

      await new Promise(r => setTimeout(r, 1500)); // Artificial thinking delay for fallback
      setMessages((prev) => [...prev, aiMsg]);

      if (err.response?.status === 429) {
        setErrorStatus("API Rate Limit reached. Using smart fallback.");
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

  if (!analysis) return null;

  return (
    <div className="relative flex flex-col h-screen overflow-hidden bg-slate-950">
      {/* Background Aesthetics */}
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-100 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-brand-600/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-pink-600/5 blur-[120px] pointer-events-none" />

      {/* ── Header ── */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative z-20 glass border-b border-white/5 px-6 py-4 flex items-center justify-between shadow-xl"
      >
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 rounded-xl hover:bg-white/5 text-gray-500 hover:text-white transition-all group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/20">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight">RepoLens Assistant</h2>
              <div className="flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${isTyping ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`} />
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                  {isTyping ? 'Thinking...' : 'Online & Ready'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={() => navigate('/dashboard')}
          className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-xs text-gray-400 hover:text-white transition-all"
        >
          <LayoutDashboard className="w-4 h-4" />
          Dashboard
        </button>
      </motion.div>

      {/* ── Messages Area ── */}
      <div className="relative z-10 flex-1 overflow-y-auto px-4 py-8 custom-scrollbar">
        <div className="max-w-3xl mx-auto space-y-6">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: 'spring', damping: 25 }}
              >
                <ChatBubble message={msg} />
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <TypingIndicator />
            </motion.div>
          )}

          {errorStatus && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center gap-2 text-amber-400 bg-amber-500/10 border border-amber-500/20 p-3 rounded-2xl text-xs font-bold w-max mx-auto"
            >
              <AlertCircle className="w-4 h-4" />
              {errorStatus}
            </motion.div>
          )}

          <div ref={bottomRef} className="h-10" />
        </div>
      </div>

      {/* ── Input Area ── */}
      <div className="relative z-20 glass border-t border-white/5 px-6 py-6 pb-10">
        <div className="max-w-3xl mx-auto">
          {/* Suggestions */}
          <SuggestionChips onSelect={(text) => handleSend(text)} disabled={isTyping} />

          <div className="relative mt-4 group">
            <div className="absolute inset-0 bg-gradient-to-r from-brand-500 to-pink-500 rounded-2xl blur opacity-0 group-focus-within:opacity-20 transition-opacity" />
            <div className="relative flex items-center gap-3 bg-surface-900 border border-white/10 rounded-2xl p-2 pr-3">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isTyping}
                rows={1}
                placeholder={`Ask about ${repoName}...`}
                className="flex-1 bg-transparent border-none text-sm text-white placeholder-gray-600 focus:ring-0 py-3 px-4 resize-none max-h-32 custom-scrollbar disabled:opacity-50"
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || isTyping}
                className="w-10 h-10 rounded-xl bg-premium-gradient flex items-center justify-center text-white shadow-lg shadow-brand-500/30 hover:scale-105 active:scale-95 transition-all disabled:opacity-40 disabled:hover:scale-100"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center mt-3 px-2">
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-brand-400" /> GEMINI 2.0 Contextual
            </p>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
              ⏎ Enter to send
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
