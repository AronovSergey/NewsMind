import React from 'react';
import type { SourceDto } from '../../types';
import { timeAgo } from '../../utils/timeAgo';

function getDomain(url: string): string {
  try {
    return new URL(url).hostname.replace('www.', '');
  } catch {
    return url;
  }
}

interface IProps {
  source: SourceDto;
}

const SourceCard: React.FunctionComponent<IProps> = ({ source }) => {
  const domain = getDomain(source.url);

  return (
    <a
      href={source.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-purple-900/50 shadow-sm p-4
                 hover:border-purple-300 dark:hover:border-purple-500 hover:shadow-md dark:hover:shadow-purple-950 hover:-translate-y-0.5 transition-all duration-150 group"
    >
      <p className="text-sm font-medium text-gray-800 dark:text-zinc-100 line-clamp-2 group-hover:text-purple-700 dark:group-hover:text-purple-400 transition-colors leading-snug">
        {source.title}
      </p>
      <div className="mt-3 flex items-center gap-1.5 text-xs text-gray-400 dark:text-zinc-500">
        <img
          src={`https://www.google.com/s2/favicons?domain=${domain}&sz=16`}
          alt=""
          width={14}
          height={14}
          className="rounded-sm opacity-70 shrink-0"
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
        <span className="font-medium text-gray-500 dark:text-zinc-400 truncate">{source.source}</span>
        <span className="shrink-0">·</span>
        <span className="shrink-0">{timeAgo(source.publishedAt)}</span>
        <span className="ml-auto text-purple-400 dark:text-purple-500 shrink-0 group-hover:translate-x-0.5 transition-transform">↗</span>
      </div>
    </a>
  );
}

export default SourceCard;
