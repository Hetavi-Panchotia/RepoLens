import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, ArrowRight, Zap, Database, Globe, Play } from 'lucide-react';

export default function RepoFlowchart({ analysis }) {
  const [selectedNode, setSelectedNode] = useState(null);

  // Derive logic from analysis summary or structure
  // For demo, we build a "standard" web app flow if not specific
  const flowNodes = [
    { id: 'entry', label: 'Entry Point', icon: Play, desc: 'Entry point of the application', color: 'from-emerald-500 to-teal-600' },
    { id: 'router', label: 'Routing Layer', icon: Globe, desc: 'Handles page transitions and URLs', color: 'from-sky-500 to-blue-600' },
    { id: 'logic', label: 'Business Logic', icon: Zap, desc: 'Core application rules and state', color: 'from-brand-500 to-brand-600' },
    { id: 'data', label: 'Data / API', icon: Database, desc: 'Communication with external services', color: 'from-pink-500 to-rose-600' }
  ];

  return (
    <div className="relative p-8 glass rounded-3xl overflow-hidden min-h-[400px] flex flex-col items-center justify-center">
      <div className="absolute inset-0 bg-surface-glow opacity-50 pointer-events-none" />
      
      <div className="relative z-10 flex flex-wrap items-center justify-center gap-8 md:gap-12 w-full max-w-4xl">
        {flowNodes.map((node, index) => (
          <React.Fragment key={node.id}>
            <motion.div
              layoutId={node.id}
              onClick={() => setSelectedNode(node)}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className={`relative cursor-pointer group flex flex-col items-center gap-3 p-6 rounded-2xl bg-gradient-to-br ${node.color} shadow-xl shadow-black/20 border border-white/20 min-w-[160px]`}
            >
              <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                <node.icon className="w-6 h-6" />
              </div>
              <span className="font-bold text-white tracking-tight">{node.label}</span>
              
              {/* Tooltip hint */}
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-xs px-2 py-1 rounded border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                Learn more
              </div>
            </motion.div>

            {index < flowNodes.length - 1 && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.2 }}
                className="hidden md:block"
              >
                <ArrowRight className="w-6 h-6 text-gray-600 animate-pulse" />
              </motion.div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Info Overlay */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="absolute inset-0 z-20 flex items-center justify-center p-6 bg-slate-950/40 backdrop-blur-sm"
            onClick={() => setSelectedNode(null)}
          >
            <div 
              className="bg-slate-900 border border-white/10 rounded-3xl p-8 max-w-md shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setSelectedNode(null)}
                className="absolute top-4 right-4 text-gray-500 hover:text-white"
              >
                ✕
              </button>
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${selectedNode.color} flex items-center justify-center mb-6`}>
                <selectedNode.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">{selectedNode.label}</h3>
              <p className="text-gray-400 mb-6">{selectedNode.desc}</p>
              
              <div className="p-4 rounded-xl bg-white/5 border border-white/5 italic text-sm text-brand-400">
                "{analysis?.summary?.slice(0, 150) || 'Analyzing repository content'}..."
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute bottom-6 text-xs text-gray-500 font-medium">
        Interactive Architecture Visualization · Click nodes for details
      </div>
    </div>
  );
}
