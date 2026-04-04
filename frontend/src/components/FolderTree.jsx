import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Folder as FolderIcon, FolderOpen } from 'lucide-react';
import FileItem from './FileItem';

export default function FolderTree({ name, type, children, depth = 0, isRoot = false }) {
  // Root is expanded by default, others start collapsed
  const [isOpen, setIsOpen] = useState(isRoot || depth === 0);

  if (isRoot) {
    if (!children || Object.keys(children).length === 0) return null;
    return (
      <div className="w-full">
        {Object.keys(children).sort((a,b) => {
          // Folders first, then files
          const typeA = children[a].type;
          const typeB = children[b].type;
          if (typeA === typeB) return a.localeCompare(b);
          return typeA === 'tree' ? -1 : 1;
        }).map(childName => (
          <FolderTree 
            key={childName} 
            name={childName} 
            {...children[childName]} 
            depth={depth} 
          />
        ))}
      </div>
    );
  }

  if (type === 'blob') {
    return <FileItem name={name} depth={depth} size={children?.size} />;
  }

  const childEntries = children ? Object.entries(children).sort((a,b) => {
    // Folders first, then files
    const typeA = a[1].type;
    const typeB = b[1].type;
    if (typeA === typeB) return a[0].localeCompare(b[0]);
    return typeA === 'tree' ? -1 : 1;
  }) : [];

  return (
    <div className="w-full select-none">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 py-2 px-3 hover:bg-brand-500/10 rounded-lg cursor-pointer transition-colors group"
        style={{ paddingLeft: `${(depth * 1.5) + 0.75}rem` }}
      >
        <button className="w-4 h-4 flex items-center justify-center text-gray-500 group-hover:text-brand-400 transition-colors">
          {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
        </button>
        <div className="text-brand-400">
          {isOpen ? <FolderOpen className="w-4 h-4" /> : <FolderIcon className="w-4 h-4" />}
        </div>
        <span className="text-sm font-semibold text-gray-200 group-hover:text-white transition-colors">{name}</span>
        
        {/* Child Count Badge */}
        {childEntries.length > 0 && (
          <span className="ml-auto text-[10px] text-gray-500 bg-slate-800 px-2 py-0.5 rounded-full border border-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
            {childEntries.length} items
          </span>
        )}
      </div>

      <div className={`folder-details ${isOpen ? 'open' : ''}`}>
        <div className="folder-details-inner relative before:absolute before:left-[1.25rem] before:top-0 before:bottom-0 before:w-px before:bg-white/5">
          {childEntries.map(([childName, childData]) => (
            <FolderTree 
              key={childName} 
              name={childName} 
              {...childData} 
              depth={depth + 1} 
            />
          ))}
        </div>
      </div>
    </div>
  );
}
