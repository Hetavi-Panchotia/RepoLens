import React from 'react';
import ReactMarkdown from 'react-markdown';
import { AlertCircle, FileCode, FolderOpen, Clock } from 'lucide-react';

const FileHighlight = ({ children }) => {
  // Handle children as an array or single item
  const childrenArray = React.Children.toArray(children);
  
  // Regex to match file paths and folder names with extensions or specific structures
  // Matches: path/to/file.ext, file.ext, folder/
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
                    className="px-1.5 py-0.5 rounded-md bg-brand-500/10 border border-brand-500/20 text-brand-300 font-mono text-[0.85em] inline-flex items-center gap-1 group/file cursor-help"
                    title="File reference"
                  >
                    <FileCode className="w-3 h-3 opacity-70 group-hover/file:opacity-100 transition-opacity" />
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
    <div className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse animate-slide-in-right' : 'flex-row animate-slide-in-left'}`}>
      {/* Avatar */}
      <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-[10px] font-bold border transition-all duration-300 shadow-lg ${
        isUser 
          ? 'bg-slate-800 border-white/10 text-gray-400 group-hover:border-brand-500/30' 
          : 'bg-gradient-to-br from-brand-500 to-brand-600 border-brand-400/30 text-white shadow-brand-500/20'
      }`}>
        {isUser ? 'YOU' : 'AI'}
      </div>

      {/* Bubble */}
      <div className={`group relative max-w-[85%] sm:max-w-[75%] flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
        <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm transition-all duration-300 ${
          isUser
            ? 'bg-brand-600 text-white rounded-tr-none border border-brand-500/50 shadow-brand-500/10'
            : 'bg-slate-900/80 backdrop-blur-md border border-white/5 text-gray-200 rounded-tl-none hover:border-white/10'
        }`}>
          <div className="prose prose-invert prose-sm max-w-none">
            <ReactMarkdown
              components={{
                p: ({ children }) => <div className="mb-3 last:mb-0"><FileHighlight>{children}</FileHighlight></div>,
                li: ({ children }) => <li className="marker:text-brand-400"><FileHighlight>{children}</FileHighlight></li>,
                code: ({ node, inline, className, children, ...props }) => {
                  return inline ? (
                    <code className="bg-slate-950/50 px-1.5 py-0.5 rounded border border-white/5 font-mono text-brand-300" {...props}>
                      {children}
                    </code>
                  ) : (
                    <pre className="bg-slate-950 p-3 rounded-xl border border-white/5 my-2 overflow-x-auto font-mono text-xs text-brand-200">
                      <code {...props}>{children}</code>
                    </pre>
                  );
                }
              }}
            >
              {message.text}
            </ReactMarkdown>
          </div>
        </div>

        {/* Timestamp */}
        <div className={`flex items-center gap-1.5 mt-1.5 px-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${isUser ? 'flex-row-reverse' : ''}`}>
          <Clock className="w-3 h-3 text-gray-600" />
          <span className="text-[10px] text-gray-600 font-medium uppercase tracking-wider">{timestamp}</span>
        </div>
      </div>
    </div>
  );
}
