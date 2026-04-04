import React from 'react';
import { FileCode, FileText, FileJson, Image as ImageIcon, File } from 'lucide-react';

export function getFileIcon(filename) {
  const ext = filename.split('.').pop().toLowerCase();
  switch (ext) {
    case 'js':
    case 'jsx':
    case 'ts':
    case 'tsx':
      return <FileCode className="w-5 h-5 text-yellow-500" />;
    case 'html':
    case 'css':
      return <FileCode className="w-5 h-5 text-orange-500" />;
    case 'json':
      return <FileJson className="w-5 h-5 text-green-500" />;
    case 'md':
    case 'txt':
      return <FileText className="w-5 h-5 text-gray-400" />;
    case 'png':
    case 'jpg':
    case 'svg':
      return <ImageIcon className="w-5 h-5 text-purple-400" />;
    default:
      return <File className="w-5 h-5 text-slate-500" />;
  }
}

function getFileBadge(filename) {
  const ext = filename.split('.').pop().toUpperCase();
  if (filename === ext) return null;
  return ext;
}

export default function FileCard({ file, index = 0 }) {
  const badge = getFileBadge(file.name);
  const sizeKB = file.size ? parseFloat(file.size) : 0;

  return (
    <div
      className="bg-slate-900 border border-white/5 rounded-2xl p-4 hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-brand-500/5 hover:border-brand-500/20 group relative overflow-hidden animate-slide-up flex flex-col justify-center"
      style={{ animationDelay: `${index * 30}ms` }}
    >
      <div className="flex items-center justify-between relative z-10 w-full">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-slate-950/50 flex flex-shrink-0 items-center justify-center border border-white/5 group-hover:border-brand-500/20 transition-colors shadow-sm">
            {getFileIcon(file.name)}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-mono text-sm font-semibold text-white group-hover:text-brand-300 transition-colors truncate">
              {file.name}
            </h3>
             <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-0.5">FILE</p>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1 flex-shrink-0">
           {badge && (
             <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-gray-400 border border-white/5 font-mono">
               {badge}
             </span>
           )}
           {sizeKB > 0 && (
            <span className="text-[10px] text-gray-500 font-mono">
              {sizeKB >= 1000 ? (sizeKB/1000).toFixed(1) + ' MB' : sizeKB.toFixed(1) + ' KB'}
            </span>
           )}
        </div>
      </div>
    </div>
  );
}
