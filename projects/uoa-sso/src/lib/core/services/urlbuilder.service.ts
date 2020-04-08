import { Injectable } from '@angular/core';
import { Auth2UrlsDto, Cognito2UrlsDto } from '../interfaces';
import { CognitoConfig, ChallengePair } from '.';

@Injectable({
  providedIn: 'root',
})
export class UrlBuilder {
  public buildCognitoUrls(config: CognitoConfig): Cognito2UrlsDto {
    const authorizeEndpoint = this._authorizeEndpoint(config);
    return {
      discoveryEndpoint: `https://cognito-idp.${config.cognitoAwsRegion}.amazonaws.com/${config.cognitoUserPoolId}/.well-known/openid-configuration`,
      authorizeEndpoint,
      tokenEndpoint: `https://${config.cognitoDomain}.auth.${config.cognitoAwsRegion}.amazoncognito.com/oauth2/token`,
      logoutUrl: `https://${config.cognitoDomain}.auth.${config.cognitoAwsRegion}/logout`,
      redirectUrl: config.redirectUri,
    };
  }

  public buildCognitoAuthUrl(config: CognitoConfig, codeChallenge: ChallengePair): Auth2UrlsDto {
    const authorizeEndpoint = this._authorizeEndpoint(config);
    return {
      authorizeUrl: `${authorizeEndpoint}?client_id=${config.cognitoClientId}&response_type=code&redirect_uri=${
        config.redirectUri
      }&code_challenge=${codeChallenge.codeChallenge}&code_challenge_method=${config.codeChallengeMethod}&scope=${encodeURI(
        config.scopes
      )}`,
    };
  }

  private _authorizeEndpoint(config: CognitoConfig): string {
    return `https://${config.cognitoDomain}.auth.${config.cognitoAwsRegion}.amazoncognito.com/oauth2/authorize`;
  }
}
