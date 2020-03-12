import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { OAuth2Urls } from '../interfaces';
import { StorageService, CognitoConfig, PkceService, UrlBuilder } from '.';
import { ReplaySubject } from 'rxjs';
import { finalize, filter, tap, take } from 'rxjs/operators';
import { untilDestroyed } from 'ngx-take-until-destroy';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {
  private oAuth2Urls$: ReplaySubject<OAuth2Urls> = new ReplaySubject(1);

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private urlBuilder: UrlBuilder,
    private pkceService: PkceService,
    private cognitoConfig: CognitoConfig,
    private storageService: StorageService
  ) {
    this.pkceService.challengePair$
      .pipe(
        filter(challengePair => !!challengePair),
        untilDestroyed(this)
      )
      .subscribe(pair => this.oAuth2Urls$.next(this.urlBuilder.buildCognitoUrls(this.cognitoConfig, pair)));
  }

  ngOnDestroy() {}

  public async hasTokenExpired(): Promise<boolean> {
    const expiresAt = await this.storageService.getItem('expiresAt');
    if (!expiresAt) return true;

    // be careful expiresAt is in seconds and Date.now() in milliseconds
    return expiresAt && Number(expiresAt) * 1000 <= Date.now() - 10000;
  }

  public storeTokens(tokens): void {
    const decodedToken = this.parseJwt(tokens.id_token);

    // store auth data in storage
    this.storageService.setItem('refreshToken', tokens.refresh_token);
    this.storageService.setItem('accessToken', tokens.access_token);
    this.storageService.setItem('idToken', tokens.id_token);
    this.storageService.setItem('expiresAt', decodedToken.exp);
  }

  public async obtainValidAccessToken() {
    this.pkceService.loadOrGeneratePair();
    if (await this.hasTokenExpired()) {
      // check if we have a refreshToken
      const refreshToken = await this.storageService.getItem('refreshToken');
      if (refreshToken) {
        await this.exchangeRefreshTokenForTokens(refreshToken);
        return await this.storageService.getItem('accessToken');
      } else {
        // invalid token and no refresh token = start over
        return this.navigateToAuthUrl();
      }
    } else {
      const token = await this.storageService.getItem('accessToken');
      // some evil developer probably deleted the token from storage
      if (!token) {
        return this.navigateToAuthUrl();
      } else {
        return token;
      }
    }
  }

  public logout() {
    this.oAuth2Urls$.subscribe(urls => {
      this.httpClient.get(urls.logoutUrl, {});
      this.clearOurTokens();
    });
  }

  public async getUserInfos() {
    const userInfos: any = {};
    const idToken = await this.storageService.getItem('idToken');
    if (idToken) {
      const decodedToken = this.parseJwt(idToken);
      userInfos.upi = decodedToken.identities[0].userId;
      userInfos.firstName = decodedToken.given_name;
      userInfos.email = decodedToken.email;
      userInfos.groups = decodedToken['custom:Groups'];
    }
    return userInfos;
  }

  public exchangeCodeForTokens(code) {
    this.pkceService.loadOrGeneratePair();
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    this.oAuth2Urls$.pipe(take(1)).subscribe(urls => {
      const body = new HttpParams()
        .set('client_id', this.cognitoConfig.cognitoClientId)
        .set('redirect_uri', urls.redirectUrl)
        .set('code', code)
        .set('code_verifier', this.pkceService.challengePair$.getValue().codeVerifier)
        .set('grant_type', 'authorization_code');

      this.httpClient
        .post(urls.tokenEndpoint, body.toString(), { headers })
        .pipe(
          finalize(() => {
            this.pkceService.clearChallengeFromStorage();
            this.returnToTargetRoute();
          })
        )
        .subscribe(res => this.storeTokens(res));
    });
  }

  public navigateToAuthUrl() {
    this.oAuth2Urls$.pipe(take(1)).subscribe(urls => {
      const url = urls.authorizeUrl;
      console.log('urls.authorizeUrl', url);
      window.open(urls.authorizeUrl, '_self');
    });
  }

  public returnToTargetRoute() {
    this.storageService.getItem('targetUrl').then(res => this.router.navigate([res]));
  }
  ////////////// ######## PRIVATE ######## \\\\\\\\\\\\\\\

  private clearOurTokens() {
    this.storageService.removeItem('refreshToken');
    this.storageService.removeItem('accessToken');
    this.storageService.removeItem('idToken');
    this.storageService.removeItem('expiresAt');
    this.storageService.removeItem('targetUrl');
    this.pkceService.clearChallengeFromStorage();
  }

  private parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
  }

  private exchangeRefreshTokenForTokens(refreshToken) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    const body = new HttpParams()
      .set('refresh_token', refreshToken)
      .set('client_id', this.cognitoConfig.cognitoClientId)
      .set('grant_type', 'refresh_token');

    this.oAuth2Urls$.pipe(take(1)).subscribe(urls => {
      this.httpClient.post(urls.tokenEndpoint, body.toString(), { headers }).subscribe(res => {
        const allTokens = { ...res, refresh_token: refreshToken };
        this.storeTokens(allTokens);
      });
    });
  }
}
