import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ReplaySubject } from 'rxjs';

import { Auth2UrlsDto, Cognito2UrlsDto, DiscoverUrlsDto } from '../interfaces';
import { CognitoConfigService } from './cognito-config.service';
import { ChallengePair } from './pkce.service';

@Injectable({
  providedIn: 'root',
})
export class UrlBuilder {
  private _discoveryEndpoint: string;
  private _authorizeEndpoint: string;
  public cognitoUrls = new ReplaySubject<Cognito2UrlsDto>(1);

  constructor(private _httpClient: HttpClient) {}

  public getEndPoints(config: CognitoConfigService): void {
    this._discoveryEndpoint = `https://cognito-idp.${config.cognitoAwsRegion}.amazonaws.com/${config.cognitoUserPoolId}/.well-known/openid-configuration`;
    this._httpClient
      .get<DiscoverUrlsDto>(this._discoveryEndpoint)
      .subscribe((res) => this.cognitoUrls.next(this.buildCognitoUrls(res, config)));
  }

  public buildCognitoUrls(urls: DiscoverUrlsDto, config: CognitoConfigService): Cognito2UrlsDto {
    this._authorizeEndpoint = urls.authorization_endpoint;
    return {
      discoveryEndpoint: this._discoveryEndpoint,
      authorizeEndpoint: urls.authorization_endpoint,
      tokenEndpoint: urls.token_endpoint,
      logoutUrl: `https://${config.cognitoDomain}.auth.${config.cognitoAwsRegion}/logout`,
      redirectUrl: config.redirectUri,
    };
  }

  public buildCognitoAuthUrl(config: CognitoConfigService, codeChallenge: ChallengePair): Auth2UrlsDto {
    return {
      authorizeUrl: `${this._authorizeEndpoint}?client_id=${config.cognitoClientId}&response_type=code&redirect_uri=${
        config.redirectUri
      }&code_challenge=${codeChallenge.codeChallenge}&code_challenge_method=${config.codeChallengeMethod}&scope=${encodeURI(
        config.scopes
      )}`,
      codeVerifier: codeChallenge.codeVerifier,
    };
  }
}
