import { Injectable } from '@angular/core';
import { OAuth2Urls as OAuth2Urls } from '../interfaces/oauth2.interface';
import { CognitoConfig } from '../interfaces/cognitoconfig';
import { ChallengePair } from './auth.pkce.service';

@Injectable({
    providedIn: 'root'
})
export class AuthUrlBuilder {

    buildCognitoUrls(config: CognitoConfig, codeChallenge: ChallengePair): OAuth2Urls {
        const authorizeEndpoint = 'https://' + config.cognitoDomain + '.auth.' + config.cognitoAwsRegion + '.amazoncognito.com/oauth2/authorize';

        return {
            discoveryEndpoint: 'https://cognito-idp.' + config.cognitoAwsRegion + '.amazonaws.com/' + config.cognitoUserPoolId + '/.well-known/openid-configuration',
            authorizeEndpoint,
            tokenEndpoint: 'https://' + config.cognitoDomain + '.auth.' + config.cognitoAwsRegion + '.amazoncognito.com/oauth2/token',
            logoutUrl: 'https://' + config.cognitoDomain + '.auth.' + config.cognitoAwsRegion + '/logout',
            authorizeUrl: authorizeEndpoint + '?'
                + 'client_id' + '=' + config.cognitoClientId + '&'
                + 'response_type' + '=' + 'code' + '&'
                + 'redirect_uri' + '=' + config.redirectUri + '&'
                + 'code_challenge' + '=' + codeChallenge + '&'
                + 'code_challenge_method' + '=' + config.codeChallengeMethod + '&'
                + 'scope' + '=' + encodeURI(config.scopes),
            redirectUrl: config.redirectUri
        }
    }

}