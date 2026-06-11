import React from 'react';

const LoadingSkeleton: React.FunctionComponent = () => {
  return (
    <div className="w-full space-y-5 animate-pulse">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden">
        <div className="h-10 bg-purple-50 dark:bg-purple-900/20 border-b border-purple-100 dark:border-purple-800/40" />
        <div className="p-6 space-y-3">
          <div className="h-4 bg-gray-100 dark:bg-zinc-700 rounded-full w-3/4" />
          <div className="h-4 bg-gray-100 dark:bg-zinc-700 rounded-full w-full" />
          <div className="h-4 bg-gray-100 dark:bg-zinc-700 rounded-full w-5/6" />
          <div className="h-4 bg-gray-100 dark:bg-zinc-700 rounded-full w-2/3" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm p-4 space-y-2">
            <div className="h-3 bg-gray-100 dark:bg-zinc-700 rounded-full w-full" />
            <div className="h-3 bg-gray-100 dark:bg-zinc-700 rounded-full w-4/5" />
            <div className="h-3 bg-gray-100 dark:bg-zinc-700 rounded-full w-1/2 mt-3" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default LoadingSkeleton;
