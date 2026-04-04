import React from 'react';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';
import { AlertCircle, FileCode, FolderOpen, Clock, User, Bot, Sparkles } from 'lucide-react';

const FileHighlight = ({ children }) => {
  const childrenArray = React.Children.toArray(children);
  const regex = /([a-zA-Z0-9\._\-\/]+\/[a-zA-Z0-9\._\-\/]+|[a-zA-Z0-9\._\-]+\.[a-zA-Z0-9]+)/g;
  
  return (
    <>
      {childrenArray.map((child, idx) => {
        if (typeof child !== 'string') return child;
        const parts = child.split(regex);
        return (
          <React.Fragment key={idx}>
            {parts.map((part, i) => {
              if (regex.test(part)) {
                return (
                  <span 
                    key={i} 
                    className="px-1.5 py-0.5 rounded-md bg-brand-500/10 border border-brand-500/20 text-brand-400 font-mono text-[0.85em] inline-flex items-center gap-1 cursor-help"
                  >
                    <FileCode className="w-3 h-3 opacity-70" />
                    {part}
                  </span>
                );
              }
              return part;
            })}
          </React.Fragment>
        );
      })}
    </>
  );
};

export default function ChatBubble({ message }) {
  const isUser = message.role === 'user';
  const timestamp = message.timestamp ? new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';

  return (
    <div className={`flex items-start gap-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg transition-all duration-500 ${
        isUser 
          ? 'bg-slate-800 border-white/10 text-gray-400 rotate-[-5deg] hover:rotate-0' 
          : 'bg-brand-500 border-brand-400/30 text-white shadow-brand-500/20 rotate-[5deg] hover:rotate-0'
      }`}>
        {isUser ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
      </div>

      {/* Bubble */}
      <div className={`group relative max-w-[85%] sm:max-w-[75%] flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
        <div className={`rounded-[1.5rem] px-5 py-4 text-[13px] leading-relaxed shadow-xl transition-all duration-300 ${
          isUser
            ? 'bg-brand-600 text-white rounded-tr-none border border-brand-500/30 shadow-brand-500/10'
            : 'bg-surface-800/80 backdrop-blur-xl border border-white/10 text-gray-200 rounded-tl-none hover:border-white/20'
        }`}>
          <div className="prose prose-invert prose-sm max-w-none">
            <ReactMarkdown
              components={{
                p: ({ children }) => <div className="mb-3 last:mb-0"><FileHighlight>{children}</FileHighlight></div>,
                li: ({ children }) => <li className="marker:text-brand-400"><FileHighlight>{children}</FileHighlight></li>,
                code: ({ node, inline, className, children, ...props }) => {
                  return inline ? (
                    <code className="bg-slate-950/70 px-1.5 py-0.5 rounded-md border border-white/10 font-mono text-brand-300 text-[0.9em]" {...props}>
                      {children}
                    </code>
                  ) : (
                    <div className="relative group/code my-4">
                       <div className="absolute top-2 right-2 opacity-0 group-hover/code:opacity-100 transition-opacity z-10 flex items-center gap-1 bg-slate-900 border border-white/10 px-2 py-1 rounded text-[9px] text-gray-400 font-bold uppercase tracking-widest">
                          <Sparkles className="w-3 h-3 text-brand-400" /> AI Snippet
                       </div>
                       <pre className="bg-slate-950 p-4 rounded-2xl border border-white/10 overflow-x-auto font-mono text-xs text-brand-200 shadow-inner">
                          <code {...props}>{children}</code>
                       </pre>
                    </div>
                  );
                }
              }}
            >
              {message.text}
            </ReactMarkdown>
          </div>
        </div>

        {/* Info Line */}
        <div className={`flex items-center gap-3 mt-2 px-1 transition-all duration-300 ${isUser ? 'flex-row-reverse' : ''}`}>
           <div className="flex items-center gap-1 opacity-40 group-hover:opacity-100 transition-opacity">
              <Clock className="w-2.5 h-2.5 text-gray-600" />
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{timestamp}</span>
           </div>
           
           {!isUser && (
             <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-600 uppercase tracking-widest opacity-40 hover:opacity-100 hover:text-brand-400 transition-all cursor-default">
                <Sparkles className="w-2.5 h-2.5" /> Context-Aware
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
