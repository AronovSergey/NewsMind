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
