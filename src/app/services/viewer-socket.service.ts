import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';

export interface Queue {
  id: string;
  topic: string;
  type: string;
  status: 'PENDING' | 'ONGOING' | 'COMPLETED';
  managername: string;
  startdate: string;
  starttime: string;
  candidates: Candidate[];
}

export interface Candidate {
  id: string;
  candidate_id: string;
  name: string;
  status: boolean;
}

export interface UpdateQueue {
  topic?: string;
  type?: string;
  status?: 'PENDING' | 'ONGOING' | 'COMPLETED';
  managername?: string;
  startdate?: string;
  starttime?: string;
}

export interface UpdateCandidate {
  id: string;
  candidate_id?: string;
  name?: string;
  status?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ViewerSocketService {
  constructor(private socket: SocketOne) {
    socket.volatile();
  }

  joinQueue(id: string) {
    this.socket.emit('JOIN QUEUE', { id });
  }

  needQueueFullData(id: string) {
    this.socket.emit('NEED FULL DATA', { id });
  }

  getMessages(): Observable<{
    error?: string;
    success?: string;
    code?: number;
  }> {
    return this.socket.fromEvent<{ error?: string; success?: string }>(
      'MESSAGE'
    );
  }

  getQueueFullData(): Observable<Queue> {
    return this.socket.fromEvent<Queue>('QUEUE FULL DATA');
  }

  getQueueUpdate(): Observable<{
    queue: UpdateQueue;
    candidate: UpdateCandidate;
    count: number[];
  }> {
    return this.socket.fromEvent<{
      queue: UpdateQueue;
      candidate: UpdateCandidate;
      count: number[];
    }>('QUEUE UPDATE');
  }

  connectionSuccess() {
    return this.socket.fromEvent('CONNECTION:SUCCESS');
  }
}

@Injectable()
export class SocketOne extends Socket {
  constructor() {
    super({ url: 'http://192.168.1.3:3000', options: {} });
  }
}
