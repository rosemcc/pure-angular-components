import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable, from } from 'rxjs';

import { CognitoConfigService } from '../services/cognito-config.service';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private authService: AuthService;
  constructor(private _injector: Injector, private cognitoConfig: CognitoConfigService) {}

  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.checkTokenType(req, this.cognitoConfig.bearerTokenUrlFilter)) {
      return from(this.handleAccessToken(req, next));
    }
    return next.handle(req);
  }

  private async handleAccessToken(req: HttpRequest<any>, next: HttpHandler) {
    this.authService = this._injector.get(AuthService);
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
    tokenFilters.forEach((keyWord) => {
      if (req.url.includes(keyWord)) {
        result = true;
      }
    });
    return result;
  }
}
