import { Injectable } from "@angular/core";
import { Router, CanActivate, ActivatedRouteSnapshot } from "@angular/router";
import { Location } from '@angular/common';
import { CognitoAuthService } from "./auth.service";


@Injectable({
    providedIn: "root"
})
export class AuthGuardService implements CanActivate {
    constructor(
        private router: Router,
        private authService: CognitoAuthService,
        private location: Location
    ) { }

    canActivate(route: ActivatedRouteSnapshot): boolean {
        if (!this.authService.isAuthenticated()) {
            localStorage.setItem('targetUrl', '/' + route.url);
            this.router.navigate(["login"]);
            return false;
        }

        return true;
    }
}

