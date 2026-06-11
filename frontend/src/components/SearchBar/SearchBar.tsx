import React, { useState, useEffect, type FormEvent } from 'react';

const PLACEHOLDERS = [
  "Ask anything about today's news...",
  "What happened in AI this week?",
  "Latest developments in climate policy?",
  "What's trending in tech today?",
  "Any breaking news this morning?",
];

interface IProps {
  onSearch: (question: string) => void;
  loading: boolean;
}

const SearchBar: React.FunctionComponent<IProps> = ({ onSearch, loading }) => {
  const [value, setValue] = useState('');
  const [focused, setFocused] = useState(false);
  const [phIdx, setPhIdx] = useState(0);
  const [phVisible, setPhVisible] = useState(true);

  useEffect(() => {
    if (value || focused) return;
    const id = setInterval(() => {
      setPhVisible(false);
      setTimeout(() => {
        setPhIdx(i => (i + 1) % PLACEHOLDERS.length);
        setPhVisible(true);
      }, 350);
    }, 3500);
    return () => clearInterval(id);
  }, [value, focused]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (trimmed) onSearch(trimmed);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className={`flex items-center gap-3 bg-white dark:bg-zinc-900 rounded-2xl border shadow-sm px-4 py-3 transition-all duration-200
                      ${loading
                        ? 'border-gray-200 dark:border-purple-900/50'
                        : 'border-gray-200 dark:border-purple-900/50 focus-within:border-purple-400 dark:focus-within:border-purple-400 focus-within:shadow-lg focus-within:shadow-purple-100/60 dark:focus-within:shadow-purple-500/20'}`}>
        <svg className="w-5 h-5 text-gray-400 dark:text-zinc-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>

        <div className="relative flex-1">
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            disabled={loading}
            autoFocus
            className="w-full text-base text-gray-800 dark:text-zinc-100 bg-transparent focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <span
            className="absolute inset-0 flex items-center text-base text-gray-400 dark:text-zinc-500 pointer-events-none select-none transition-opacity duration-350"
            style={{ opacity: value || focused ? 0 : phVisible ? 1 : 0 }}
          >
            {PLACEHOLDERS[phIdx]}
          </span>
        </div>

        <button
          type="submit"
          disabled={loading || !value.trim()}
          aria-label="Ask"
          className="shrink-0 w-9 h-9 flex items-center justify-center rounded-xl
                     bg-purple-700 text-white
                     hover:bg-purple-800 active:bg-purple-900 transition-colors
                     disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          {loading ? (
            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5-5 5M6 12h12" />
            </svg>
          )}
        </button>
      </div>
    </form>
  );
}

export default SearchBar;
