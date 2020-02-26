import { Injectable } from '@angular/core';
import { Router } from "@angular/router";
import { Location } from '@angular/common';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { PkceService, ChallengePair } from './auth.pkce.service';
import { AuthUrlBuilder } from './auth.urlbuilder.service';
import { OAuth2Urls } from '../interfaces/oauth2.interface';
import { CognitoConfig } from '../interfaces/cognitoconfig';

@Injectable({
  providedIn: 'root'
})
export class CognitoAuthService {

  public oAuth2Urls: OAuth2Urls;
  public codeChallenge: ChallengePair;

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private location: Location,
    private authUrlBuilder: AuthUrlBuilder,
    private pkceService: PkceService,
    private cognitoConfig: CognitoConfig
  ) {
    this.codeChallenge = this.pkceService.generateChallengePair();
    this.oAuth2Urls = authUrlBuilder.buildCognitoUrls(cognitoConfig, this.codeChallenge);
  };

  public isAuthenticated() {
    let expiresAt = localStorage.getItem('expiresAt');

    // be careful expiresAt is in seconds and Date.now() in milliseconds
    if (expiresAt && ((Number(expiresAt) * 1000) > (Date.now() - 10000))) {
      return true;
    } else {
      return false;
    }
  }

  public storeTokens(tokens) {
    let decodedToken = this.parseJwt(tokens.id_token);

    // store auth data in storage
    localStorage.setItem('refreshToken', tokens.refresh_token);
    localStorage.setItem('accessToken', tokens.access_token);
    localStorage.setItem('idToken', tokens.id_token);
    localStorage.setItem('expiresAt', decodedToken.exp);

  }

  public getAccessToken() {
    if (this.isAuthenticated()) {
      return localStorage.getItem('accessToken');
    } else {
      // check if we have a refreshToken
      let refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        this.getNewTokensWithResfreshToken(refreshToken);
        return localStorage.getItem('accessToken');
      }
      else {
        console.log('Access token OK, going back to target');
        this.router.navigate([localStorage.getItem('targetUrl')]);
      }
    }
  }

  public getIdToken() {
    if (this.isAuthenticated()) {
      return localStorage.getItem('idToken');
    } else {
      let refreshToken = JSON.parse(localStorage.getItem('refreshToken'));
      if (refreshToken) {
        this.getNewTokensWithResfreshToken(refreshToken);
        return localStorage.getItem('idToken');
      }
      else {
        console.log('ID token OK, going back to target');
        this.router.navigate([localStorage.getItem('targetUrl')]);
      }
    }
  }

  public logout() {
    this.httpClient.get(this.oAuth2Urls.logoutUrl, {});
    localStorage.clear();
  }

  public getUserInfos() {
    let userInfos: any = {};
    let idToken = localStorage.getItem('idToken');
    if (idToken) {
      let decodedToken = this.parseJwt(idToken);
      userInfos.upi = decodedToken.identities[0].userId;
      userInfos.firstName = decodedToken.given_name;
      userInfos.email = decodedToken.email;
      userInfos.groups = decodedToken['custom:Groups'];
    }
    return userInfos;
  }

  public exchangeCodeForTokens(code, codeVerifier) {
    let headers = new HttpHeaders({
      "Content-Type": "application/x-www-form-urlencoded"
    });

    const body = new HttpParams()
      .set('client_id', this.cognitoConfig.cognitoClientId)
      .set('redirect_uri', this.oAuth2Urls.redirectUrl)
      .set('code', code)
      .set('code_verifier', codeVerifier)
      .set('grant_type', "authorization_code");
    return this.httpClient.post(this.oAuth2Urls.tokenEndpoint, body.toString(),
      { headers: headers });
  }



  ////////////// ######## PRIVATE ######## \\\\\\\\\\\\\\\

  private parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
  };

  private getNewTokensWithResfreshToken(refreshToken) {
    this.exchangeRefreshTokenForTokens(refreshToken).subscribe(
      (res) => {
        // console.log("tokens ::: ", JSON.stringify(res));
        this.storeTokens(res);
      },
      (err) => console.log(err)
    );
  }

  private exchangeRefreshTokenForTokens(refreshToken) {
    let headers = new HttpHeaders({
      "Content-Type": "application/x-www-form-urlencoded"
    });

    const body = new HttpParams()
      .set('refresh_token', refreshToken)
      .set('client_id', this.cognitoConfig.cognitoClientId)
      .set('grant_type', "refresh_token");

    return this.httpClient.post(this.oAuth2Urls.tokenEndpoint, body.toString(),
      { headers: headers });
  }

}
