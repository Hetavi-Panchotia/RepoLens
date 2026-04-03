import React from 'react';

export default function Button({ 
  children, 
  onClick, 
  loading = false, 
  disabled = false, 
  variant = 'primary',
  className = '',
  id,
  type = 'button',
}) {
  const base =
    'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500/60 select-none';

  const variants = {
    primary:
      'bg-gradient-to-r from-brand-500 to-brand-600 text-white px-7 py-3.5 text-sm hover:from-brand-400 hover:to-brand-500 hover:scale-[1.02] active:scale-[0.98] glow-purple-hover disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100',
    ghost:
      'text-gray-400 hover:text-white px-4 py-2 text-sm hover:bg-white/5',
  };

  return (
    <button
      id={id}
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {loading ? (
        <>
          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          <span>Analyzing...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}
