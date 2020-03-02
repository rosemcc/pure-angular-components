import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from './auth.service';
import { StorageService } from './storage.service';

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
        this.activatedRoute.queryParams.subscribe(async params => {
            // if (params['error_description']) {
            //   this.router.navigate(['/401'], { queryParams: { error: params['error_description'] } });
            // }
    
            // if (params['code']) {

            //     // inbound navigation
            //     let codeVerifier = await this.storageService.getItem('codeVerifier');
            //     await this.exchangeCodeForToken(params['code'], codeVerifier);
            //     console.log('Got a code. Going back to target');
            //     this.router.createUrlTree([this.storageService.getItem('targetUrl')]);

            // } else {

            //     // outbound navigation
            //     this.storageService.setItem('codeVerifier', this.authService.codeChallenge.codeVerifier);
            //     window.open(this.authService.oAuth2Urls.authorizeUrl, '_self');
            // }
        });
    }
        
}