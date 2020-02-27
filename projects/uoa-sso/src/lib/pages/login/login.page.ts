import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { CognitoAuthService } from "../../services/auth.service";
import { Platform } from '@ionic/angular';

import { PkceService } from '../../services/auth.pkce.service';
import { AuthUrlBuilder } from '../../services/auth.urlbuilder.service';
import { CognitoConfig } from '../../interfaces/cognitoconfig';

declare var cordova: any;

@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss'],
})
export class LoginPage {

  private inAppBrowserRef: any;
  private _mobileParams = 'hideurlbar=yes,toolbar=no,clearsessioncache=no,clearcache=no';

  constructor(
    private authService: CognitoAuthService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private platform: Platform,
    private location: Location,
    private cognitoConfig: CognitoConfig,
    private urlBuilder: AuthUrlBuilder,
    private pkceService: PkceService
  ) {
    platform.ready().then(() => {

      // TODO: put all this in the service
      
      if (this.authService.isAuthenticated()) {
        // you should not come to this point by navigating by yourself, so redirect user back
        console.log('Authenticated. Going back');
        this.location.back();
      } else {

        // hybrid means a device running Capacitor or Cordova
        if ((this.platform.is('android') || this.platform.is('hybrid')) && (typeof cordova !== "undefined")) {
          console.log("mobile platform");
          localStorage.clear();
          localStorage.setItem('codeVerifier', authService.codeChallenge.codeVerifier);

          this.inAppBrowserRef = cordova.InAppBrowser.open(authService.oAuth2Urls.authorizeUrl, '_blank', this._mobileParams);

          this.inAppBrowserRef.addEventListener("loadstop", async (event: any) => {
            if (event && event.url && (event.url).indexOf('?code=') !== -1) {
              let code = event.url.slice(event.url.indexOf('?code=') + '?code='.length);

              let codeVerifier = localStorage.getItem('codeVerifier');
              await this.exchangeCodeForToken(code, codeVerifier);

              // here is your token, now you can close the InAppBrowser and return to the previous location
              this.inAppBrowserRef.close();
              console.log("closing inappbrowser");

              this.location.back();
            }
          });
        } else {
          console.log("browser platform");
          // if you already have a code 
          this.activatedRoute.queryParams.subscribe(async params => {
            if (params['error_description']) {
              this.router.navigate(['/401'], { queryParams: { error: params['error_description'] } });
            }

            if (params['code']) {

              let codeVerifier = localStorage.getItem('codeVerifier');

              await this.exchangeCodeForToken(params['code'], codeVerifier);

              console.log('Got a code. Going back to target');
              this.router.navigate([localStorage.getItem('targetUrl')]);

            } else {
              localStorage.setItem('codeVerifier', authService.codeChallenge.codeVerifier);
              window.open(this.authService.oAuth2Urls.authorizeUrl, '_self');
            }
          });
        }
      }
    });
  }


  private exchangeCodeForToken(code, codeVerifier) {
    return new Promise((resolve, reject) => {
      // console.log("exchangeCodeForToken:::code::: ", code);
      if (code && codeVerifier) {
        this.authService.exchangeCodeForTokens(code, codeVerifier)
          .subscribe(
            (res) => {
              this.authService.storeTokens(res);
              // console.log("tokens ::: ", JSON.stringify(res));
              localStorage.removeItem('codeVerifier');
              resolve(true);
            },
            (err) => {
              this.router.navigate(['/401'], { queryParams: { error: err } });
              console.log(err)
            }
          );
      }
    });

  }

}


