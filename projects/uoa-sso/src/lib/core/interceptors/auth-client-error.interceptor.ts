import { Router } from '@angular/router';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, from, EMPTY, throwError } from 'rxjs';

import { CognitoConfig } from '../services';
import { AuthService } from '../services/auth.service';
import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class AuthClientErrorInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private cognitoConfig: CognitoConfig) {}

  // public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  //   next.handle(req).pipe(
  //     catchError(error => {
  //       console.warn(`auth Interceptor - HTTP ${error}`);
  //       //if (error.status == 400)
  //       {
  //         return this.authService.navigateToAuthUrl();
  //         // return EMPTY;
  //       }
  //       return throwError(error);
  //     })
  //   );
  // }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      tap(
        res => {},
        error => {
          //  if (this.ERROR_CODES.includes(error.status))
          {
            console.warn(`AuthClientErrorInterceptor - HTTP ${error.status}`);
            //  return this.authService.navigateToAuthUrl();
          }
        }
      )
    );
  }
}
