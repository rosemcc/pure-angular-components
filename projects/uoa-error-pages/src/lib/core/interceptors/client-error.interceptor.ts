import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

// TODO I don't like this interceptor :D 403 makes sense, but 400 not really
@Injectable({
  providedIn: 'root'
})
export class ClientErrorInterceptor implements HttpInterceptor {
  readonly ERROR_CODES = [400, 401, 403, 404];

  constructor(private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      tap(
        res => {},
        error => {
          if (this.ERROR_CODES.includes(error.status) && (!error.error || error.error.name !== 'pdf.invalid')) {
            console.warn(`ClientErrorInterceptor - HTTP ${error.status}`);
            //this._navService.gotoApplicationErrorPage(error.status);
            return this.router.navigate(['/error', error.status]);
          }
        }
      )
    );
  }
}
