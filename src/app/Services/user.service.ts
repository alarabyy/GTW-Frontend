import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

export interface User {
  id: number;
  email: string;
  name: string;
}

export interface UserResponse {
  items: User[];
  pageCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = `${environment.apiBaseUrl}`;

  constructor(private http: HttpClient) {}

  // 🟢 Get all users
  getAllUsers(page = 1, itemsPerPage = 20): Observable<UserResponse> {
    const token = localStorage.getItem('auth_token') ?? sessionStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'accept': 'application/json'
    });

    return this.http.get<UserResponse>(`${this.baseUrl}/users?page=${page}&itemsPerPage=${itemsPerPage}`, { headers });
  }

  // 🔵 Get user by id
  getUserById(id: number): Observable<any> {
    const token = localStorage.getItem('auth_token') ?? sessionStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'accept': 'application/json'
    });

    return this.http.get(`${this.baseUrl}/user/${id}`, { headers });
  }
  
updateUser(id: number, payload: { name: string; email: string }) {
  const token = localStorage.getItem('auth_token') ?? sessionStorage.getItem('auth_token');
  const headers = { 'Authorization': `Bearer ${token}`, 'accept': 'application/json', 'Content-Type': 'application/json' };
  return this.http.put(`${this.baseUrl}/user/${id}`, payload, { headers });
}

  // 🔴 Delete user by id
  deleteUser(id: number): Observable<any> {
    const token = localStorage.getItem('auth_token') ?? sessionStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'accept': 'application/json'
    });

    return this.http.delete(`${this.baseUrl}/user/${id}`, { headers });
  }
}
