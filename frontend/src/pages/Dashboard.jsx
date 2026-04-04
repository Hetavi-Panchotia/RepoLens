import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  GitBranch, Star, GitFork, Globe, Code2, Filter, ArrowLeft, Folder, File, Layers
} from 'lucide-react';
import { ArchitectureSkeleton } from '../components/SkeletonLoader';
import ArchitectureCard from '../components/ArchitectureCard';
import FolderCard from '../components/FolderCard';
import FileCard from '../components/FileCard';
import SearchBar from '../components/SearchBar';

function formatNum(n) {
  if (!n) return 0;
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
  return n;
}

export default function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');

  const analysis = location.state?.analysis || {};
  const repoMeta = location.state?.repoInfo || analysis.repoInfo || {};
  const rawStructure = analysis.structure || { tree: [], root: { folders: analysis.folders || [], files: analysis.files || [] } };

  // Calculate stats
  const totalFoldersCount = rawStructure.totalFolders !== undefined ? rawStructure.totalFolders : (rawStructure.root?.folders?.length || rawStructure.folders?.length || 0);
  const totalFilesCount = rawStructure.totalFiles !== undefined ? rawStructure.totalFiles : (rawStructure.root?.files?.length || rawStructure.files?.length || 0);

  // Enhance root folders with recursive stats for Grid Layout
  const rootFolders = rawStructure.root?.folders || rawStructure.folders || [];
  const enhancedFolders = useMemo(() => {
    return rootFolders.map(folder => {
      const prefix = folder.name + '/';
      let fileCount = undefined;
      let dirCount = undefined;
      let size = 0;
      
      if (rawStructure.tree && rawStructure.tree.length > 0) {
        fileCount = 0;
        dirCount = 0;
        rawStructure.tree.forEach(item => {
          if (item.path.startsWith(prefix)) {
            if (item.type === 'blob') {
              fileCount++;
              size += item.size || 0;
            } else if (item.type === 'tree') {
              dirCount++;
            }
          }
        });
      }

      return {
        ...folder,
        fileCount,
        dirCount,
        sizeKB: (size / 1024).toFixed(1)
      };
    });
  }, [rawStructure, rootFolders]);

  const filteredFolders = enhancedFolders.filter(f => 
    f.name.toLowerCase().includes(query.toLowerCase()) || 
    (f.explanation || '').toLowerCase().includes(query.toLowerCase())
  );

  const rootFiles = rawStructure.root?.files || rawStructure.files || [];
  const filteredFiles = rootFiles.filter(f => 
    f.name.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (!location.state) {
      navigate('/');
      return;
    }
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, [location.state, navigate]);

  return (
    <div className="relative min-h-screen pt-20 sm:pt-24 pb-16 px-4 page-enter">
      {/* Background */}
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-100 pointer-events-none" />
      <div className="absolute top-[-150px] right-[-100px] w-[500px] h-[500px] rounded-full bg-brand-600/8 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-[-100px] w-[300px] h-[300px] rounded-full bg-sky-600/5 blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto">

        {/* ── Back Button ── */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-200 transition-colors mb-6 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
          Back to Home
        </button>

        {/* ── Repo Meta Header ── */}
        <div className="bg-slate-900 border border-white/5 rounded-3xl p-6 md:p-8 mb-8 shadow-sm backdrop-blur animate-slide-up">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-600 to-brand-400 flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.3)]">
                  <Code2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-extrabold text-white leading-tight truncate tracking-tight">
                    {repoMeta.owner}/<span className="text-brand-400">{repoMeta.repo}</span>
                  </h1>
                  <a
                    href={repoMeta.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-500 hover:text-brand-400 transition-colors flex items-center gap-1.5 mt-1 font-medium"
                  >
                    <Globe className="w-4 h-4 text-brand-500/50" />
                    {repoMeta.url ? repoMeta.url.replace('https://', '') : 'github.com'}
                  </a>
                </div>
              </div>

              {/* Summary Card */}
              <div className="relative group p-5 rounded-2xl bg-slate-950/50 border border-white/5 mb-2 overflow-hidden shadow-inner">
                {/* Gradient left border strip */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-brand-400 via-pink-400 to-sky-400"></div>
                <div className="flex gap-3 relative z-10 pl-2">
                  <p className="text-sm text-gray-300 leading-relaxed max-w-3xl font-medium">
                    {analysis.summary}
                  </p>
                </div>
              </div>
            </div>

             <div className="flex flex-wrap gap-4 md:flex-col justify-center">
               <div className="flex items-center gap-2 px-4 py-2 bg-slate-950 rounded-xl border border-white/5">
                 <Star className="w-4 h-4 text-amber-400" />
                 <span className="font-bold text-gray-200">{formatNum(repoMeta.stars)}</span>
               </div>
               <div className="flex items-center gap-2 px-4 py-2 bg-slate-950 rounded-xl border border-white/5">
                 <GitFork className="w-4 h-4 text-sky-400" />
                 <span className="font-bold text-gray-200">{formatNum(repoMeta.forks)}</span>
               </div>
               <div className="flex items-center gap-2 px-4 py-2 bg-slate-950 rounded-xl border border-white/5">
                 <Code2 className="w-4 h-4 text-brand-400" />
                 <span className="font-bold text-gray-200">{repoMeta.language || 'Code'}</span>
               </div>
             </div>
          </div>
        </div>

        {/* ── Architecture Overview ── */}
        <div className="animate-slide-up animation-delay-100">
          <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
            <Layers className="w-5 h-5 text-brand-400" />
            Architecture Overview
          </h2>
          {loading ? (
             <ArchitectureSkeleton />
          ) : (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
               <ArchitectureCard label="Total Folders" value={totalFoldersCount} icon={Folder} colorClass="text-brand-400" />
               <ArchitectureCard label="Total Files" value={totalFilesCount} icon={File} colorClass="text-emerald-400" />
               <ArchitectureCard label="Primary Language" value={repoMeta.language || 'Unknown'} icon={Code2} colorClass="text-sky-400" />
               <ArchitectureCard label="Branch" value={repoMeta.defaultBranch || 'main'} icon={GitBranch} colorClass="text-purple-400" />
             </div>
          )}
        </div>

        {/* ── Grid Folder Explorer ── */}
        <div className="animate-slide-up animation-delay-150 relative z-20">
           <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Filter className="w-5 h-5 text-brand-400" />
              Repository Structure
            </h2>
            <SearchBar value={query} onChange={setQuery} count={filteredFolders.length + filteredFiles.length} />
          </div>
          
           {loading ? (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1,2,3].map(i => <div key={i} className="bg-slate-900 border border-white/5 rounded-2xl h-[180px] skeleton"></div>)}
             </div>
           ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-30 mb-8">
                  {filteredFolders.length > 0 ? (
                    filteredFolders.map((folder, i) => (
                      <FolderCard key={folder.name} folder={folder} index={i} />
                    ))
                  ) : filteredFiles.length === 0 ? (
                    <div className="col-span-full">
                      <p className="text-center text-gray-500 py-10 glass rounded-2xl border-white/5">No items found matching "{query}"</p>
                    </div>
                  ) : null}
                </div>

                {/* Root Files */}
                {filteredFiles.length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold text-gray-300 flex items-center gap-2 mb-4 mt-2">
                      <File className="w-5 h-5 text-gray-400" />
                      Root Files
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative z-30">
                      {filteredFiles.map((file, i) => (
                        <FileCard key={file.name} file={file} index={i} />
                      ))}
                    </div>
                  </div>
                )}
              </>
           )}
        </div>

        {/* ── AI Chat CTA Footer ── */}
        <div className="mt-16 animate-slide-up animation-delay-300">
          <div className="relative group overflow-hidden rounded-3xl p-[1px]">
            <div className="absolute inset-0 bg-gradient-to-r from-brand-600 via-pink-500 to-sky-500 opacity-50 blur-sm group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative bg-slate-900/90 backdrop-blur-xl rounded-3xl p-8 sm:p-12 flex flex-col sm:flex-row items-center justify-between gap-6 border border-white/10">
              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2 tracking-tight">
                  Still have doubts?
                </h2>
                <p className="text-gray-400 text-sm sm:text-base max-w-2xl">
                  Dive deeper into the codebase. Ask questions, understand dependencies, or generate snippets using our context-aware AI.
                </p>
              </div>
              <button
                onClick={() => navigate('/chat', { state: { repoInfo: repoMeta, analysis: analysis } })}
                className="flex items-center gap-2 px-8 py-4 bg-white text-slate-950 font-bold rounded-xl hover:bg-gray-100 hover:scale-105 active:scale-95 transition-all shadow-lg hover:shadow-white/25 flex-shrink-0"
              >
                Start Chatting
                <ArrowLeft className="w-5 h-5 rotate-180" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
