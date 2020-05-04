import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CognitoConfigService {
  public cognitoAwsRegion: string;
  public cognitoUserPoolId: string;
  public cognitoDomain: string;
  public cognitoClientId: string;
  public redirectUri: string;
  public logoutUri: string;
  public codeChallengeMethod: string;
  public scopes: string;
  public bearerTokenUrlFilter: string[];
  public errorPage = 'error';
}
