import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';

import { LoginService } from '../services/login.service';

@Injectable({
  providedIn: 'root',
})
export class LoginSuccessGuard implements CanActivate {
  constructor(private _loginService: LoginService) {}
  async canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean | UrlTree> {
    return await this._loginService.loginSuccess(state);
  }
}
