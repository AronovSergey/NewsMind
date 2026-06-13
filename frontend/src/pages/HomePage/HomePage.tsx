import React from 'react';
import { useAsk } from '../../api/useAsk';
import SearchBar from '../../components/SearchBar/SearchBar';
import LoadingSkeleton from '../../components/LoadingSkeleton/LoadingSkeleton';
import AnswerCard from '../../components/AnswerCard/AnswerCard';
import SourceCard from '../../components/SourceCard/SourceCard';
import Logo from '../../components/Logo/Logo';

const SUGGESTIONS = [
  { text: 'What happened in AI this week?',  icon: '🧠' },
  { text: 'Latest news on climate change',   icon: '🌍' },
  { text: "What's going on in tech today?",  icon: '🚀' },
];

const HomePage: React.FunctionComponent = () => {
  const { ask, result, loading, error } = useAsk();

  return (
    <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-20 relative">
      <div className="hidden dark:block pointer-events-none fixed top-0 inset-x-0 h-[60vh] -z-10 overflow-hidden">
        <div className="absolute -top-1/4 left-1/2 -translate-x-1/2 w-[110vw] h-full rounded-[50%] blur-[180px] bg-purple-500/0 dark:bg-purple-600/[0.06]" />
        <div className="absolute -top-1/3 left-1/2 -translate-x-[40%] w-[70vw] h-3/4 rounded-[50%] blur-[140px] bg-violet-500/0 dark:bg-violet-400/[0.03]" />
      </div>

      <div className="text-center mb-10">
        <h1 className="mb-2">
          <Logo size="lg" />
        </h1>
        <p className="mt-3 text-gray-500 dark:text-zinc-400 text-base">
          Ask anything. Get sourced answers from today's news.
        </p>
        <div className="mt-2.5 flex items-center justify-center gap-1.5 text-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
          <span className="font-medium text-emerald-600 dark:text-emerald-400">Live</span>
          <span className="text-gray-300 dark:text-zinc-600">·</span>
          <span className="text-gray-400 dark:text-zinc-500">Updated hourly</span>
        </div>
      </div>

      <SearchBar onSearch={ask} loading={loading} />

      {!result && !loading && !error && (
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s.text}
              onClick={() => ask(s.text)}
              className="flex items-center gap-2 px-4 py-2 text-sm rounded-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800
                         text-gray-600 dark:text-zinc-300
                         hover:border-purple-300 dark:hover:border-purple-600 hover:text-purple-700 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20
                         transition-all shadow-sm cursor-pointer"
            >
              <span className="text-sm leading-none">{s.icon}</span>
              {s.text}
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
          <div className="space-y-5 nm-fade-up">
            <AnswerCard answer={result.answer} />

            {result.sources.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-3 ml-1">
                  Sources
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {result.sources.slice(0, 3).map((source, i) => (
                    <div key={source.url} className="nm-fade-up" style={{ animationDelay: `${i * 0.07}s` }}>
                      <SourceCard source={source} />
                    </div>
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
