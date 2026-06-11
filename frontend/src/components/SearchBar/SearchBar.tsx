import React, { useState, type FormEvent } from 'react';

interface IProps {
  onSearch: (question: string) => void;
  loading: boolean;
}

const SearchBar: React.FunctionComponent<IProps> = ({ onSearch, loading }) => {
  const [value, setValue] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (trimmed) onSearch(trimmed);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className={`flex items-center gap-3 bg-white dark:bg-zinc-900 rounded-2xl border shadow-sm px-4 py-3 transition-all duration-200
                      ${loading
                        ? 'border-gray-200 dark:border-zinc-800'
                        : 'border-gray-200 dark:border-zinc-800 focus-within:border-purple-400 dark:focus-within:border-purple-500 focus-within:shadow-md focus-within:shadow-purple-50 dark:focus-within:shadow-purple-900/20'}`}>
        <svg className="w-5 h-5 text-gray-400 dark:text-zinc-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>

        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Ask anything about today's news..."
          disabled={loading}
          autoFocus
          className="flex-1 text-base text-gray-800 dark:text-zinc-100 placeholder:text-gray-400 dark:placeholder:text-zinc-500
                     bg-transparent focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
        />

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
