import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowRight, Zap, GitBranch, FileSearch, MessageSquare, Star } from 'lucide-react';
import Button from '../components/Button';
import RepoInput from '../components/RepoInput';
import RecentRepos from '../components/RecentRepos';

const FEATURES = [
  {
    icon: <FileSearch className="w-5 h-5 text-brand-400" />,
    title: 'Instant Summary',
    desc: 'Get a plain-English overview of any public repo in seconds.',
  },
  {
    icon: <GitBranch className="w-5 h-5 text-emerald-400" />,
    title: 'Structure Explorer',
    desc: 'See every top-level folder explained — no manual browsing.',
  },
  {
    icon: <MessageSquare className="w-5 h-5 text-sky-400" />,
    title: 'Ask Anything',
    desc: 'Chat with an AI that knows the entire codebase context.',
  },
];

const EXAMPLE_REPOS = [
  'facebook/react',
  'vercel/next.js',
  'openai/openai-python',
];

function extractGitHubInfo(url) {
  const match = url.trim().match(/^https:\/\/github\.com\/([\w.-]+)\/([\w.-]+)(\/)?$/);
  return match ? { owner: match[1], repo: match[2] } : null;
}

export default function Home() {
  const [repoUrl, setRepoUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const navigate = useNavigate();

  function triggerError(msg) {
    setError(msg);
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
  }

  async function handleAnalyze() {
    const trimmed = repoUrl.trim();
    if (!trimmed) {
      triggerError('Please enter a GitHub repository URL.');
      return;
    }

    const info = extractGitHubInfo(trimmed);
    if (!info) {
      triggerError('Must be a valid GitHub URL — e.g. https://github.com/owner/repo');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/analyze`, {
        repoUrl: trimmed
      });

      console.log('Result:', response.data);

      // Navigate and pass real analysis results
      navigate('/dashboard', {
        state: {
          analysis: response.data,
          repoInfo: { url: trimmed, owner: info.owner, repo: info.repo }
        }
      });
    } catch (err) {
      console.error('Analysis failed:', err);
      triggerError(err.response?.data?.error || 'Failed to analyze repository. Is the backend running?');
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleAnalyze();
  }

  function fillExample(repo) {
    setRepoUrl(`https://github.com/${repo}`);
    setError('');
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center px-4 overflow-hidden">
      {/* ── Background Effects ── */}
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-100 pointer-events-none" />
      <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-brand-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-100px] right-[-100px] w-[400px] h-[400px] rounded-full bg-sky-600/5 blur-[100px] pointer-events-none" />

      {/* ── Content Wrapper ── */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-6xl mx-auto py-20 pb-32">
        
        {/* ── Hero Section (Narrow) ── */}
        <div className="flex flex-col items-center text-center max-w-2xl w-full mb-16">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 mb-6 hover:bg-brand-500/20 transition-colors cursor-default group">
            <Zap className="w-3 h-3 text-brand-400 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-bold text-brand-300 uppercase tracking-widest">
              Rule-Based Code Analysis
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl font-extrabold leading-[1.1] tracking-tight mb-5">
            <span className="text-white">Understand any</span>
            <br />
            <span className="text-gradient">codebase in minutes</span>
          </h1>

          <p className="text-gray-400 text-lg leading-relaxed mb-12 max-w-lg">
            Paste a public GitHub URL and RepoLens will generate a developer-ready
            summary, folder breakdown, and an interactive Q&amp;A.
          </p>

          {/* Input Card */}
          <div className={`w-full glass rounded-2xl p-5 glow-purple mb-4 transition-transform ${isShaking ? 'animate-shake' : ''}`}>
            <div className="flex flex-col sm:flex-row items-stretch gap-3">
              <RepoInput
                value={repoUrl}
                onChange={(e) => { setRepoUrl(e.target.value); setError(''); }}
                onKeyDown={handleKeyDown}
                error={error}
              />
              <Button
                id="analyze-btn"
                onClick={handleAnalyze}
                loading={loading}
                className="sm:whitespace-nowrap"
              >
                Analyze
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Example repos */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
            <span className="text-xs text-gray-600">Try:</span>
            {EXAMPLE_REPOS.map((repo) => (
              <button
                key={repo}
                onClick={() => fillExample(repo)}
                className="text-xs font-mono text-gray-500 hover:text-brand-400 transition-colors duration-150 underline underline-offset-2 decoration-gray-700 hover:decoration-brand-500"
              >
                {repo}
              </button>
            ))}
          </div>
        </div>

        {/* ── Recent Repositories Section (Wide) ── */}
        <div className="w-full mb-24 px-4">
          <RecentRepos />
        </div>

        {/* ── Features Section (Wide) ── */}
        <div className="w-full px-4">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center border border-brand-500/20">
              <Star className="w-5 h-5 text-brand-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Core Features</h2>
              <p className="text-xs text-gray-500 mt-0.5">Everything you need to navigate code</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full">
            {FEATURES.map((f, i) => (
              <div
                key={i}
                className="glass rounded-2xl p-6 text-left hover:bg-surface-600/50 transition-all duration-300 group hover:-translate-y-1 hover:shadow-2xl hover:shadow-brand-500/10 border border-white/5 hover:border-brand-500/20"
              >
                <div className="w-10 h-10 rounded-xl bg-surface-900/60 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-brand-500/20 transition-all duration-300">
                  {f.icon}
                </div>
                <h3 className="text-base font-bold text-white mb-2 group-hover:text-brand-400 transition-colors">{f.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer info */}
        <div className="flex items-center gap-2 mt-24 text-[10px] text-gray-600 uppercase tracking-widest font-bold font-mono">
          <div className="w-1.5 h-1.5 rounded-full bg-gray-800" />
          <span>Public Repositories Only</span>
          <div className="w-1.5 h-1.5 rounded-full bg-gray-800" />
        </div>
      </div>
    </div>
  );
}
