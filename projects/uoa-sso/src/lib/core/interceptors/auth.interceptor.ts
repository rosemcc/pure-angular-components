import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';

import { AuthService, CognitoConfig, StorageService } from '../services';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private cognitoConfig: CognitoConfig,
    private storageService: StorageService,
    private route: Router
  ) {}

  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    // store current url as the last visited URL (for login redirection target)
    this.storageService.setItem('targetUrl', this.route.url);

    if (this.checkTokenType(req, this.cognitoConfig.bearerTokenUrlFilter)) {
      return from(this.handleAccessToken(req, next));
    } else if (this.checkTokenType(req, this.cognitoConfig.idTokenUrlFilter)) {
      return from(this.handleIdToken(req, next));
    }
  }

  private async handleAccessToken(req: HttpRequest<any>, next: HttpHandler) {
    const token = 'Bearer ' + (await this.authService.getAccessToken());
    const newReq = this.appendAuthHeader(req, token);
    return next.handle(newReq).toPromise();
  }

  private async handleIdToken(req: HttpRequest<any>, next: HttpHandler) {
    const token = await this.authService.getIdToken();
    const newReq = this.appendAuthHeader(req, token);
    return next.handle(newReq).toPromise();
  }

  private appendAuthHeader(req: HttpRequest<any>, formattedToken: string) {
    let newHeaders = req.headers.append('Authorization', formattedToken);
    return req.clone({ headers: newHeaders });
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
