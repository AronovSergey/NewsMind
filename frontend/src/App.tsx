import { useAsk } from './hooks/useAsk';
import { SearchBar } from './components/SearchBar';
import { LoadingSkeleton } from './components/LoadingSkeleton';
import { AnswerCard } from './components/AnswerCard';
import { SourceCard } from './components/SourceCard';

export default function App() {
  const { ask, result, loading, error } = useAsk();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-1 w-full max-w-2xl mx-auto px-4 py-12 sm:py-20">

        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
            NewsMind
          </h1>
          <p className="mt-2 text-gray-500 text-sm">
            Ask anything about today's news
          </p>
        </div>

        <SearchBar onSearch={ask} loading={loading} />

        <div className="mt-8">
          {loading && <LoadingSkeleton />}

          {error && !loading && (
            <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-red-700 text-sm">
              {error}
            </div>
          )}

          {result && !loading && (
            <div className="space-y-4">
              <AnswerCard answer={result.answer} />

              {result.sources.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">
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

      <footer className="py-4 text-center text-xs text-gray-400">
        Powered by live news · Updated hourly
      </footer>
    </div>
  );
}
