// src/app/Services/feed.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FeedService {
  private baseUrl = `${environment.apiBaseUrl}/feeds`; // ✅ رابط API الرئيسي

  constructor(private http: HttpClient) {}

  /** 🔹 Get all feeds */
  getAllFeeds(): Observable<any> {
    return this.http.get(this.baseUrl);
  }

  /** 🔹 Get feed by ID */
  getFeedById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }
}
