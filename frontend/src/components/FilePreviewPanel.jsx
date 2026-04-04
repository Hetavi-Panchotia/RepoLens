import React, { useState, useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileCode, Copy, Check, ExternalLink, Loader2 } from 'lucide-react';
import axios from 'axios';

export default function FilePreviewPanel({ isOpen, onClose, filePath, repoInfo }) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && filePath && repoInfo) {
      fetchContent();
    }
  }, [isOpen, filePath, repoInfo]);

  const fetchContent = async () => {
    setLoading(true);
    setError(null);
    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await axios.get(`${API_BASE_URL}/api/files/content`, {
        params: {
          owner: repoInfo.owner,
          repo: repoInfo.repo,
          path: filePath
        }
      });
      setContent(response.data.content);
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Failed to load file content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Determine language based on extension
  const getLanguage = (path) => {
    const ext = path.split('.').pop();
    const map = {
      'js': 'javascript',
      'jsx': 'jsx',
      'ts': 'typescript',
      'tsx': 'tsx',
      'json': 'json',
      'md': 'markdown',
      'css': 'css',
      'html': 'html'
    };
    return map[ext] || 'javascript';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[60]"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-3xl bg-slate-900 border-l border-white/5 z-[70] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-slate-900/50 backdrop-blur-md sticky top-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2 rounded-lg bg-brand-500/10 text-brand-400">
                  <FileCode className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-white truncate">{filePath.split('/').pop()}</h3>
                  <p className="text-[10px] text-gray-500 truncate">{filePath}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
                  title="Copy Code"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
                <a
                  href={`https://github.com/${repoInfo.owner}/${repoInfo.repo}/blob/main/${filePath}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
                  title="View on GitHub"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
                <div className="w-px h-4 bg-white/10 mx-1" />
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto bg-slate-950 p-1 custom-scrollbar">
              {loading ? (
                <div className="h-full flex flex-col items-center justify-center gap-4 text-gray-500">
                  <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
                  <p className="text-sm animate-pulse">Fetching file content...</p>
                </div>
              ) : error ? (
                <div className="h-full flex flex-col items-center justify-center gap-4 text-rose-400 p-8 text-center">
                  <p className="text-sm">{error}</p>
                  <button 
                    onClick={fetchContent}
                    className="px-4 py-2 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-400 hover:bg-brand-500/20 transition-all font-medium text-xs"
                  >
                    Try Again
                  </button>
                </div>
              ) : (
                <SyntaxHighlighter
                  language={getLanguage(filePath)}
                  style={atomDark}
                  customStyle={{
                    margin: 0,
                    padding: '24px',
                    background: 'transparent',
                    fontSize: '13px',
                    lineHeight: '1.6',
                    fontFamily: '"JetBrains Mono", monospace'
                  }}
                  showLineNumbers={true}
                  lineNumberStyle={{ minWidth: '3em', paddingRight: '1em', color: '#475569', textAlign: 'right' }}
                >
                  {content}
                </SyntaxHighlighter>
              )}
            </div>

            {/* Footer Status */}
            <div className="px-6 py-3 border-t border-white/5 bg-slate-900/50 flex justify-between items-center">
              <span className="text-[10px] text-gray-500 font-mono">
                {getLanguage(filePath).toUpperCase()}
              </span>
              <span className="text-[10px] text-gray-500 font-mono">
                {content.split('\n').length} lines
              </span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
