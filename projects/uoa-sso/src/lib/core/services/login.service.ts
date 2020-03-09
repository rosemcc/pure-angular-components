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

  public async isAuthenticated(): Promise<boolean> {
    return await this.authService.isAuthenticated();
  }

  public async doLogin(targetReturnUrl?: string): Promise<void> {
    this.storageService.setItem('targetUrl', targetReturnUrl);
    await this.authService.isAuthenticated().then(authenticated => {
      if (!authenticated) {
        this.authService.navigateToAuthUrl();
      }
    });
  }

  public async loginSuccess(): Promise<void> {
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

  public logout(): void {
    this.authService.logout();
  }
}
