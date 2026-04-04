import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Zap, Shield, Search, Star, Globe } from 'lucide-react';
import axios from 'axios';
import { useRepo } from '../context/RepoContext';
import RepoInput from '../components/RepoInput';
import RecentRepos from '../components/RecentRepos';
import SuggestionChips from '../components/SuggestionChips';

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

      setRepoData(response.data, response.data.repoInfo);
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
      transition: { staggerChildren: 0.15, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', damping: 25 } }
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden pt-8 pb-32 px-6 selection:bg-brand-500/30">
      {/* ── Background Aesthetics ── */}
      <div className="fixed inset-0 bg-slate-950 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-grid opacity-10" />
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-brand-600/5 blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-pink-600/5 blur-[120px] animate-pulse-slow animation-delay-300" />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-7xl mx-auto flex flex-col items-center"
      >
        {/* ── Badge ── */}
        <motion.div
          variants={itemVariants}
          className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-[10px] font-black uppercase tracking-[0.2em] mb-8 shadow-inner"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>BETA v1.1 • POWERED BY GEMINI 2.0</span>
        </motion.div>

        {/* ── Hero Title ── */}
        <div className="text-center mb-10 px-4">
          <motion.h1
            variants={itemVariants}
            className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.95] text-white"
          >
            Understand any <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-pink-500">repository</span> instantly.
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="max-w-3xl mx-auto text-lg md:text-xl text-gray-500 leading-relaxed font-medium"
          >
            RepoLens maps complex codebases into actionable insights. 
            Paste a GitHub link to visualize architecture, logic, and dependencies in seconds.
          </motion.p>
        </div>

        {/* ── Main Input Card ── */}
        <motion.div
          variants={itemVariants}
          className="w-full max-w-4xl mb-24"
        >
          <div className="relative group p-[1px] rounded-3xl transition-all duration-700 hover:shadow-[0_0_50px_rgba(139,92,246,0.15)]">
            <div className="absolute inset-0 bg-gradient-to-r from-brand-600/20 via-pink-400/20 to-sky-500/20 rounded-3xl blur-2xl opacity-50 group-hover:opacity-100 transition-opacity" />
            
            <div className="relative bg-slate-950/40 backdrop-blur-3xl rounded-3xl p-8 md:p-12 border border-white/5">
              <RepoInput
                value={url}
                onChange={(e) => { setUrl(e.target.value); setError(null); }}
                onKeyDown={handleKeyDown}
                onSubmit={handleAnalyze}
                loading={loading}
                error={error}
              />
              
              <div className="mt-8">
                <SuggestionChips onSelect={handleAnalyze} disabled={loading} />
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-8 text-[11px] text-gray-500 font-bold uppercase tracking-widest opacity-60">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-brand-500" /> High-Density Analysis
            </div>
            <div className="w-1 h-1 rounded-full bg-white/10 hidden sm:block" />
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-500" /> Smart Hierarchy Mapping
            </div>
            <div className="w-1 h-1 rounded-full bg-white/10 hidden sm:block" />
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-sky-400" /> Context-Aware Search
            </div>
          </div>
        </motion.div>

        {/* ── Recent ── */}
        <motion.div variants={itemVariants} className="w-full">
          <div className="flex items-center gap-4 mb-10 px-2">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/5" />
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-gray-600">History & Analysis</h2>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/5" />
          </div>
          <RecentRepos onSelect={handleAnalyze} />
        </motion.div>
      </motion.div>

      {/* ── Secondary Decorations ── */}
      <div className="fixed top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] bg-brand-500/[0.02] blur-[150px] pointer-events-none rounded-full" />
      <div className="fixed top-1/4 right-0 w-[600px] h-[600px] bg-sky-500/[0.02] blur-[150px] pointer-events-none rounded-full" />
    </div>
  );
}
