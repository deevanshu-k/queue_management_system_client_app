import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Queue } from './viewer-socket.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ManagerService {
  constructor(private http: HttpClient) {}

  getQueueData(): Observable<Queue> {
    return this.http.get<Queue>(environment.server + '/api/queue');
  }

  updateQueueData(data: {
    topic?: string;
    type?: 'INTERNAL' | 'EXTERNAL' | 'INTERVIEW';
    status?: 'PENDING' | 'ONGOING' | 'COMPLETED';
    managername?: string;
    startdate?: string;
    starttime?: string;
  }): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(
      environment.server + '/api/queue',
      data
    );
  }

  updateCandidateData(
    id: string,
    data: {
      candidate_id?: string;
      name?: string;
      status?: boolean;
    }
  ): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(
      environment.server + '/api/candidate/' + id,
      data
    );
  }

  updateMultipleCandidatesData(data: {
    id: string;
    candidate_id?: string;
    name?: string;
    status?: boolean;
    placevalue?: number;
  }[]): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(
      environment.server + '/api/candidate',
      data
    );
  }

  deleteCandidate(candidateId: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(
      environment.server + '/api/candidate/' + candidateId
    );
  }

  addCandidates(
    data: {
      name: string;
      candidate_id: string;
    }[]
  ): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      environment.server + '/api/candidate',
      {
        candidates: data,
      }
    );
  }

  createQueue(data: {
    topic: string;
    type: 'INTERNAL' | 'EXTERNAL' | 'INTERVIEW';
    managername: string;
    startdate: string;
    starttime: string;
    candidates: {
      candidate_id: string;
      name: string;
    }[];
  }): Observable<{
    manager_url: string;
    viewer_url: string;
  }> {
    return this.http.post<{
      manager_url: string;
      viewer_url: string;
    }>(environment.server + '/api/queue', data);
  }
}
