import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { filter, tap } from 'rxjs/operators';

import { StorageService } from './storage.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor(private authService: AuthService, private route: ActivatedRoute, private storageService: StorageService) {}

  public async isAuthenticated() {
    return await this.authService.isAuthenticated();
  }

  public async alwaysAuthenticated(inboundAuthCode?: string, targetReturnUrl?: string) {
    if (inboundAuthCode) {
      // inbound navigation
      await this.loginSuccess();
    } else {
      // outbound navigation
      this.doLogin(targetReturnUrl);
    }
  }

  public doLogin(targetReturnUrl?: string) {
    this.storageService.setItem('targetUrl', targetReturnUrl);
    this.authService.isAuthenticated().then(authenticated => {
      if (!authenticated) {
        this.authService.navigateToAuthUrl();
      }
    });
  }

  public logout() {
    this.authService.logout();
  }

  public async loginSuccess() {
    await this.route.queryParamMap
      .pipe(
        filter(params => !!params.get('code')),
        tap(param => {
          this.authService.exchangeCodeForTokens(param.get('code'));
          console.log('code exchange happened successfully');
        })
      )
      .toPromise();
  }
}
