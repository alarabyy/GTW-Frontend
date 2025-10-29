import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FeedService {
  private baseUrl = `${environment.apiBaseUrl}/feeds`;

  constructor(private http: HttpClient) {}

  /** Get all feeds */
  getAllFeeds(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  /** Get feed by ID */
  getFeedById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  /** Get feeds by category and optionally by source */
  getFeedsByCategory(category: string, sourceKeys?: string[]): Observable<any[]> {
    return this.getAllFeeds().pipe(
      map(feeds => feeds.filter(feed => 
        feed.Category?.toLowerCase() === category.toLowerCase() &&
        (!sourceKeys || sourceKeys.length === 0 || sourceKeys.includes(feed.SourceKey))
      ))
    );
  }

  /** Frontend pagination by category */
  getPaginatedFeedsByCategory(category: string, pageNumber: number, pageSize: number, sourceKeys?: string[]): Observable<any[]> {
    return this.getFeedsByCategory(category, sourceKeys).pipe(
      map(feeds => {
        const start = (pageNumber - 1) * pageSize;
        return feeds.slice(start, start + pageSize);
      })
    );
  }
}
