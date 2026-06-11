import React from 'react';
import { useAsk } from '../../hooks/useAsk';
import SearchBar from '../../components/SearchBar/SearchBar';
import LoadingSkeleton from '../../components/LoadingSkeleton/LoadingSkeleton';
import AnswerCard from '../../components/AnswerCard/AnswerCard';
import SourceCard from '../../components/SourceCard/SourceCard';

const SUGGESTIONS = [
  'What happened in AI this week?',
  'Latest news on climate change',
  "What's going on in tech today?",
];

const HomePage: React.FunctionComponent = () => {
  const { ask, result, loading, error } = useAsk();

  return (
    <main className="flex-1 w-full max-w-3xl mx-auto px-4 py-12 sm:py-20">

      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-purple-700 shadow-md shadow-purple-200 dark:shadow-purple-900/40 mb-5">
          <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 dark:text-white">
          NewsMind
        </h1>
        <p className="mt-3 text-gray-500 dark:text-zinc-400 text-base max-w-sm mx-auto">
          Ask anything. Get sourced answers from today's news.
        </p>
      </div>

      <SearchBar onSearch={ask} loading={loading} />

      {!result && !loading && !error && (
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => ask(s)}
              className="px-4 py-2 text-sm rounded-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800
                         text-gray-600 dark:text-zinc-300
                         hover:border-purple-300 dark:hover:border-purple-600 hover:text-purple-700 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20
                         transition-all shadow-sm cursor-pointer"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <div className="mt-8">
        {loading && <LoadingSkeleton />}

        {error && !loading && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/40 rounded-2xl p-5 text-red-700 dark:text-red-400 text-sm flex items-start gap-3">
            <svg className="w-4 h-4 text-red-400 mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {result && !loading && (
          <div className="space-y-5">
            <AnswerCard answer={result.answer} />

            {result.sources.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-3 ml-1">
                  Sources
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {result.sources.slice(0, 3).map((source) => (
                    <SourceCard key={source.url} source={source} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

export default HomePage;
