import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
    HttpEvent
} from "@angular/common/http";
import { Injectable } from '@angular/core';
import { Observable } from "rxjs";

import { CognitoAuthService } from "../services/auth.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(
        private authService: CognitoAuthService
    ) {
    }
    intercept(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        if (this.requestRequiresBearerToken(req)) {
            // console.log("Intercepted url :::", req.url);
            let newHeaders = req.headers.append('Authorization', 'Bearer ' + this.authService.getAccessToken());

            return next.handle(req.clone({ headers: newHeaders }));
        }
        else if(this.requestRequiresIdToken(req)) {
            // console.log("Intercepted url :::", req.url);
            let newHeaders = req.headers.append('Authorization', this.authService.getIdToken());

            return next.handle(req.clone({ headers: newHeaders }));
        }
        else {
            return next.handle(req);
        }
    }

    private requestRequiresBearerToken(req: HttpRequest<any>): boolean {
        let result = false;
        ['wsdrupal', 'another-one'].forEach(keyWord => {
            if ((req.url).includes(keyWord)) {
                // console.log(req.url + " includes " + keyWord);
                result = true;
            }
        });
        return result;
    }

    private requestRequiresIdToken(req: HttpRequest<any>): boolean {
        let result = false;
        ['dev-api', 'another-one'].forEach(keyWord => {
            if ((req.url).includes(keyWord)) {
                // console.log(req.url + " includes " + keyWord);
                result = true;
            }
        });
        return result;
    }
}