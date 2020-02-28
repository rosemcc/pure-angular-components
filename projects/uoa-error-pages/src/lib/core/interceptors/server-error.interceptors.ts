import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { EMPTY, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
// import { NavigationService } from '../services/navigation.service';

@Injectable({
  providedIn: 'root'
})
export class ServerErrorInterceptor implements HttpInterceptor {
  readonly ERROR_CODES = [500, 501, 502, 503, 504, 505];

  constructor() {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError(error => {
        if (this.ERROR_CODES.includes(error.status)) {
          console.warn(`ServerErrorInterceptor - HTTP ${error.status}`);
          //    this._navService.gotoApplicationErrorPage(error.status);
          return EMPTY;
        }
        return throwError(error);
      })
    );
  }
}
