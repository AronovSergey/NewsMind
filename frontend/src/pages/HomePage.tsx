import { useAsk } from '../hooks/useAsk';
import { SearchBar } from '../components/SearchBar/SearchBar';
import { LoadingSkeleton } from '../components/LoadingSkeleton/LoadingSkeleton';
import { AnswerCard } from '../components/AnswerCard/AnswerCard';
import { SourceCard } from '../components/SourceCard/SourceCard';

const SUGGESTIONS = [
  'What happened in AI this week?',
  'Latest news on climate change',
  "What's going on in tech today?",
];

export function HomePage() {
  const { ask, result, loading, error } = useAsk();

  return (
    <main className="flex-1 w-full max-w-3xl mx-auto px-4 py-12 sm:py-20">

      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-200 mb-5">
          <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">News</span>
          <span className="text-gray-900">Mind</span>
        </h1>
        <p className="mt-3 text-gray-500 text-base max-w-sm mx-auto">
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
              className="px-4 py-2 text-sm rounded-full bg-white border border-gray-200 text-gray-600
                         hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-all shadow-sm cursor-pointer"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <div className="mt-8">
        {loading && <LoadingSkeleton />}

        {error && !loading && (
          <div className="bg-red-50 border border-red-100 rounded-2xl p-5 text-red-700 text-sm flex items-start gap-3">
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
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3 ml-1">
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
