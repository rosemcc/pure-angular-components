import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { EMPTY, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

import { UoaErrorsConfig, BypassErrorService } from './../services';

@Injectable({
  providedIn: 'root'
})
export class ServerErrorInterceptor implements HttpInterceptor {
  private _ERROR_CODES = this._errorConfigService.serverErrorCodes;

  constructor(private router: Router, private _errorConfigService: UoaErrorsConfig, private _bypass: BypassErrorService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError(error => {
        const bypassObject = this._bypass.getObjectServerErrorBypassList(req.url);
        console.debug('bypassObject in server errors list: ', bypassObject);
        this._bypass.removeErrorServerErrorBypassList(bypassObject);

        if (this._ERROR_CODES.includes(error.status) && !(bypassObject && bypassObject.status.includes(error.status))) {
          console.warn(`ServerErrorInterceptor - HTTP ${error.status}`);
          this.router.navigate(['/error', error.status]);
          return EMPTY;
        }
        return throwError(error);
      })
    );
  }
}
