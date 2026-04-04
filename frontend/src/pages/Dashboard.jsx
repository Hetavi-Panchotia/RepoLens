import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GitBranch, Star, GitFork, Globe, Code2, Filter, ArrowLeft, Folder, File, Layers, Zap, Info
} from 'lucide-react';
import ArchitectureCard from '../components/ArchitectureCard';
import FolderCard from '../components/FolderCard';
import FileCard from '../components/FileCard';
import SearchBar from '../components/SearchBar';
import RepoFlowchart from '../components/RepoFlowchart';
import FilePreviewPanel from '../components/FilePreviewPanel';

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
  const [selectedFile, setSelectedFile] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

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

  const handlePreview = (path) => {
    setSelectedFile(path);
    setIsPreviewOpen(true);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="relative min-h-screen pt-20 sm:pt-24 pb-16 px-4">
      {/* Background Aesthetics */}
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-100 pointer-events-none" />
      <div className="absolute top-[-150px] right-[-100px] w-[500px] h-[500px] rounded-full bg-brand-600/8 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-[-100px] w-[300px] h-[300px] rounded-full bg-sky-600/5 blur-[100px] pointer-events-none" />

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-6xl mx-auto"
      >
        {/* ── Header Area ── */}
        <motion.div variants={itemVariants} className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-200 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Home
          </button>
          
          <div className="flex items-center gap-3">
             <div className="flex -space-x-1 overflow-hidden">
                {[1,2,3].map(i => <div key={i} className="inline-block h-6 w-6 rounded-full ring-2 ring-slate-950 bg-slate-800" />)}
             </div>
             <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">12 Developers Tracking</span>
          </div>
        </motion.div>

        {/* ── Repo Meta Header ── */}
        <motion.div variants={itemVariants} className="bg-slate-900/50 border border-white/5 rounded-3xl p-6 md:p-8 mb-8 shadow-sm backdrop-blur-xl group">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-600 to-brand-400 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Code2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-extrabold text-white tracking-tight">
                    {repoMeta.owner}/<span className="text-brand-400">{repoMeta.repo}</span>
                  </h1>
                  <a
                    href={repoMeta.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-500 hover:text-brand-400 transition-colors flex items-center gap-1.5 mt-1 font-medium"
                  >
                    <Globe className="w-4 h-4" />
                    {repoMeta.url ? repoMeta.url.replace('https://', '') : 'github.com'}
                  </a>
                </div>
              </div>

              <div className="relative p-5 rounded-2xl bg-slate-950/40 border border-white/5 overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-brand-500 to-brand-600" />
                <p className="text-sm text-gray-400 leading-relaxed max-w-4xl font-medium">
                  {analysis.summary}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 md:flex-col justify-start">
               {[
                 { icon: Star, value: formatNum(repoMeta.stars), color: 'text-amber-400' },
                 { icon: GitFork, value: formatNum(repoMeta.forks), color: 'text-sky-400' },
                 { icon: Code2, value: repoMeta.language || 'Code', color: 'text-brand-400' }
               ].map((stat, i) => (
                 <div key={i} className="flex items-center gap-2 px-3 py-1.5 glass-premium rounded-xl border border-white/5 min-w-[90px]">
                   <stat.icon className={`w-3.5 h-3.5 ${stat.color}`} />
                   <span className="font-bold text-gray-200 text-xs">{stat.value}</span>
                 </div>
               ))}
            </div>
          </div>
        </motion.div>

        {/* ── Architecture Visuals ── */}
        <motion.div variants={itemVariants} className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-brand-400" />
              Repository Visual Architecture
            </h2>
            <div className="flex items-center gap-1 text-[10px] text-gray-500 uppercase tracking-widest font-bold">
               <Info className="w-3 h-3" /> Interactive Flow
            </div>
          </div>
          <RepoFlowchart analysis={analysis} />
        </motion.div>

        {/* ── Key Metrics ── */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <ArchitectureCard label="Total Folders" value={totalFoldersCount} icon={Folder} colorClass="text-brand-400" />
            <ArchitectureCard label="Total Files" value={totalFilesCount} icon={File} colorClass="text-emerald-400" />
            <ArchitectureCard label="Entry Points" value={enhancedFolders.length} icon={Zap} colorClass="text-amber-400" />
            <ArchitectureCard label="Tech Stack" value={repoMeta.language || 'Main'} icon={Globe} colorClass="text-sky-400" />
        </motion.div>

        {/* ── Grid Folder Explorer ── */}
        <motion.div variants={itemVariants} className="mb-16">
           <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Filter className="w-5 h-5 text-brand-400" />
              Root Explorer
            </h2>
            <SearchBar value={query} onChange={setQuery} count={filteredFolders.length + filteredFiles.length} />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredFolders.map((folder, i) => (
              <FolderCard key={folder.name} folder={folder} index={i} />
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredFiles.map((file, i) => (
              <div 
                key={file.name} 
                onClick={() => handlePreview(file.name)}
                className="cursor-pointer"
              >
                <FileCard file={file} index={i} />
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── AI Chat CTA ── */}
        <motion.div variants={itemVariants} className="relative group overflow-hidden rounded-[2rem] p-[1px] mb-10">
          <div className="absolute inset-0 bg-gradient-to-r from-brand-500 via-pink-400 to-sky-400 opacity-60 group-hover:opacity-100 transition-opacity animate-pulse-slow" />
          <div className="relative bg-slate-950/90 backdrop-blur-2xl rounded-[2rem] p-10 flex flex-col md:flex-row items-center justify-between gap-8 border border-white/10">
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl font-extrabold text-white mb-3">Ask RepoLens anything.</h2>
              <p className="text-gray-400 max-w-xl">
                Get context-aware answers about architecture, logic, or specific functions. 
                Trained on this repository's unique structure.
              </p>
            </div>
            <button
              onClick={() => navigate('/chat', { state: { repoInfo: repoMeta, analysis: analysis } })}
              className="px-10 py-4 bg-brand-500 hover:bg-brand-400 text-white font-bold rounded-2xl transition-all shadow-lg shadow-brand-500/25 hover:scale-105 active:scale-95 whitespace-nowrap"
            >
              Start Intelligent Chat
            </button>
          </div>
        </motion.div>
      </motion.div>

      {/* File Preview Panel Overlay */}
      <FilePreviewPanel 
        isOpen={isPreviewOpen} 
        onClose={() => setIsPreviewOpen(false)} 
        filePath={selectedFile}
        repoInfo={repoMeta}
      />
    </div>
  );
}
