import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../environments/environment';
import { AuthResponse, LoginRequest, RegisterRequest } from '../models/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private base = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  login(payload: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.base}/auth/login`, payload)
      .pipe(tap(res => this.handleAuthSuccess(res, payload.rememberMe ?? false)));
  }

  register(payload: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.base}/api/auth/register`, payload)
      .pipe(tap(res => this.handleAuthSuccess(res, payload.rememberMe ?? false)));
  }

  logout() {
    localStorage.removeItem('auth_token');
    sessionStorage.removeItem('auth_token');
    // أي تنظيفات إضافية
  }

  private handleAuthSuccess(res: AuthResponse, remember: boolean) {
    if (!res || !res.token) return;
    // حفظ التوكن في storage بناءً على rememberMe
    if (remember) {
      localStorage.setItem('auth_token', res.token);
    } else {
      sessionStorage.setItem('auth_token', res.token);
    }
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token') ?? sessionStorage.getItem('auth_token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
