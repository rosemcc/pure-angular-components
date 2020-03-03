import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from './auth.service';
import { StorageService } from './storage.service';
import { filter } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class LoginService {

    constructor(
        private router: Router,
        private authService: AuthService,
        private storageService: StorageService)
    {
    }

    public async isAuthenticated() {
        return this.authService.isAuthenticated();
    }

    public async doWebLogin(inboundAuthCode?: string) {
        if (inboundAuthCode) {

            // inbound navigation
            const codeVerifier = await this.storageService.getItem('codeVerifier');
            (await this.authService.exchangeCodeForTokens(inboundAuthCode, codeVerifier)).subscribe(async (res) => {
                const targetRoute = await this.storageService.getItem('targetUrl');
                this.router.navigate([targetRoute]);
            });

        } else {

            // outbound navigation
            if (!(await this.authService.isAuthenticated())) {
                this.authService.navigateToAuthUrl();
            }
        }
    }
}