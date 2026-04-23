import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  private apiUrl = 'http://localhost:8080/api/magnifier'; // Adjust if needed

  constructor(private http: HttpClient) {}

  activateMagnifier(): Observable<any> {
    const url = `${this.apiUrl}/activate`;
    return this.http.post(url, {});
  }
}
