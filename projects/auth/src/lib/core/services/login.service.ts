import { Injectable } from '@angular/core';
import { Router, RouterStateSnapshot, UrlTree } from '@angular/router';

import { StorageService } from './storage.service';
import { AuthService } from './auth.service';
import { UserInfoDto } from '../interfaces';
import { CognitoConfigService } from './cognito-config.service';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(
    private _authService: AuthService,
    private _storageService: StorageService,
    private _router: Router,
    private _cognitoConfig: CognitoConfigService
  ) {}

  public async isAuthenticated(): Promise<boolean> {
    return !(await this._authService.hasTokenExpired());
  }

  public async doLogin(targetReturnUrl?: string): Promise<boolean> {
    this._storageService.setItem('targetUrl', targetReturnUrl);
    return await this._authService.obtainValidAccessToken();
  }

  /**
   *  It is to handle login success case only to use returned code to get token, not Authentication.
   *  So it should always return true or redirect if there is an error from server.
   */
  async loginSuccess(state: RouterStateSnapshot): Promise<boolean | UrlTree> {
    const code = state.root.queryParamMap.get('code');
    const error = state.root.queryParamMap.get('error');
    if (code) {
      await this._authService.exchangeCodeForTokens(code);
      console.debug('code exchange happened successfully');
    } else if (error) {
      console.debug('error from server');
      return Promise.resolve(this._router.createUrlTree([`${this._cognitoConfig.errorPage}/403`]));
    }
    return Promise.resolve(true);
  }

  public async getUserInfo(): Promise<UserInfoDto> {
    return await this._authService.getUserInfos();
  }

  public logout(): void {
    this._authService.logout();
  }
}
