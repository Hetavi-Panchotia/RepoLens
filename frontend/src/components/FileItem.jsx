import React from 'react';
import { FileCode, FileText, FileJson, Image as ImageIcon, File } from 'lucide-react';

function getFileIcon(filename) {
  const ext = filename.split('.').pop().toLowerCase();
  switch (ext) {
    case 'js':
    case 'jsx':
    case 'ts':
    case 'tsx':
      return <FileCode className="w-4 h-4 text-yellow-400" />;
    case 'html':
    case 'css':
      return <FileCode className="w-4 h-4 text-orange-400" />;
    case 'json':
      return <FileJson className="w-4 h-4 text-green-400" />;
    case 'md':
    case 'txt':
      return <FileText className="w-4 h-4 text-gray-400" />;
    case 'png':
    case 'jpg':
    case 'svg':
      return <ImageIcon className="w-4 h-4 text-purple-400" />;
    default:
      return <File className="w-4 h-4 text-slate-500" />;
  }
}

function getFileBadge(filename) {
  const ext = filename.split('.').pop().toUpperCase();
  if (filename === ext) return null; // No extension
  return ext;
}

export default function FileItem({ name, depth, size }) {
  const badge = getFileBadge(name);

  return (
    <div 
      className="flex items-center justify-between py-2 px-3 hover:bg-white/5 rounded-lg transition-colors group cursor-default"
      style={{ paddingLeft: `${(depth * 1.5) + 0.75}rem` }}
    >
      <div className="flex items-center gap-3">
        <div className="w-4 h-4 flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity">
          {getFileIcon(name)}
        </div>
        <span className="text-sm font-mono text-gray-300 group-hover:text-white transition-colors">{name}</span>
      </div>
      
      <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
        {badge && (
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-gray-400 border border-white/5 font-mono">
            {badge}
          </span>
        )}
        {size && (
          <span className="text-[10px] text-gray-500 font-mono">
           {(size / 1024).toFixed(1)} KB
          </span>
        )}
      </div>
    </div>
  );
}
