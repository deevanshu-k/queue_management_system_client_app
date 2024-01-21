import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  getAuthToken(): string {
    return String(localStorage.getItem('queue-token'));
  }

  removeAuth() {
    localStorage.removeItem("queue-token");
  }

  authQueueManager(
    id: string,
    password: string
  ): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(
      environment.server + '/api/auth/queue/manager',
      {
        queueId: id,
        password: password,
      }
    );
  }
}
