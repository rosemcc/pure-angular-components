import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { OAuth2Urls } from '../interfaces';
import { StorageService, CognitoConfig, PkceService, UrlBuilder } from '.';
import { BehaviorSubject, Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { untilDestroyed } from 'ngx-take-until-destroy';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {
  private oAuth2Urls$: BehaviorSubject<OAuth2Urls> = new BehaviorSubject(null);
  private oAuth2UrlSubscription$: Subscription = new Subscription();

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private urlBuilder: UrlBuilder,
    private pkceService: PkceService,
    private cognitoConfig: CognitoConfig,
    private storageService: StorageService
  ) {
    this.pkceService.challengePair$
      .pipe(untilDestroyed(this))
      .subscribe(pair => this.oAuth2Urls$.next(this.urlBuilder.buildCognitoUrls(this.cognitoConfig, pair)));
  }

  ngOnDestroy() {
    // untilDestroyed
    this.oAuth2UrlSubscription$.unsubscribe();
  }

  public async isAuthenticated(): Promise<boolean> {
    const expiresAt = await this.storageService.getItem('expiresAt');

    // be careful expiresAt is in seconds and Date.now() in milliseconds
    return expiresAt && Number(expiresAt) * 1000 > Date.now() - 10000;
  }

  public storeTokens(tokens): void {
    const decodedToken = this.parseJwt(tokens.id_token);

    // store auth data in storage
    this.storageService.setItem('refreshToken', tokens.refresh_token);
    this.storageService.setItem('accessToken', tokens.access_token);
    this.storageService.setItem('idToken', tokens.id_token);
    this.storageService.setItem('expiresAt', decodedToken.exp);
  }

  public async getAccessToken() {
    if (await this.isAuthenticated()) {
      return await this.storageService.getItem('accessToken');
    } else {
      // check if we have a refreshToken
      let refreshToken = await this.storageService.getItem('refreshToken');
      if (refreshToken) {
        await this.exchangeRefreshTokenForTokens(refreshToken);
        return this.storageService.getItem('accessToken');
      } else {
        this.router.navigate([await this.storageService.getItem('targetUrl')]);
      }
    }
  }

  public logout() {
    this.oAuth2UrlSubscription$.add(
      this.oAuth2Urls$.subscribe(urls => {
        if (urls) {
          this.httpClient.get(urls.logoutUrl, {});
          this.clearOurTokens();
          this.oAuth2UrlSubscription$.unsubscribe();
        }
      })
    );
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
    this.oAuth2UrlSubscription$.add(
      this.oAuth2Urls$.subscribe(urls => {
        if (urls) {
          const headers = new HttpHeaders({
            'Content-Type': 'application/x-www-form-urlencoded'
          });

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
                this.oAuth2UrlSubscription$.unsubscribe();
                this.returnToTargetRoute();
              })
            )
            .subscribe(res => this.storeTokens(res));
        }
      })
    );
  }

  public navigateToAuthUrl() {
    this.oAuth2UrlSubscription$.add(
      this.oAuth2Urls$.subscribe(urls => {
        if (urls) {
          this.oAuth2UrlSubscription$.unsubscribe();
          window.open(urls.authorizeUrl, '_self');
        }
      })
    );
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
    return new Promise((resolve, reject) => {
      this.oAuth2UrlSubscription$.add(
        this.oAuth2Urls$.subscribe(urls => {
          if (urls) {
            const headers = new HttpHeaders({
              'Content-Type': 'application/x-www-form-urlencoded'
            });

            const body = new HttpParams()
              .set('refresh_token', refreshToken)
              .set('client_id', this.cognitoConfig.cognitoClientId)
              .set('grant_type', 'refresh_token');

            this.httpClient.post(urls.tokenEndpoint, body.toString(), { headers }).subscribe(
              res => {
                this.storeTokens(res);
                this.oAuth2UrlSubscription$.unsubscribe();
                resolve();
              },
              error => {
                reject(error);
              }
            );
          }
        })
      );
    });
  }
}
