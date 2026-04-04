import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Zap, Shield, Search, Star } from 'lucide-react';
import axios from 'axios';
import { useRepo } from '../context/RepoContext';
import RepoInput from '../components/RepoInput';
import RecentRepos from '../components/RecentRepos';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [url, setUrl] = useState('');
  const navigate = useNavigate();
  const { setRepoData } = useRepo();

  const handleAnalyze = async (inputUrl) => {
    const targetUrl = inputUrl || url;
    if (!targetUrl) return;
    setLoading(true);
    setError(null);
    
    try {
      const trimmed = targetUrl.trim().replace(/\/$/, "");
      const match = trimmed.match(/github\.com\/([^/]+)\/([^/]+)/);
      if (!match) throw new Error("Invalid GitHub URL. Please use https://github.com/owner/repo");
      
      const info = { owner: match[1], repo: match[2] };
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      
      const response = await axios.post(`${API_BASE_URL}/api/analyze`, { repoUrl: trimmed });

      setRepoData(response.data, { url: trimmed, owner: info.owner, repo: info.repo });
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || err.message || "Failed to analyze repository.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleAnalyze();
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', damping: 25 } }
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      {/* ── Background Aesthetics ── */}
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-100 pointer-events-none" />
      <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full bg-brand-600/10 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-100px] right-0 w-[400px] h-[400px] rounded-full bg-pink-600/5 blur-[120px] pointer-events-none" />

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-5xl mx-auto flex flex-col items-center text-center"
      >
        {/* ── Badge ── */}
        <motion.div 
          variants={itemVariants}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-bold mb-8 glow-box"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>BETA v1.0 • POWERED BY GEMINI 2.0</span>
          <div className="flex -space-x-1 ml-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-4 h-4 rounded-full border border-slate-950 bg-slate-800" />
            ))}
          </div>
        </motion.div>

        {/* ── Hero Title ── */}
        <motion.h1 
          variants={itemVariants}
          className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1]"
        >
          Understand any repository <br />
          <span className="text-brand-400 drop-shadow-2xl">in milliseconds.</span>
        </motion.h1>

        <motion.p 
          variants={itemVariants}
          className="max-w-2xl text-lg text-gray-400 mb-10 leading-relaxed font-medium"
        >
          Paste a GitHub link and let RepoLens analyze the architecture, logic, 
          and documentation for you. The future of codebase analysis is here.
        </motion.p>

        {/* ── Main Action ── */}
        <motion.div 
          variants={itemVariants}
          className="w-full max-w-2xl mb-12"
        >
          <div className="relative group p-[2px] rounded-2xl overflow-hidden shadow-2xl transition-all duration-300">
             {/* Dynamic Border Gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-brand-600 via-pink-400 to-sky-500 animate-pulse-slow opacity-60 group-focus-within:opacity-100" />
            
            <div className="relative bg-slate-950 rounded-2xl p-6">
              <RepoInput 
                value={url}
                onChange={(e) => { setUrl(e.target.value); setError(null); }}
                onKeyDown={handleKeyDown}
                onSubmit={handleAnalyze} 
                loading={loading} 
                error={error}
              />
            </div>
          </div>
          
          <div className="mt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-gray-500 font-medium">
            <div className="flex items-center gap-1.5 hover:text-brand-400 transition-colors cursor-default">
              <Zap className="w-4 h-4 text-brand-500" /> Fast AI Processing
            </div>
            <div className="flex items-center gap-1.5 hover:text-brand-400 transition-colors cursor-default">
              <Shield className="w-4 h-4 text-emerald-500" /> Enterprise-ready Parsing
            </div>
            <div className="flex items-center gap-1.5 hover:text-brand-400 transition-colors cursor-default">
              <Search className="w-4 h-4 text-sky-500" /> Context-grounded Search
            </div>
          </div>
        </motion.div>

        {/* ── Social / Stats ── */}
        <motion.div 
          variants={itemVariants}
          className="flex flex-wrap justify-center items-center gap-10 md:gap-20 py-8 border-y border-white/5 w-full mb-20"
        >
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-white mb-1">10k+</span>
            <span className="text-[10px] uppercase tracking-widest text-gray-600 font-bold">Repos Analyzed</span>
          </div>
          <div className="flex flex-col items-center">
             <div className="flex items-center gap-1 mb-1">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span className="text-2xl font-bold text-white">4.9/5</span>
             </div>
            <span className="text-[10px] uppercase tracking-widest text-gray-600 font-bold">Developer Rating</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-white mb-1">3.0s</span>
            <span className="text-[10px] uppercase tracking-widest text-gray-600 font-bold">Latency average</span>
          </div>
        </motion.div>

        {/* ── Recent ── */}
        <motion.div variants={itemVariants} className="w-full">
          <RecentRepos onSelect={handleAnalyze} />
        </motion.div>
      </motion.div>
      
      {/* ── Decorations ── */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-brand-500/5 blur-[100px] pointer-events-none" />
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-purple-500/3 blur-[120px] pointer-events-none" />
    </div>
  );
}
