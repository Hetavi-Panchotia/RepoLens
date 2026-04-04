import React from 'react';
import { Folder, Files, FileImage, FolderDot, Database } from 'lucide-react';

export default function FolderCard({ folder, index = 0 }) {
  // Determine an icon based on folder name heuristically
  const getIcon = (name) => {
    const lName = name.toLowerCase();
    if (lName.includes('src') || lName.includes('app')) return FolderDot;
    if (lName.includes('public') || lName.includes('assets')) return FileImage;
    if (lName.includes('db') || lName.includes('data')) return Database;
    return Folder;
  };
  const Icon = getIcon(folder.name);

  return (
    <div
      className="bg-slate-900 border border-white/5 rounded-2xl p-5 hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-brand-500/10 hover:border-brand-500/20 group relative overflow-hidden animate-slide-up"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/5 blur-[40px] -mr-8 -mt-8 rounded-full group-hover:bg-brand-500/10 transition-colors duration-300 pointer-events-none" />

      {/* Header */}
      <div className="flex items-start gap-4 mb-3 relative z-10">
        <div className="w-12 h-12 rounded-xl bg-slate-950/50 flex flex-shrink-0 items-center justify-center border border-white/5 group-hover:border-brand-500/20 transition-colors shadow-sm">
          <Icon className="w-6 h-6 text-brand-400" />
        </div>
        <div className="flex-1 min-w-0 pt-1">
          <h3 className="font-mono text-base font-bold text-white group-hover:text-brand-300 transition-colors truncate">
            /{folder.name}
          </h3>
          <p className="text-xs text-gray-500 font-medium tracking-wide mt-0.5">DIRECTORY</p>
        </div>
      </div>

      {/* Explanation */}
      <p className="text-sm text-gray-400 mt-2 mb-5 leading-relaxed line-clamp-2 h-10 relative z-10">
        {folder.explanation || folder.description || "General project file collection."}
      </p>

      {/* Stats Divider */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-4 relative z-10" />

      {/* Informative Stats */}
      <div className="flex items-center justify-between relative z-10">
        <div className="flex gap-4">
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
        </div>

        {folder.sizeKB > 0 && (
          <div className="text-right">
             <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-0.5 block">Size</span>
             <span className="text-xs font-mono text-gray-400">{folder.sizeKB >= 1000 ? (folder.sizeKB/1000).toFixed(1) + ' MB' : folder.sizeKB + ' KB'}</span>
          </div>
        )}
      </div>
    </div>
  );
}
