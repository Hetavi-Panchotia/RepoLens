import React from 'react';

export function Skeleton({ className }) {
  return (
    <div className={`skeleton rounded-lg ${className}`} />
  );
}

export function ArchitectureSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="bg-slate-900 border border-white/5 p-5 rounded-2xl flex items-center gap-4">
          <Skeleton className="w-12 h-12 rounded-xl" />
          <div className="flex-1">
            <Skeleton className="h-3 w-16 mb-2" />
            <Skeleton className="h-6 w-12" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function TreeSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
        <div key={i} className="flex items-center gap-3 px-3 py-1">
          <Skeleton className="w-4 h-4 rounded" />
          <Skeleton className="w-3 h-3 rounded" />
          <Skeleton className={`h-4 rounded ${i % 2 === 0 ? 'w-32' : 'w-48'}`} />
        </div>
      ))}
    </div>
  );
}
