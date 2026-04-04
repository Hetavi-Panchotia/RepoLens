import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, ArrowRight, Zap, Database, Globe, Play, Info, Code2, Layers } from 'lucide-react';

export default function RepoFlowchart({ analysis }) {
  const [selectedNode, setSelectedNode] = useState(null);

  const tree = useMemo(() => analysis?.structure?.tree || [], [analysis]);

  // Intelligent Layer Detection
  const detectedNodes = useMemo(() => {
    const findPaths = (patterns) => 
      tree.filter(item => patterns.some(p => item.path.toLowerCase().includes(p)))
          .slice(0, 5)
          .map(i => i.path);

    const nodes = [
      {
        id: 'entry',
        label: 'Entry Point',
        icon: Play,
        color: 'brand',
        glow: 'shadow-brand-500/20',
        paths: findPaths(['index.', 'main.', 'app.', 'server.js', 'app.py']),
        desc: 'The initial execution point where the application lifecycle begins.'
      },
      {
        id: 'router',
        label: 'Routing Layer',
        icon: Globe,
        color: 'sky',
        glow: 'shadow-sky-500/20',
        paths: findPaths(['route', 'pages', 'navigation', 'router', 'screens']),
        desc: 'Handles navigation, URL mapping, and page transitions.'
      },
      {
        id: 'logic',
        label: 'Business Logic',
        icon: Zap,
        color: 'indigo',
        glow: 'shadow-indigo-500/20',
        paths: findPaths(['service', 'hook', 'logic', 'store', 'action', 'util', 'controller']),
        desc: 'The core engine containing application rules and state management.'
      },
      {
        id: 'data',
        label: 'Data / API',
        icon: Database,
        color: 'pink',
        glow: 'shadow-pink-500/20',
        paths: findPaths(['api', 'model', 'db', 'database', 'schema', 'repo']),
        desc: 'Manages external communication, persistence, and data models.'
      }
    ];

    return nodes.map(n => ({
      ...n,
      active: n.paths.length > 0
    }));
  }, [tree]);

  const getColorClasses = (color, active) => {
    const base = active ? 'opacity-100' : 'opacity-40 grayscale-[0.5]';
    const mapping = {
      brand: `border-brand-500/30 text-brand-400 group-hover:border-brand-500/60 ${active ? 'shadow-brand-500/10' : ''}`,
      sky: `border-sky-500/30 text-sky-400 group-hover:border-sky-500/60 ${active ? 'shadow-sky-500/10' : ''}`,
      indigo: `border-indigo-500/30 text-indigo-400 group-hover:border-indigo-500/60 ${active ? 'shadow-indigo-500/10' : ''}`,
      pink: `border-pink-500/30 text-pink-400 group-hover:border-pink-500/60 ${active ? 'shadow-pink-500/10' : ''}`
    };
    return `${base} ${mapping[color] || ''}`;
  };

  return (
    <div className="relative p-10 glass rounded-[2.5rem] overflow-hidden min-h-[450px] flex flex-col items-center justify-center border border-white/5">
      {/* ── Background Aesthetics ── */}
      <div className="absolute inset-0 bg-grid opacity-[0.03] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-brand-500/5 blur-[120px] pointer-events-none rounded-full" />
      
      <div className="relative z-10 flex flex-wrap items-center justify-center gap-6 md:gap-10 w-full max-w-5xl">
        {detectedNodes.map((node, index) => (
          <React.Fragment key={node.id}>
            <motion.div
              layoutId={node.id}
              onClick={() => setSelectedNode(node)}
              whileHover={node.active ? { scale: 1.05, y: -8 } : {}}
              whileTap={node.active ? { scale: 0.95 } : {}}
              className={`relative cursor-pointer group flex flex-col items-center gap-4 p-8 rounded-3xl bg-slate-900/40 backdrop-blur-xl border transition-all duration-500 min-w-[180px] ${getColorClasses(node.color, node.active)}`}
            >
              {/* Active Glow Pulse */}
              {node.active && (
                <div className={`absolute inset-0 rounded-3xl opacity-10 blur-xl animate-pulse-slow ${
                  node.color === 'brand' ? 'bg-brand-500' : 
                  node.color === 'sky' ? 'bg-sky-500' : 
                  node.color === 'indigo' ? 'bg-indigo-500' : 'bg-pink-500'
                }`} />
              )}

              <div className={`w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform duration-500 shadow-inner`}>
                <node.icon className="w-7 h-7 drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]" />
              </div>
              
              <div className="text-center">
                <span className="block font-black text-white text-sm uppercase tracking-widest">{node.label}</span>
                <span className="text-[10px] font-bold opacity-40 uppercase tracking-tighter">
                  {node.active ? `Found ${node.paths.length} Key Paths` : 'Layer Not Detected'}
                </span>
              </div>
            </motion.div>

            {index < detectedNodes.length - 1 && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                className="hidden lg:block h-px w-8 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
              />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Info Overlay Details */}
      <AnimatePresence mode="wait">
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-20 flex items-center justify-center p-6 bg-slate-950/60 backdrop-blur-md"
            onClick={() => setSelectedNode(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              className="bg-slate-900 border border-white/10 rounded-[2.5rem] p-10 max-w-xl shadow-2xl relative overflow-hidden group/modal"
              onClick={(e) => e.stopPropagation()}
            >
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${
                   selectedNode.color === 'brand' ? 'from-brand-500' : 
                   selectedNode.color === 'sky' ? 'from-sky-500' : 
                   selectedNode.color === 'indigo' ? 'from-indigo-500' : 'from-pink-500'
              } to-transparent opacity-50`} />

              <button 
                onClick={() => setSelectedNode(null)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/5 text-gray-500 hover:text-white transition-colors"
              >
                ✕
              </button>

              <div className="flex items-center gap-5 mb-8">
                <div className={`w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10`}>
                  <selectedNode.icon className={`w-8 h-8 ${getColorClasses(selectedNode.color, true)}`} />
                </div>
                <div>
                  <h3 className="text-3xl font-black text-white tracking-tighter uppercase">{selectedNode.label}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <div className={`w-1.5 h-1.5 rounded-full ${selectedNode.active ? 'bg-emerald-500' : 'bg-gray-600'}`} />
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                      {selectedNode.active ? 'Verified Architecture Layer' : 'Muted / Fallback State'}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-gray-400 text-base leading-relaxed mb-8 font-medium">
                {selectedNode.desc}
              </p>
              
              {selectedNode.active && (
                <div className="space-y-3">
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Discovered Key Paths:</span>
                  <div className="grid grid-cols-1 gap-2">
                    {selectedNode.paths.map((path, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5 group/path hover:border-white/10 transition-colors">
                        <Code2 className="w-4 h-4 text-gray-600 group-hover/path:text-brand-400 transition-colors" />
                        <code className="text-xs text-gray-300 font-mono truncate">{path}</code>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {!selectedNode.active && (
                <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10 text-amber-500/80 text-xs font-medium flex items-center gap-3">
                  <Info className="w-4 h-4" />
                  This architectural pattern was not explicitly detected in this repository.
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative mt-12 mb-2 flex items-center gap-2 text-[10px] text-gray-400 font-black uppercase tracking-[0.3em] opacity-60">
        <Layers className="w-3 h-3" /> Architecture Discovery Engine Active
      </div>
    </div>
  );
}
