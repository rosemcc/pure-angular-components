import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class LoginService {

    constructor(
        private authService: AuthService
    ) {
    }

    public async isAuthenticated() {
        return this.authService.isAuthenticated();
    }

    public doWebLogin(inboundAuthCode?: string) {
        if (inboundAuthCode) {

            // inbound navigation
            this.authService.exchangeCodeForTokens(inboundAuthCode);

        } else {

            // outbound navigation
            this.authService.isAuthenticated().then(authenticated => {
                if (!authenticated) {
                    this.authService.navigateToAuthUrl();
                }
            });
        }
    }
}