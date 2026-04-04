import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';
import { FileCode, Clock, User, Bot, Sparkles, Copy, Check, Terminal } from 'lucide-react';

const CopyButton = ({ text }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button 
      onClick={handleCopy}
      className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-white hover:bg-white/10 transition-all active:scale-95"
    >
      {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
};

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
      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-2xl transition-all duration-500 relative z-10 ${
        isUser 
          ? 'bg-slate-900 border border-white/10 text-gray-400' 
          : 'bg-premium-gradient border border-brand-400/30 text-white shadow-brand-500/20'
      }`}>
        {isUser ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
        {!isUser && (
           <div className="absolute -inset-1 bg-brand-500/20 blur-md rounded-full -z-10 animate-pulse-slow" />
        )}
      </div>

      {/* Bubble Container */}
      <div className={`group relative max-w-[85%] sm:max-w-[80%] flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
        <div className={`relative px-6 py-5 text-[14px] leading-relaxed shadow-sm transition-all duration-300 rounded-[2rem] overflow-hidden ${
          isUser
            ? 'bg-brand-500/10 text-white rounded-tr-none border border-brand-500/20'
            : 'bg-slate-900/40 backdrop-blur-xl border border-white/5 text-gray-200 rounded-tl-none group-hover:border-white/10'
        }`}>
          {/* Neon Glow Accent (AI only) */}
          {!isUser && (
             <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-brand-500 to-brand-600 shadow-[2px_0_10px_rgba(139,92,246,0.3)]" />
          )}

          <div className="prose prose-invert prose-sm max-w-none relative z-10">
            <ReactMarkdown
              components={{
                p: ({ children }) => <div className="mb-4 last:mb-0 text-gray-300 font-medium tracking-tight"><FileHighlight>{children}</FileHighlight></div>,
                li: ({ children }) => <li className="marker:text-brand-400 mb-2 last:mb-0"><FileHighlight>{children}</FileHighlight></li>,
                code: ({ node, inline, className, children, ...props }) => {
                  const match = /language-(\w+)/.exec(className || '');
                  const codeContent = String(children).replace(/\n$/, '');
                  
                  return inline ? (
                    <code className="bg-slate-950/70 px-1.5 py-0.5 rounded-md border border-white/10 font-mono text-brand-300 text-[0.9em]" {...props}>
                      {children}
                    </code>
                  ) : (
                    <div className="my-6 rounded-2xl bg-black/40 border border-white/10 overflow-hidden group/code overflow-visible">
                      <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/5 backdrop-blur-md">
                        <div className="flex items-center gap-2">
                           <Terminal className="w-3.5 h-3.5 text-brand-400" />
                           <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">{match ? match[1] : 'Code'}</span>
                        </div>
                        <CopyButton text={codeContent} />
                      </div>
                      <pre className="p-5 font-mono text-xs leading-relaxed text-brand-100/90 overflow-x-auto custom-scrollbar bg-slate-950/20">
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

        {/* Timestamp & Meta */}
        <div className={`flex items-center gap-4 mt-2.5 px-2 transition-all duration-300 ${isUser ? 'flex-row-reverse' : ''}`}>
           <div className="flex items-center gap-1.5 opacity-40 group-hover:opacity-100 transition-opacity">
              <Clock className="w-3 h-3 text-gray-600" />
              <span className="text-[10px] text-gray-500 font-black uppercase tracking-[0.1em]">{timestamp}</span>
           </div>
           
           {!isUser && (
             <div className="flex items-center gap-1.5 text-[10px] font-black text-brand-400/40 uppercase tracking-[0.15em] group-hover:opacity-100 group-hover:text-brand-400 transition-all cursor-default">
                <Sparkles className="w-3 h-3" /> VERIFIED AI
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
