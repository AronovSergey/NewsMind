export interface FetchRunSource {
  sourceName: string;
  fetched: number;
  newArticles: number;
}

export interface FetchRun {
  id: string;
  startedAt: string;
  completedAt: string | null;
  totalFetched: number;
  totalNew: number;
  sources: FetchRunSource[];
}

export interface FetchRunPage {
  content: FetchRun[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface SourceDto {
  title: string;
  url: string;
  source: string;
  publishedAt: string | null;
}

export interface QueryResponse {
  answer: string;
  sources: SourceDto[];
}
