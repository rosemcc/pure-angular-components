import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
    HttpEvent
} from "@angular/common/http";
import { Injectable } from '@angular/core';
import { Observable } from "rxjs";

import { CognitoAuthService } from "../services/auth.service";
import { CognitoConfig } from '../services/cognitoconfig';

enum

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(
        private authService: CognitoAuthService,
        private cognitoConfig: CognitoConfig
    ) {
    }
    intercept( req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (this.checkTokenType(req, this.cognitoConfig.bearerTokenUrlFilter)) {
            // console.log("Intercepted url :::", req.url);
            let newHeaders = req.headers.append('Authorization', 'Bearer ' + this.authService.getAccessToken());
           req = req.clone({ headers: newHeaders });
        }
        else if (this.checkTokenType(req, this.cognitoConfig.idTokenUrlFilter)) {
            // console.log("Intercepted url :::", req.url);
            let newHeaders = req.headers.append('Authorization', this.authService.getIdToken());
            req = req.clone({ headers: newHeaders });
        }

        return next.handle(req);
    }

    private checkTokenType(req: HttpRequest<any>, tokenFilters: string[]): boolean {
        let result = false;
        tokenFilters.forEach(keyWord => {
            if ((req.url).includes(keyWord)) {
                result = true;
            }
        });
        return result;
    }

}