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
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private authService: AuthService,
        private storageService: StorageService)
    {
    }

    // public async appLogin() {
    //     this.storageService.setItem('codeVerifier', this.authService.codeChallenge.codeVerifier);

    //     this.inAppBrowserRef = cordova.InAppBrowser.open(authService.oAuth2Urls.authorizeUrl, '_blank', this._mobileParams);

    //     this.inAppBrowserRef.addEventListener("loadstop", async (event: any) => {
    //       if (event && event.url && (event.url).indexOf('?code=') !== -1) {
    //         let code = event.url.slice(event.url.indexOf('?code=') + '?code='.length);

    //         let codeVerifier = localStorage.getItem('codeVerifier');
    //         await this.exchangeCodeForToken(code, codeVerifier);

    //         // here is your token, now you can close the InAppBrowser and return to the previous location
    //         this.inAppBrowserRef.close();
    //         console.log("closing inappbrowser");

    //         this.location.back();
    //       }
    //     });
    // }

    public async isAuthenticated() {
        return this.authService.isAuthenticated();
    }

    public async doWebLogin() {

        const code = new URL(window.location.href).searchParams.get('code');

            if (code) {

                // inbound navigation
                const codeVerifier = await this.storageService.getItem('codeVerifier');
                this.authService.exchangeCodeForTokens(code, codeVerifier).subscribe((res) => {
                    this.router.navigate([this.storageService.getItem('targetUrl')]);
                });

                // .then((res) => {
                //     console.log('Got a code. Going back to target');
                //     //this.router.navigate([this.storageService.getItem('targetUrl')]);
                // }, (err) => {
                //     console.error(err)
                // });
    
            } else {
    
                // outbound navigation
                if (!(await this.authService.isAuthenticated())) {
                    this.storageService.setItem('codeVerifier', this.authService.codeChallenge.codeVerifier);
                    window.open(this.authService.oAuth2Urls.authorizeUrl, '_self');
                }
            }

    }
        
}