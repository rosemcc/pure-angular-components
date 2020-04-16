import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CognitoConfig {
  public cognitoAwsRegion: string;
  public cognitoUserPoolId: string;
  public cognitoDomain: string;
  public cognitoClientId: string;
  public redirectUri: string;
  public codeChallengeMethod: string;
  public scopes: string;
  public bearerTokenUrlFilter: string[];
}
