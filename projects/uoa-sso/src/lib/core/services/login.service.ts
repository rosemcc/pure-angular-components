import { Injectable } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { filter, tap, skip } from 'rxjs/operators';

import { StorageService } from './storage.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor(private authService: AuthService, private route: ActivatedRoute, private storageService: StorageService) {}

  public async isAuthenticated(): Promise<boolean> {
    return !(await this.authService.hasTokenExpired());
  }

  public async doLogin(targetReturnUrl?: string): Promise<boolean> {
    this.storageService.setItem('targetUrl', targetReturnUrl);
    return await this.authService.obtainValidAccessToken();
  }

  public async loginSuccess(): Promise<void> {
    await this.route.queryParamMap
      .pipe(
        filter(params => !!params),
        tap(param => {
          if (param.get('code')) {
            this.authService.exchangeCodeForTokens(param.get('code'));
            console.log('code exchange happened successfully');
          } else if (param.get('error')) {
            console.log('error from server');
          }
        })
      )
      .toPromise();
  }

  public logout(): void {
    this.authService.logout();
  }
}
