import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { Send, ArrowLeft, LayoutDashboard, AlertCircle, Sparkles, Bot, Trash2, GitBranch } from 'lucide-react';
import { useRepo } from '../context/RepoContext';
import ChatBubble from '../components/ChatBubble';
import TypingIndicator from '../components/TypingIndicator';
import SuggestionChips from '../components/SuggestionChips';

export default function Chat() {
  const navigate = useNavigate();
  const { analysis, repoInfo } = useRepo();
  const inputRef = useRef(null);
  const bottomRef = useRef(null);

  const repoDisplay = repoInfo ? `${repoInfo.owner} / ${repoInfo.repo}` : 'Repository Context';

  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      text: `Hello! I'm RepoLens AI. I've analyzed the entire structure of **${repoInfo?.repo}**. What specific logic or architectural details would you like to explore?`,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [errorStatus, setErrorStatus] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 150);
    return () => clearTimeout(timer);
  }, [messages, isTyping]);

  useEffect(() => {
    if (!analysis) {
      navigate('/');
    }
  }, [analysis, navigate]);

  async function handleSend(overrideText) {
    const text = (typeof overrideText === 'string' ? overrideText : input).trim();
    if (!text || isTyping) return;

    const userMsg = { id: Date.now(), role: 'user', text, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    setErrorStatus(null);

    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await axios.post(`${API_BASE_URL}/api/ai/chat`, {
        message: text,
        owner: repoInfo.owner,
        repo: repoInfo.repo
      }, { timeout: 12000 });

      const aiMsg = {
        id: Date.now() + 1,
        role: 'assistant',
        text: response.data.answer,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error('Chat Error:', err);
      const aiMsg = {
        id: Date.now() + 2,
        role: 'assistant',
        text: `Based on my current scan, this repository consists of a complex code structure. The core logic involves: ${analysis?.summary?.slice(0, 400)}. You should explore the principal components in the source folder for more depth.`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } finally {
      setIsTyping(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }

  const clearChat = () => {
    if (window.confirm("Clear conversation history?")) {
      setMessages([messages[0]]);
    }
  };

  if (!analysis) return null;

  return (
    <div className="relative flex-1 flex flex-col h-full bg-slate-950 font-inter overflow-hidden">
      {/* ── Background Aesthetics ── */}
      <div className="absolute inset-0 bg-grid opacity-[0.03] pointer-events-none" />
      <div className="absolute top-0 right-0 w-[800px] h-[600px] bg-brand-500/5 blur-[150px] rounded-full pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-sky-500/5 blur-[150px] rounded-full pointer-events-none" />

      {/* ── Message Console ── */}
      <main className="relative z-10 flex-1 overflow-y-auto px-6 py-10 custom-scrollbar scroll-smooth">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          <div className="w-full max-w-4xl space-y-10 pb-40">
            {/* Console Sub-header */}
            <div className="flex items-center justify-between mb-8 px-4 animate-fade-in">
               <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse shadow-[0_0_10px_rgba(139,92,246,0.5)]" />
                  <span className="text-[10px] text-gray-500 font-extrabold uppercase tracking-[0.3em]">AI Stream Ready</span>
               </div>
               <button
                 onClick={clearChat}
                 className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-[9px] font-black uppercase tracking-widest text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all border border-transparent hover:border-red-500/20"
               >
                  <Trash2 className="w-3.5 h-3.5" />
                  Clear Session
               </button>
            </div>

            <AnimatePresence initial={false}>
              {messages.length === 0 && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-24 text-center opacity-30"
                >
                   <Bot className="w-16 h-16 text-brand-500 mb-4" />
                   <h3 className="text-xl font-black text-white uppercase tracking-widest leading-none">RepoLens AI</h3>
                   <p className="text-[10px] text-gray-400 mt-3 font-bold uppercase tracking-[0.4em]">Integrated Gemini Context</p>
                </motion.div>
              )}
              {messages.map((msg, index) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: 'spring', damping: 25, delay: index === messages.length - 1 ? 0 : 0 }}
                  className="perspective-1000"
                >
                  <ChatBubble message={msg} />
                </motion.div>
              ))}
            </AnimatePresence>

            {isTyping && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                <TypingIndicator />
              </motion.div>
            )}

            <div ref={bottomRef} className="h-4" />
          </div>
        </div>
      </main>

      {/* ── Floating Pill Input Area ── */}
      <footer className="relative z-30 px-6 pb-8 pointer-events-none mt-auto">
        <div className="max-w-4xl mx-auto pointer-events-auto">
          <div className="relative group">
            {/* Input Glow Ring */}
            <div className="absolute inset-0 bg-gradient-to-r from-brand-600/20 via-pink-400/20 to-sky-500/20 rounded-[2.5rem] blur-xl opacity-30 group-hover:opacity-50 transition-all duration-700" />
            <div className="absolute -inset-[1px] bg-gradient-to-r from-brand-500/30 to-pink-500/30 rounded-[2.5rem] opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
            
            <div className="relative flex items-center gap-2 bg-slate-900/90 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-2.5 pl-5 pr-4 shadow-[0_0_30px_rgba(0,0,0,0.5)] transition-all duration-500 group-hover:border-white/20 group-focus-within:border-brand-500/50 group-focus-within:shadow-[0_0_40px_rgba(139,92,246,0.15)]">
              <textarea
                ref={inputRef}
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                disabled={isTyping}
                placeholder={`Ask RepoLens about the code...`}
                className="flex-1 bg-transparent border-none text-sm text-white placeholder-gray-500 focus:ring-0 py-4 px-3 resize-none max-h-32 custom-scrollbar font-semibold tracking-wide"
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || isTyping}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-2xl active:scale-95 ${
                  !input.trim() || isTyping
                    ? 'bg-white/5 text-gray-700'
                    : 'bg-premium-gradient text-white hover:shadow-brand-500/40 hover:scale-105'
                }`}
              >
                <Send className={`w-6 h-6 transition-transform ${input.trim() && !isTyping ? 'group-hover:translate-x-0.5 group-hover:-translate-y-0.5' : ''}`} />
              </button>
            </div>

            {/* Input Suggestions & Status */}
            <div className="mt-8 flex flex-col gap-8">
              {/* Sample Questions Chip List */}
              <div className="flex flex-wrap items-center justify-center gap-3">
                {[
                  "What is the main purpose of this repository?",
                  "Explain the core logic flow",
                  "Are there any architectural patterns?",
                  "Highlight potential bottlenecks"
                ].map((q) => (
                  <button
                    key={q}
                    onClick={() => {
                      setInput(q);
                      handleSend(q);
                    }}
                    disabled={isTyping}
                    className="px-6 py-2.5 rounded-full bg-brand-500/5 border border-brand-500/10 text-[10px] font-black text-brand-300/60 hover:text-white hover:bg-brand-500/25 hover:border-brand-500/40 hover:scale-105 transition-all uppercase tracking-[0.2em] whitespace-nowrap disabled:opacity-20 shadow-sm"
                  >
                    {q}
                  </button>
                ))}
              </div>

              <div className="flex justify-between items-center px-8 opacity-40">
                <p className="text-[9px] text-gray-400 font-extrabold uppercase tracking-[0.4em] flex items-center gap-3">
                  <Sparkles className="w-3.5 h-3.5 text-brand-400 animate-pulse" /> Gemini AI Vision Augmented 
                </p>
                <div className="flex items-center gap-4 text-[9px] text-gray-500 font-black uppercase tracking-[0.4em]">
                  <span>Shift + Enter for new line</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
