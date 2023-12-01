import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class RestService {
  private apiUrl = 'https://dev.jalaleto.ir/api';

  constructor(private http: HttpClient, private authService: AuthService) { }

  get customHeaders() {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.authService.getToken(),
    })
  }

  postWithoutHeader<T>(url: any, data: any): Observable<T> {
    return this.http.post<T>(`${this.apiUrl}/${url}`, data);
  }

  post<T>(url: any, data: any): Observable<T> {
    const options = { headers: this.customHeaders };
    return this.http.post<T>(`${this.apiUrl}/${url}`, data, options);
  }
}