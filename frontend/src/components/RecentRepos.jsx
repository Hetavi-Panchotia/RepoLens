import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { History, Calendar, ArrowRight, ExternalLink, RefreshCw } from 'lucide-react';

export default function RecentRepos() {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchRepos = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/analyze`);
      setRepos(response.data);
    } catch (err) {
      console.error('Failed to fetch recent repos:', err);
      setError('Could not load recent repositories.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRepos();
  }, []);

  const handleCardClick = (repo) => {
    // Navigate and pass real analysis results
    navigate('/dashboard', {
      state: {
        analysis: {
          summary: repo.summary,
          folders: repo.structure?.folders || [],
          files: repo.structure?.files || [],
          repoInfo: repo.repo_meta
        }
      }
    });
  };

  if (loading) {
    return (
      <div className="w-full mt-12 animate-fade-in px-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-6 ml-1">
          <History className="w-5 h-5 text-brand-400" />
          Recent Repositories
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass rounded-2xl h-44 p-5 skeleton opacity-50" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full mt-12 text-center p-8 glass rounded-2xl border-red-500/10">
        <p className="text-gray-400 mb-4">{error}</p>
        <button 
          onClick={fetchRepos}
          className="text-brand-400 hover:text-brand-300 transition-colors flex items-center gap-2 mx-auto"
        >
          <RefreshCw className="w-4 h-4" />
          Try again
        </button>
      </div>
    );
  }

  if (repos.length === 0) {
    return (
      <div className="w-full mt-12 text-center p-12 glass rounded-2xl border-white/5 border-dashed">
        <History className="w-10 h-10 text-gray-700 mx-auto mb-4" />
        <h3 className="text-white font-semibold mb-1">No repositories analyzed yet</h3>
        <p className="text-sm text-gray-500">Paste a GitHub link above to get started!</p>
      </div>
    );
  }

  return (
    <div className="w-full mt-12 animate-slide-up px-4 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2 ml-1">
          <History className="w-5 h-5 text-brand-400" />
          Recent Repositories
        </h2>
        <span className="text-[10px] text-gray-600 font-mono uppercase tracking-wider">
          Last {repos.length} searches
        </span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {repos.map((repo, idx) => {
          const owner = repo.repo_meta?.owner || 'unknown';
          const name = repo.repo_meta?.repo || repo.repo_url.split('/').pop() || 'Repo';
          const date = new Date(repo.created_at).toLocaleDateString(undefined, { 
            month: 'short', day: 'numeric', year: 'numeric' 
          });

          return (
            <button
              key={idx}
              onClick={() => handleCardClick(repo)}
              className="glass p-5 rounded-2xl text-left border border-white/5 hover:border-brand-500/30 transition-all duration-300 group hover:bg-surface-600/50 relative overflow-hidden"
            >
              {/* Card Glow Effect */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/5 blur-[40px] -mr-8 -mt-8 rounded-full group-hover:bg-brand-500/10 transition-colors duration-300" />
              
              <div className="flex items-start justify-between mb-3 relative z-10">
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-bold truncate group-hover:text-brand-400 transition-colors">
                    {owner}/<span className="text-brand-300">{name}</span>
                  </h3>
                  <div className="flex items-center gap-2 text-[10px] text-gray-500 mt-0.5">
                    <Calendar className="w-3 h-3" />
                    {date}
                  </div>
                </div>
                <div className="p-2 rounded-lg bg-surface-900 group-hover:bg-brand-500/10 transition-colors">
                  <ArrowRight className="w-3.5 h-3.5 text-gray-600 group-hover:text-brand-400 group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>

              <p className="text-xs text-gray-400 leading-relaxed mb-4 line-clamp-3 relative z-10">
                {repo.summary}
              </p>

              <div className="flex items-center gap-3 relative z-10">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-300 border border-brand-500/20">
                  {repo.repo_meta?.language || 'Code'}
                </span>
                {repo.repo_meta?.stars > 0 && (
                  <span className="text-[10px] text-gray-500 flex items-center gap-1">
                    ★ {(repo.repo_meta.stars / 1000).toFixed(1)}k
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
