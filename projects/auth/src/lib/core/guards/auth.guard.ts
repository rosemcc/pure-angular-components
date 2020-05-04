import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { LoginService } from '../services/login.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private _loginService: LoginService) {}
  async canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    await this._loginService.loginSuccess(state);
    return !!(await this._loginService.doLogin(state.url));
  }
}
