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

        } else {
          console.log("browser platform");
          // if you already have a code 
          
        }
      }
    });
  }

}


