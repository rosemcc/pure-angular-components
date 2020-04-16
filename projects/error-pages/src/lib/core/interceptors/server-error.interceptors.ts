import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

import { UoaErrorsConfig, BypassErrorService } from '../services';

@Injectable({
  providedIn: 'root',
})
export class ServerErrorInterceptor implements HttpInterceptor {
  private _ERROR_CODES = this._errorConfigService.serverErrorCodes;

  constructor(private router: Router, private _errorConfigService: UoaErrorsConfig, private _bypass: BypassErrorService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const bypassObject = this._bypass.getObjectServerErrorBypassList(req.url);
    console.debug('bypassObject in server errors list: ', bypassObject);

    return next.handle(req).pipe(
      finalize(() => this._bypass.removeObjectClientErrorBypassList(bypassObject)),
      tap(
        (res) => {},
        (error) => {
          if (this._ERROR_CODES.includes(error.status) && !(bypassObject && bypassObject.status.includes(error.status))) {
            console.warn(`ServerErrorInterceptor - HTTP ${error.status}`);
            return this.router.navigate(['/error', error.status]);
          }
        }
      )
    );
  }
}
