import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

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
          if (this.ERROR_CODES.includes(error.status)) {
            console.warn(`ClientErrorInterceptor - HTTP ${error.status}`);
            return this.router.navigate(['/app-error', error.status]);
          }
        }
      )
    );
  }
}
