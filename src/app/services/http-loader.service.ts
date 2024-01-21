import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HttpLoaderService {
  // Contains count of ongoing http request
  httpProcessStack: boolean[] = [];
  // Observable for getting http request status
  isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor() {}

  show() {
    this.httpProcessStack.push(true);
    this.isLoading.next(true);
  }

  hide() {
    this.httpProcessStack.pop();
    if (this.httpProcessStack.length == 0) this.isLoading.next(false);
  }
}
