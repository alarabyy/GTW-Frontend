export interface FeedDetail {
  Id?: number;
  Title: string;
  Summary?: string;
  Content?: string;
  ImageUrl?: string;
  Link?: string;
  Guid?: string;
  Category?: string | number;
  Author?: string; 
  SourceName?: string;
  SourceUrl?: string;
  Credit?: string;
  Language?: string;
  PublishedAt?: string; 
  PubDate?: string;     
  UpdatedAt?: string;
}
