import { Injectable } from '@angular/core';
import { OAuth2Urls } from '../interfaces';
import { CognitoConfig, ChallengePair } from '.';

@Injectable({
  providedIn: 'root'
})
export class UrlBuilder {
  buildCognitoUrls(config: CognitoConfig, codeChallenge: ChallengePair): OAuth2Urls {
    const authorizeEndpoint = `https://${config.cognitoDomain}.auth.${config.cognitoAwsRegion}.amazoncognito.com/oauth2/authorize`;
    if (codeChallenge === null) {
      codeChallenge = {codeChallenge: '', codeVerifier: ''};
    }
    
    return {
      discoveryEndpoint: `https://cognito-idp.${config.cognitoAwsRegion}.amazonaws.com/${config.cognitoUserPoolId}/.well-known/openid-configuration`,
      authorizeEndpoint,
      tokenEndpoint: `https://${config.cognitoDomain}.auth.${config.cognitoAwsRegion}.amazoncognito.com/oauth2/token`,
      logoutUrl: `https://${config.cognitoDomain}.auth.${config.cognitoAwsRegion}/logout`,
      authorizeUrl: `${authorizeEndpoint}?client_id=${config.cognitoClientId}&response_type=code&redirect_uri=${
        config.redirectUri
      }&code_challenge=${codeChallenge.codeChallenge}&code_challenge_method=${config.codeChallengeMethod}&scope=${encodeURI(
        config.scopes
      )}`,
      redirectUrl: config.redirectUri
    };
  }
}