import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { OAuth2Urls } from '../interfaces';
import { StorageService, CognitoConfig, PkceService, ChallengePair, UrlBuilder } from '.';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public oAuth2Urls: OAuth2Urls;
  public codeChallenge: ChallengePair;

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private location: Location,
    private urlBuilder: UrlBuilder,
    private pkceService: PkceService,
    private cognitoConfig: CognitoConfig,
    private storageService: StorageService
  ) {
    this.codeChallenge = pkceService.generateChallengePair();
    this.oAuth2Urls = urlBuilder.buildCognitoUrls(cognitoConfig, this.codeChallenge);
  }

  public async isAuthenticated() {
    let expiresAt = await this.storageService.getItem('expiresAt');

    // be careful expiresAt is in seconds and Date.now() in milliseconds
    if (expiresAt && Number(expiresAt) * 1000 > Date.now() - 10000) {
      return true;
    } else {
      return false;
    }
  }

  public storeTokens(tokens) {
    let decodedToken = this.parseJwt(tokens.id_token);

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
        this.getNewTokensWithRefreshToken(refreshToken);
        return this.storageService.getItem('accessToken');
      }
      else {
        console.log(await this.storageService.getItem('targetUrl'));
        this.router.navigate([await this.storageService.getItem('targetUrl')]);
      }
    }
  }

  public async getIdToken() {
    console.log("getIdToken")
    if (await this.isAuthenticated()) {
      return this.storageService.getItem('idToken');
    } else {
      let refreshToken = JSON.parse(await this.storageService.getItem('refreshToken'));
      if (refreshToken) {
        this.getNewTokensWithRefreshToken(refreshToken);
        return await this.storageService.getItem('idToken');
      } else {
        this.router.navigate([await this.storageService.getItem('targetUrl')]);
      }
    }
  }

  public logout() {
    this.httpClient.get(this.oAuth2Urls.logoutUrl, {});
    this.clearOurTokens();
  }

  public async getUserInfos() {
    let userInfos: any = {};
    let idToken = await this.storageService.getItem('idToken');
    if (idToken) {
      let decodedToken = this.parseJwt(idToken);
      userInfos.upi = decodedToken.identities[0].userId;
      userInfos.firstName = decodedToken.given_name;
      userInfos.email = decodedToken.email;
      userInfos.groups = decodedToken['custom:Groups'];
    }
    return userInfos;
  }

  public exchangeCodeForTokens(code, codeVerifier): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    const body = new HttpParams()
      .set('client_id', this.cognitoConfig.cognitoClientId)
      .set('redirect_uri', this.oAuth2Urls.redirectUrl)
      .set('code', code)
      .set('code_verifier', codeVerifier)
      .set('grant_type', 'authorization_code');

    return this.httpClient.post(this.oAuth2Urls.tokenEndpoint, body.toString(), { headers });
  }

  ////////////// ######## PRIVATE ######## \\\\\\\\\\\\\\\

  private clearOurTokens() {
    this.storageService.removeItem('refreshToken');
    this.storageService.removeItem('accessToken');
    this.storageService.removeItem('idToken');
    this.storageService.removeItem('expiresAt');
    this.storageService.removeItem('targetUrl');
  }

  private parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
  }

  private getNewTokensWithRefreshToken(refreshToken) {
    this.exchangeRefreshTokenForTokens(refreshToken).subscribe(
      res => this.storeTokens(res),
      err => console.log(err)
    );
  }

  private exchangeRefreshTokenForTokens(refreshToken) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    const body = new HttpParams()
      .set('refresh_token', refreshToken)
      .set('client_id', this.cognitoConfig.cognitoClientId)
      .set('grant_type', 'refresh_token');

    return this.httpClient.post(this.oAuth2Urls.tokenEndpoint, body.toString(), { headers });
  }
}
