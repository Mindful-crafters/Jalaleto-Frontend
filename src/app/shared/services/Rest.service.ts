import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RestService {
  private apiUrl = 'https://localhost:7117/api';

  constructor(private http: HttpClient) {}

  postData(url: any,data : any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${url}`,data);
  }
}
