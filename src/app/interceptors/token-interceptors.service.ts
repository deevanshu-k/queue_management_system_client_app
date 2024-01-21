import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(
    private route: Router,
    private authService: AuthService
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let token = this.authService.getAuthToken();
    request = request.clone({
      setHeaders: {
        Authorization: `${token}`
      }
    });
    console.log("request");
    
    return next.handle(request).pipe(
      catchError((requestError: HttpErrorResponse) => {
        if (requestError && requestError.status === 401) {
          this.authService.removeAuth();
          this.route.navigate(['/home']);
          return next.handle(request);
        }
        return next.handle(request);
      })
    );
  }
}