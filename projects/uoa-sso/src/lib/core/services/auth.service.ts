import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { ReplaySubject } from 'rxjs';
import { finalize, filter, take } from 'rxjs/operators';
import { untilDestroyed } from 'ngx-take-until-destroy';

import { Auth2UrlsDto, UserInfoDto } from '../interfaces';
import { StorageService, CognitoConfig, PkceService, UrlBuilder } from '.';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {
  private _oAuth2Urls$: ReplaySubject<Auth2UrlsDto> = new ReplaySubject(1);

  constructor(
    private _httpClient: HttpClient,
    private _router: Router,
    private _urlBuilder: UrlBuilder,
    private _pkceService: PkceService,
    private _cognitoConfig: CognitoConfig,
    private _storageService: StorageService
  ) {
    this._pkceService.challengePair$
      .pipe(
        filter(challengePair => !!challengePair),
        untilDestroyed(this)
      )
      .subscribe(pair => this._oAuth2Urls$.next(this._urlBuilder.buildCognitoUrls(this._cognitoConfig, pair)));
  }

  ngOnDestroy() {}

  public async hasTokenExpired(): Promise<boolean> {
    const expiresAt = await this._storageService.getItem('expiresAt');
    if (!expiresAt) return true;

    // be careful expiresAt is in seconds and Date.now() in milliseconds
    return expiresAt && Number(expiresAt) * 1000 <= Date.now() - 10000;
  }

  public async obtainValidAccessToken() {
    if (await this.hasTokenExpired()) {
      // check if we have a refreshToken
      const refreshToken = await this._storageService.getItem('refreshToken');
      if (refreshToken) {
        await this._exchangeRefreshTokenForTokens(refreshToken);
        return await this._storageService.getItem('accessToken');
      } else {
        // invalid token and no refresh token = start over
        return this._navigateToAuthUrl();
      }
    } else {
      const token = await this._storageService.getItem('accessToken');
      // some evil developer probably deleted the token from storage
      if (!token) {
        return this._navigateToAuthUrl();
      } else {
        return token;
      }
    }
  }

  public async exchangeCodeForTokens(code) {
    this._pkceService.loadChallengePair();
    const urls = await this._oAuth2Urls$.pipe(take(1)).toPromise();

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    const body = new HttpParams()
      .set('client_id', this._cognitoConfig.cognitoClientId)
      .set('redirect_uri', urls.redirectUrl)
      .set('code', code)
      .set('code_verifier', this._pkceService.challengePair$.getValue().codeVerifier)
      .set('grant_type', 'authorization_code');

    await this._httpClient
      .post(urls.tokenEndpoint, body.toString(), { headers })
      .pipe(
        finalize(() => {
          this._pkceService.clearChallengeFromStorage();
          this.returnToTargetRoute();
        })
      )
      .toPromise()
      .then(res => this._storeTokens(res));
  }

  public logout(): void {
    this._oAuth2Urls$.subscribe(urls => {
      this._httpClient.get(urls.logoutUrl, {});
      this._clearOurTokens();
    });
  }

  public returnToTargetRoute() {
    this._storageService.getItem('targetUrl').then(res => {
      const url = res ? res : '/';
      this._router.navigate([url]);
    });
  }

  public async getUserInfos(): Promise<UserInfoDto> {
    const idToken = await this._storageService.getItem('idToken');
    const userInfos: UserInfoDto = {};
    if (idToken) {
      const decodedToken = this._parseJwt(idToken);
      userInfos.upi = decodedToken.identities[0].userId;
      userInfos.userId = decodedToken['custom:EmpID'];
      userInfos.firstName = decodedToken.given_name;
      userInfos.lastName = decodedToken.family_name;
      userInfos.email = decodedToken.email;
      userInfos.groups = decodedToken['custom:Groups'];
    }
    console.debug('userInfo', userInfos);
    return userInfos;
  }

  ////////////// ######## PRIVATE ######## \\\\\\\\\\\\\\\

  private _navigateToAuthUrl() {
    this._pkceService.generateChallengePair();
    this._oAuth2Urls$.pipe(take(1)).subscribe(urls => window.open(urls.authorizeUrl, '_self'));
  }

  private _storeTokens(tokens): void {
    const decodedToken = this._parseJwt(tokens.id_token);

    // store auth data in storage
    this._storageService.setItem('refreshToken', tokens.refresh_token);
    this._storageService.setItem('accessToken', tokens.access_token);
    this._storageService.setItem('idToken', tokens.id_token);
    this._storageService.setItem('expiresAt', decodedToken.exp);
  }

  private _clearOurTokens() {
    this._storageService.removeItem('refreshToken');
    this._storageService.removeItem('accessToken');
    this._storageService.removeItem('idToken');
    this._storageService.removeItem('expiresAt');
    this._storageService.removeItem('targetUrl');
    this._pkceService.clearChallengeFromStorage();
  }

  private _parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
  }

  private async _exchangeRefreshTokenForTokens(refreshToken) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    const body = new HttpParams()
      .set('refresh_token', refreshToken)
      .set('client_id', this._cognitoConfig.cognitoClientId)
      .set('grant_type', 'refresh_token');

    const urls = await this._oAuth2Urls$.pipe(take(1)).toPromise();
    const tokens = await this._httpClient
      .post(urls.tokenEndpoint, body.toString(), { headers })
      .toPromise()
      .catch(_ => {
        this._clearOurTokens();
        this._navigateToAuthUrl();
      });
    const allTokens = { ...tokens, refresh_token: refreshToken };
    this._storeTokens(allTokens);
  }
}
