import { Inject, Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { ReplaySubject, combineLatest } from 'rxjs';
import { finalize, filter, take } from 'rxjs/operators';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';

import { BypassErrorService } from 'uoa-error-pages-angular';

import { Auth2UrlsDto, UserInfoDto, Cognito2UrlsDto } from '../interfaces';
import { UrlBuilder } from './urlbuilder.service';
import { CognitoConfigService } from './cognito-config.service';
import { PkceService } from './pkce.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  private _oAuth2Urls$: ReplaySubject<Auth2UrlsDto> = new ReplaySubject(1);
  private _cognitoUrls$: ReplaySubject<Cognito2UrlsDto> = new ReplaySubject(1);

  constructor(
    private _httpClient: HttpClient,
    private _router: Router,
    private _urlBuilder: UrlBuilder,
    private _pkceService: PkceService,
    private _cognitoConfig: CognitoConfigService,
    @Inject(LOCAL_STORAGE) private _storageService: StorageService,
    private _bypassErrorService: BypassErrorService
  ) {
    this._cognitoUrls$ = this._urlBuilder.cognitoUrls;
    this._urlBuilder.getEndPoints(this._cognitoConfig);
    combineLatest([this._pkceService.challengePair$, this._cognitoUrls$])
      .pipe(
        filter(([challengePair, urls]) => !!challengePair),
        untilDestroyed(this)
      )
      .subscribe(([pair, url]) => this._oAuth2Urls$.next(this._urlBuilder.buildCognitoAuthUrl(this._cognitoConfig, pair)));
  }

  ngOnDestroy() {}

  public async hasTokenExpired(): Promise<boolean> {
    const expiresAt = this._storageService.get('expiresAt');
    if (!expiresAt) return true;

    // be careful expiresAt is in seconds and Date.now() in milliseconds
    return expiresAt && Number(expiresAt) * 1000 <= Date.now() - 10000;
  }

  public async obtainValidAccessToken() {
    if (await this.hasTokenExpired()) {
      // check if we have a refreshToken
      const refreshToken = this._storageService.get('refreshToken');
      if (refreshToken) {
        await this._exchangeRefreshTokenForTokens(refreshToken);
        return this._storageService.get('accessToken');
      } else {
        // invalid token and no refresh token = start over
        return this._navigateToAuthUrl();
      }
    } else {
      const token = this._storageService.get('accessToken');
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
    const urls = await this._cognitoUrls$.pipe(take(1)).toPromise();
    const oAthUrls = await this._oAuth2Urls$.pipe(take(1)).toPromise();

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });
    const body = new HttpParams()
      .set('client_id', this._cognitoConfig.cognitoClientId)
      .set('redirect_uri', urls.redirectUrl)
      .set('code', code)
      .set('code_verifier', oAthUrls.codeVerifier)
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
      .then((res) => this._storeTokens(res));
  }

  public logout(): void {
    this._cognitoUrls$.subscribe((urls) => {
      this._clearOurTokens();
      window.open(
        `${urls.logoutUrl}?client_id=${this._cognitoConfig.cognitoClientId}&logout_uri=${this._cognitoConfig.logoutUri}`,
        '_self'
      );
    });
  }

  public returnToTargetRoute() {
    const targetUrl = this._storageService.get('targetUrl');
    const url = targetUrl ? targetUrl : '/';
    this._router.navigate([url]);
  }

  public async getUserInfos(): Promise<UserInfoDto> {
    const idToken = this._storageService.get('idToken');
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
    this._oAuth2Urls$.pipe(take(1)).subscribe((urls) => window.open(urls.authorizeUrl, '_self'));
  }

  private _storeTokens(tokens): void {
    const decodedToken = this._parseJwt(tokens.id_token);

    // store auth data in storage
    this._storageService.set('refreshToken', tokens.refresh_token);
    this._storageService.set('accessToken', tokens.access_token);
    this._storageService.set('idToken', tokens.id_token);
    this._storageService.set('expiresAt', decodedToken.exp);
  }

  private _clearOurTokens() {
    this._storageService.remove('refreshToken');
    this._storageService.remove('accessToken');
    this._storageService.remove('idToken');
    this._storageService.remove('expiresAt');
    this._storageService.remove('targetUrl');
    this._pkceService.clearChallengeFromStorage();
  }

  private _parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
  }

  private async _exchangeRefreshTokenForTokens(refreshToken) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    const body = new HttpParams()
      .set('refresh_token', refreshToken)
      .set('client_id', this._cognitoConfig.cognitoClientId)
      .set('grant_type', 'refresh_token');

    const urls = await this._cognitoUrls$.pipe(take(1)).toPromise();
    this._bypassErrorService.bypassError(urls.tokenEndpoint, [400, 401, 403, 404]);

    const tokens = await this._httpClient
      .post(urls.tokenEndpoint, body.toString(), { headers })
      .toPromise()
      .catch((_) => {
        this._clearOurTokens();
        this._navigateToAuthUrl();
      });
    const allTokens = { ...tokens, refresh_token: refreshToken };
    this._storeTokens(allTokens);
  }
}
