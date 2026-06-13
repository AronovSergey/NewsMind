import React from 'react';
import type { SourceDto } from '../../types';

interface IProps {
  answer: string;
  sources: SourceDto[];
}

function renderWithCitations(text: string, sources: SourceDto[]): React.ReactNode[] {
  const parts = text.split(/(\[\d+\])/g);
  return parts.map((part, i) => {
    const match = part.match(/^\[(\d+)\]$/);
    if (match) {
      const index = parseInt(match[1], 10) - 1;
      const source = sources[index];
      if (source) {
        return (
          <a
            key={i}
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold rounded-full
                       bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300
                       hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors mx-0.5 align-middle"
            title={source.title}
          >
            {index + 1}
          </a>
        );
      }
    }
    return <React.Fragment key={i}>{part}</React.Fragment>;
  });
}

const AnswerCard: React.FunctionComponent<IProps> = ({ answer, sources }) => {
  return (
    <div className="w-full bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-purple-900/60 shadow-sm dark:shadow-purple-950 overflow-hidden">
      <div className="h-[3px] bg-gradient-to-r from-purple-500 via-violet-500 to-indigo-500" />
      <div className="flex items-center gap-2 px-5 py-3 border-b border-gray-100 dark:border-purple-900/40">
        <svg className="w-3.5 h-3.5 text-purple-500 dark:text-purple-400" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
        </svg>
        <span className="text-xs font-semibold text-purple-700 dark:text-purple-400 uppercase tracking-widest">AI Answer</span>
      </div>
      <div className="p-6">
        <p className="text-gray-800 dark:text-zinc-100 text-base leading-relaxed whitespace-pre-wrap">
          {renderWithCitations(answer, sources)}
        </p>
      </div>
    </div>
  );
}

export default AnswerCard;
