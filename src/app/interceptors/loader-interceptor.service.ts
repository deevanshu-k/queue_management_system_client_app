import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, finalize } from 'rxjs';
import { HttpLoaderService } from '../services/http-loader.service';

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {

  constructor(
    private httpLoaderService: HttpLoaderService
  ) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    this.httpLoaderService.show();
    return next.handle(request).pipe(
      finalize(() => this.httpLoaderService.hide())
    );
  }
}