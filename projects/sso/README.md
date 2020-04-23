# Uoa Single Sign-On

## Usage

Install library using command

```
npm install @uoa/sso --save
```

In your app.module.ts import following, eg:

```
import { IonicStorageModule } from '@ionic/storage';
import { AuthModule, CognitoConfigService } from '@uoa/sso';
```

Include `AuthModule, IonicStorageModule.forRoot()` in your imports[], but include CognitoConfig as a provider:

`{ provide: CognitoConfigService, useClass: AppAuthConfigService }`

You will need to create this AppAuthConfigService class, which assigns each property from your environment file. here is an example:

```
import { Injectable } from '@angular/core';

import { CognitoConfigService } from '@uoa/sso';

import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AppAuthConfigService extends CognitoConfigService {
    constructor() {
        super();
        this.codeChallengeMethod = environment.auth.codeChallengeMethod;
        this.cognitoAwsRegion = environment.auth.cognitoAwsRegion;
        this.cognitoClientId = environment.auth.cognitoClientId;
        this.cognitoDomain = environment.auth.cognitoDomain;
        this.cognitoUserPoolId = environment.auth.cognitoUserPoolId;
        this.scopes = environment.auth.scopes;
        this.redirectUri = environment.auth.redirectUri;
        this.bearerTokenUrlFilter = environment.privateUrlKeyWords.whoNeedBearerToken;
    }
}
```

Now from your app component you can hook in to the redirects of the library. Import login service and implements OnInit:

```
import { LoginService } from '@uoa/sso';
```

```
async ngOnInit() {
    this.platform.ready().then(async () => {
      await this.loginService.loginSuccess();
    });
  }
```

Create a authGuard and hook authentication and login methods from Login Service of library:

```
import { LoginService } from '@uoa/sso';

export class AuthGuard implements CanActivate {

  constructor(private loginService : LoginService) {
  }

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return !!(await this.loginService.doLogin(state.url));
  }

}
```

Add guard to your routes.

In order to check if user is authenticated or not, use method:

```
this.loginService.isAuthenticated();
```

It returns Promise<boolean>.
