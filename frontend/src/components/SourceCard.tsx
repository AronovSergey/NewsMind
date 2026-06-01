import type { SourceDto } from '../types';

function timeAgo(publishedAt: string | null): string {
  if (!publishedAt) return 'recently';
  const diff = Date.now() - new Date(publishedAt).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

interface SourceCardProps {
  source: SourceDto;
}

export function SourceCard({ source }: SourceCardProps) {
  return (
    <a
      href={source.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-white rounded-xl border border-gray-100 shadow-sm p-4
                 hover:border-blue-200 hover:shadow-md transition-all group"
    >
      <p className="text-sm font-medium text-gray-800 line-clamp-2 group-hover:text-blue-600 transition-colors">
        {source.title}
      </p>
      <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
        <span className="font-medium text-gray-500">{source.source}</span>
        <span>·</span>
        <span>{timeAgo(source.publishedAt)}</span>
        <span className="ml-auto text-blue-500">↗</span>
      </div>
    </a>
  );
}
