import React from 'react';
import { Folder, Files, FolderDot, FileImage, Database } from 'lucide-react';
import SpotlightCard from './SpotlightCard';

export default function FolderCard({ folder, index = 0 }) {
  const getIconForFolder = (name) => {
    const lName = name.toLowerCase();
    if (lName.includes('src') || lName.includes('app')) return FolderDot;
    if (lName.includes('public') || lName.includes('assets')) return FileImage;
    if (lName.includes('db') || lName.includes('data')) return Database;
    return Folder;
  };
  const Icon = getIconForFolder(folder.name);

  return (
    <SpotlightCard
      className="p-5 hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between animate-slide-up"
      style={{ animationDelay: `${index * 30}ms` }}
    >
      <div className="flex items-start justify-between mb-4 relative z-10">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-12 h-12 rounded-xl bg-slate-950/50 flex flex-shrink-0 items-center justify-center border border-white/5 group-hover:border-brand-500/20 transition-colors shadow-sm">
            <Icon className="w-6 h-6 text-brand-400 group-hover:text-brand-300 transition-colors" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-bold text-white truncate group-hover:text-brand-300 transition-colors">
              {folder.name}
            </h3>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-0.5">Directory</p>
          </div>
        </div>
      </div>

      <p className="text-sm text-gray-400 line-clamp-2 mb-6 h-10 group-hover:text-gray-300 transition-colors relative z-10">
        {folder.explanation || folder.description || 'General project directory'}
      </p>

      <div className="flex items-center gap-6 pt-4 border-t border-white/5 relative z-10">
        <div className="flex flex-col">
          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-0.5">Files</span>
          <div className="flex items-center gap-1.5 text-gray-200 font-semibold text-sm">
            <Files className="w-3.5 h-3.5 text-emerald-400" />
            {folder.fileCount !== undefined ? folder.fileCount : '?'}
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-0.5">Folders</span>
          <div className="flex items-center gap-1.5 text-gray-200 font-semibold text-sm">
            <Folder className="w-3.5 h-3.5 text-sky-400" />
            {folder.dirCount !== undefined ? folder.dirCount : '?'}
          </div>
        </div>
        {folder.sizeKB !== undefined && (
          <div className="flex flex-col ml-auto text-right">
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-0.5">Size</span>
            <div className="text-gray-200 font-semibold text-sm font-mono">
              {folder.sizeKB >= 1000 ? (folder.sizeKB/1000).toFixed(1) + ' MB' : folder.sizeKB + ' KB'}
            </div>
          </div>
        )}
      </div>
    </SpotlightCard>
  );
}
