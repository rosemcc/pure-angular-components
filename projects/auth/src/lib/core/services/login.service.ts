import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, tap } from 'rxjs/operators';

import { StorageService } from './storage.service';
import { AuthService } from './auth.service';
import { UserInfoDto } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(
    private _authService: AuthService,
    private _route: ActivatedRoute,
    private _storageService: StorageService,
    private _router: Router
  ) {}

  public async isAuthenticated(): Promise<boolean> {
    return !(await this._authService.hasTokenExpired());
  }

  public async doLogin(targetReturnUrl?: string): Promise<boolean> {
    this._storageService.setItem('targetUrl', targetReturnUrl);
    return await this._authService.obtainValidAccessToken();
  }

  public async loginSuccess(): Promise<void> {
    await this._route.queryParamMap
      .pipe(
        filter((params) => !!params),
        tap(async (param) => {
          if (param.get('code')) {
            await this._authService.exchangeCodeForTokens(param.get('code'));
            console.debug('code exchange happened successfully');
          } else if (param.get('error')) {
            console.debug('error from server');
            this._router.navigate(['error/403']);
          }
        })
      )
      .toPromise();
  }

  public async getUserInfo(): Promise<UserInfoDto> {
    return await this._authService.getUserInfos();
  }

  public logout(): void {
    this._authService.logout();
  }
}
