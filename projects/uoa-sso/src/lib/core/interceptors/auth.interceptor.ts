import { Router } from '@angular/router';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, from, EMPTY, throwError } from 'rxjs';

import { CognitoConfig } from '../services';
import { AuthService } from '../services/auth.service';
import { catchError } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private cognitoConfig: CognitoConfig) {}

  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.checkTokenType(req, this.cognitoConfig.bearerTokenUrlFilter)) {
      return from(this.handleAccessToken(req, next));
      // return from(this.handleAccessToken(req, next)).pipe(
      //   catchError(error => {
      //     console.warn(`auth Interceptor - HTTP ${error}`);
      //     //if (error.status == 400)
      //     {
      //       this.authService.navigateToAuthUrl();
      //       return EMPTY;
      //     }
      //     return throwError(error);
      //   })
      // );
    }
    return next.handle(req);
  }

  private async handleAccessToken(req: HttpRequest<any>, next: HttpHandler) {
    const token = 'Bearer ' + (await this.authService.obtainValidAccessToken());
    const newReq = this.appendAuthHeader(req, token);
    return next.handle(newReq).toPromise();
  }

  private appendAuthHeader(req: HttpRequest<any>, formattedToken: string) {
    const headers = req.headers.append('Authorization', formattedToken);
    return req.clone({ headers });
  }

  private checkTokenType(req: HttpRequest<any>, tokenFilters: string[]): boolean {
    let result = false;
    tokenFilters.forEach(keyWord => {
      if (req.url.includes(keyWord)) {
        result = true;
      }
    });
    return result;
  }
}
