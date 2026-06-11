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

function getDomain(url: string): string {
  try {
    return new URL(url).hostname.replace('www.', '');
  } catch {
    return url;
  }
}

interface SourceCardProps {
  source: SourceDto;
}

export function SourceCard({ source }: SourceCardProps) {
  const domain = getDomain(source.url);

  return (
    <a
      href={source.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-white rounded-2xl border border-gray-100 shadow-sm p-4
                 hover:border-blue-200 hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 group"
    >
      <p className="text-sm font-medium text-gray-800 line-clamp-2 group-hover:text-blue-600 transition-colors leading-snug">
        {source.title}
      </p>
      <div className="mt-3 flex items-center gap-1.5 text-xs text-gray-400">
        <img
          src={`https://www.google.com/s2/favicons?domain=${domain}&sz=16`}
          alt=""
          width={14}
          height={14}
          className="rounded-sm opacity-70 shrink-0"
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
        <span className="font-medium text-gray-500 truncate">{source.source}</span>
        <span className="shrink-0">·</span>
        <span className="shrink-0">{timeAgo(source.publishedAt)}</span>
        <span className="ml-auto text-blue-400 shrink-0 group-hover:translate-x-0.5 transition-transform">↗</span>
      </div>
    </a>
  );
}
