import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GitBranch, Star, GitFork, Globe, Code2, Filter, ArrowLeft
} from 'lucide-react';
import { repoMeta, mockFolders } from '../data/mockData';
import LoadingScreen from '../components/LoadingScreen';
import FolderCard from '../components/FolderCard';
import SearchBar from '../components/SearchBar';
import EmptyState from '../components/EmptyState';

function StatBadge({ icon: Icon, label, value, color = 'text-gray-300' }) {
  return (
    <div className="flex items-center gap-1.5 text-sm">
      <Icon className={`w-4 h-4 ${color}`} />
      <span className={`font-semibold ${color}`}>{value}</span>
      <span className="text-gray-500">{label}</span>
    </div>
  );
}

function formatNum(n) {
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
  return n;
}

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1600);
    return () => clearTimeout(timer);
  }, []);

  const filtered = mockFolders.filter((f) =>
    f.name.toLowerCase().includes(query.toLowerCase()) ||
    f.description.toLowerCase().includes(query.toLowerCase()) ||
    f.techTags.some((t) => t.toLowerCase().includes(query.toLowerCase()))
  );

  if (loading) return <LoadingScreen />;

  return (
    <div className="relative min-h-screen pt-20 sm:pt-24 pb-16 px-4 page-enter">
      {/* Background */}
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-100 pointer-events-none" />
      <div className="absolute top-[-150px] right-[-100px] w-[500px] h-[500px] rounded-full bg-brand-600/8 blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto">

        {/* ── Back Button ── */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-200 transition-colors mb-6 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-150" />
          Back to Home
        </button>

        {/* ── Repo Meta Header ── */}
        <div className="glass rounded-2xl p-6 mb-8 animate-slide-up">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-lg bg-brand-500/15 flex items-center justify-center">
                  <Code2 className="w-5 h-5 text-brand-400" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white leading-tight">
                    {repoMeta.owner}/<span className="text-brand-400">{repoMeta.repo}</span>
                  </h1>
                  <a
                    href={repoMeta.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-gray-500 hover:text-brand-400 transition-colors flex items-center gap-1 mt-0.5"
                  >
                    <Globe className="w-3 h-3" />
                    {repoMeta.url.replace('https://', '')}
                  </a>
                </div>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed max-w-xl">
                {repoMeta.description}
              </p>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-4 sm:flex-col">
              <StatBadge icon={Star} value={formatNum(repoMeta.stars)} label="stars" color="text-amber-400" />
              <StatBadge icon={GitFork} value={formatNum(repoMeta.forks)} label="forks" color="text-sky-400" />
              <StatBadge icon={GitBranch} value={repoMeta.language} label="" color="text-brand-400" />
            </div>
          </div>

          {/* Topics */}
          <div className="flex flex-wrap gap-2 mt-5 pt-5 border-t border-white/5">
            {repoMeta.topics.map((t) => (
              <span key={t} className="text-xs font-mono px-2.5 py-1 rounded-full bg-brand-500/10 text-brand-300 border border-brand-500/20">
                #{t}
              </span>
            ))}
            <span className="ml-auto text-xs text-gray-600 self-center">Updated {repoMeta.lastUpdated}</span>
          </div>
        </div>

        {/* ── Section Header + Search ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 animate-slide-up animation-delay-150">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Filter className="w-4 h-4 text-brand-400" />
              Folder Structure
              <span className="text-sm font-normal text-gray-500 ml-1">({mockFolders.length} directories)</span>
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">Click any card to explore details</p>
          </div>
          <SearchBar value={query} onChange={setQuery} count={filtered.length} />
        </div>

        {/* ── Divider ── */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-6" />

        {/* ── Folder Grid ── */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4">
            {filtered.map((folder, i) => (
              <FolderCard key={folder.id} folder={folder} index={i} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No folders match your search"
            message={`No results for "${query}". Try searching by folder name, description, or technology.`}
          />
        )}

        {/* ── Footer Note ── */}
        {filtered.length > 0 && (
          <div className="mt-8 text-center text-xs text-gray-600 animate-fade-in">
            Showing {filtered.length} of {mockFolders.length} top-level directories ·{' '}
            <button
              onClick={() => navigate('/chat')}
              className="text-brand-400 hover:text-brand-300 transition-colors underline underline-offset-2"
            >
              Ask the AI about this repo →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
