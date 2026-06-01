import { useState, type FormEvent } from 'react';

interface SearchBarProps {
  onSearch: (question: string) => void;
  loading: boolean;
}

export function SearchBar({ onSearch, loading }: SearchBarProps) {
  const [value, setValue] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (trimmed) onSearch(trimmed);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Ask anything about today's news..."
          disabled={loading}
          className="flex-1 px-4 py-3 text-base rounded-xl border border-gray-200 shadow-sm
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     disabled:opacity-50 disabled:cursor-not-allowed bg-white"
        />
        <button
          type="submit"
          disabled={loading || !value.trim()}
          className="px-6 py-3 bg-blue-600 text-white font-medium rounded-xl shadow-sm
                     hover:bg-blue-700 active:bg-blue-800 transition-colors
                     disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
        >
          {loading ? 'Searching…' : 'Ask'}
        </button>
      </div>
    </form>
  );
}
