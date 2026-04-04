import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { History, ArrowRight, ArrowUpRight, Folder, Star, Code2 } from 'lucide-react';
import { useRepo } from '../context/RepoContext';

function splitRepoUrl(url) {
  try {
    const parts = url.replace(/\/$/, '').split('/');
    const repoName = parts.pop();
    const owner = parts.pop();
    return { owner, repoName };
  } catch {
    return { owner: 'Owner', repoName: 'Repo' };
  }
}

export default function RecentRepos() {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { setRepoData } = useRepo();

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
    const analysisData = {
      summary: repo.summary,
      structure: repo.structure,
      folders: repo.structure?.root?.folders || repo.structure?.folders || repo.folders || [],
      files: repo.structure?.root?.files || repo.structure?.files || repo.files || [],
      repoInfo: repo.repo_meta
    };
    
    setRepoData(analysisData, repo.repo_meta);
    navigate('/dashboard');
  };

  const getLanguageColor = (lang) => {
    const colors = {
      JavaScript: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
      TypeScript: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
      Python: 'text-green-400 bg-green-400/10 border-green-400/20',
      HTML: 'text-orange-400 bg-orange-400/10 border-orange-400/20',
      CSS: 'text-sky-400 bg-sky-400/10 border-sky-400/20',
    };
    return colors[lang] || 'text-brand-400 bg-brand-400/10 border-brand-400/20';
  };

  if (loading && repos.length === 0) {
    return (
      <div className="w-full flex justify-center py-10">
        <div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (repos.length === 0) return null;

  return (
    <div className="w-full animate-slide-up animation-delay-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <History className="w-5 h-5 text-brand-400" />
          Previously Analyzed
        </h2>
        <span className="text-xs text-gray-500 font-medium bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
          {repos.length} Repos
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative group/grid">
        {repos.map((repo, i) => {
          const { owner, repoName } = splitRepoUrl(repo.repo_url);
          const lang = repo.repo_meta?.language || 'Code';
          const langColor = getLanguageColor(lang);
          const totalFolders = repo.structure?.totalFolders || repo.structure?.folders?.length || repo.folders?.length || 0;
          
          return (
            <div
              key={i}
              onClick={() => handleCardClick(repo)}
              className="bg-slate-900 border border-white/5 rounded-2xl p-6 cursor-pointer hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-md hover:border-brand-500/20 group hover:shadow-brand-500/5 relative overflow-hidden"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              
              {/* Card content */}
              <div className="relative z-10 flex items-start justify-between mb-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-slate-950/50 flex flex-shrink-0 items-center justify-center border border-white/5 group-hover:border-brand-500/20 transition-colors">
                    <Code2 className="w-5 h-5 text-gray-400 group-hover:text-brand-400 transition-colors" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-bold text-white truncate max-w-[150px] sm:max-w-[180px]" title={repoName}>
                      {repoName}
                    </h3>
                    <p className="text-xs text-gray-500 truncate">{owner}</p>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-gray-600 group-hover:text-brand-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </div>

              <p className="relative z-10 text-sm text-gray-400 line-clamp-2 mb-6 h-10">
                {repo.summary.split('. ')[0]}.
              </p>

              <div className="relative z-10 flex items-center justify-between pt-4 border-t border-white/5">
                <div className="flex items-center gap-3 text-xs">
                  <span className={`px-2 py-0.5 rounded-md border text-[10px] font-semibold ${langColor}`}>
                    {lang}
                  </span>
                  <div className="flex items-center gap-1.5 text-gray-500" title="Folders">
                    <Folder className="w-3.5 h-3.5" />
                    <span>{totalFolders > 999 ? (totalFolders/1000).toFixed(1)+'k' : totalFolders}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-500" title="Stars">
                    <Star className="w-3.5 h-3.5" />
                    <span>{repo.repo_meta?.stars ? (repo.repo_meta.stars > 999 ? (repo.repo_meta.stars/1000).toFixed(1)+'k' : repo.repo_meta.stars) : 0}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
