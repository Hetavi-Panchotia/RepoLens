import React from 'react';
import { Folder, BookOpen, Code2, Server, FlaskConical, Terminal, FileText, Package, Puzzle } from 'lucide-react';

const ICON_MAP = {
  package: Package,
  layout: Puzzle,
  puzzle: Puzzle,
  server: Server,
  book: BookOpen,
  testTube: FlaskConical,
  terminal: Terminal,
  fileText: FileText,
  folder: Folder,
  code: Code2,
};

const COMPLEXITY_COLORS = {
  High: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
  Medium: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  Low: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
};

export default function FolderCard({ folder, index = 0 }) {
  const [isOpen, setIsOpen] = React.useState(false);

  const Icon = ICON_MAP[folder.icon] || Folder;
  const complexityClass = COMPLEXITY_COLORS[folder.complexity] || COMPLEXITY_COLORS.Medium;

  return (
    <div
      className={`glass rounded-2xl overflow-hidden card-hover glow-hover cursor-pointer animate-slide-up`}
      style={{ animationDelay: `${index * 60}ms` }}
      onClick={() => setIsOpen((v) => !v)}
    >
      {/* ── Card Header ── */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          {/* Icon + Name */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-500/15 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
              <Icon className="w-5 h-5 text-brand-400" />
            </div>
            <div>
              <h3 className="font-mono text-sm font-semibold text-white group-hover:text-brand-300 transition-colors">
                /{folder.name}
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">{folder.fileCount} files · {folder.size}</p>
            </div>
          </div>

          {/* Complexity badge + chevron */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className={`text-xs font-medium px-2 py-0.5 rounded-md border ${complexityClass}`}>
              {folder.complexity}
            </span>
            <svg
              className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Summary Description */}
        <p className="text-xs text-gray-400 mt-3 leading-relaxed line-clamp-2">{folder.description}</p>

        {/* Tech tags */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {folder.techTags.map((tag) => (
            <span
              key={tag}
              className="text-xs font-mono px-2 py-0.5 rounded-md bg-surface-900/80 text-gray-400 border border-white/5"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* ── Expandable Details ── */}
      <div className={`folder-details ${isOpen ? 'open' : ''}`}>
        <div className="folder-details-inner">
          <div className="px-5 pb-5 pt-0 border-t border-white/5">
            <div className="pt-4 space-y-3">
              {/* Purpose */}
              <div>
                <p className="text-xs font-semibold text-brand-400 uppercase tracking-wider mb-1.5">Purpose</p>
                <p className="text-xs text-gray-300 leading-relaxed">{folder.purpose}</p>
              </div>

              {/* Key Files */}
              {folder.keyFiles && (
                <div>
                  <p className="text-xs font-semibold text-brand-400 uppercase tracking-wider mb-1.5">Key Files</p>
                  <ul className="space-y-1">
                    {folder.keyFiles.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-xs font-mono text-gray-400">
                        <span className="w-1 h-1 rounded-full bg-brand-500 flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
