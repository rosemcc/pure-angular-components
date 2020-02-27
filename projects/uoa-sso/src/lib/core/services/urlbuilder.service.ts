import { Injectable } from '@angular/core';
import { OAuth2Urls } from 'projects/uoa-sso/src/lib/core/interfaces';
import { CognitoConfig, ChallengePair } from 'projects/uoa-sso/src/lib/core/services';

@Injectable({
    providedIn: 'root'
})
export class UrlBuilder {

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