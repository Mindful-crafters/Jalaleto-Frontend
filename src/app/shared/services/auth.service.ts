// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api';
  private tokenKey = 'auth_token';

  constructor(private http: HttpClient) {}

  authenticate(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/authenticate`, { email, password });
  }

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    return !!token;
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }
}
