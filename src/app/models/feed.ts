export interface Feed {
  Id: number;
  Title: string;
  Link: string;
  Author?: string | null;
  Summary?: string | null;
  Content?: string | null;
  ImageUrl?: string | null;
  Category?: string | null;
  PublishedAt?: string | null; // ISO string
  SourceName?: string | null;
}
