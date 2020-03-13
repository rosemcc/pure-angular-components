# Uoa Single Sign-On

## Usage

Place library as a peer dependency in the same parent folder of your repo. Alternatively use npm to link to a built dist version of the library.

In your app.module.ts import these two, eg:

`import { CognitoConfig, CoreModule } from '../../../uoa-common/projects/uoa-sso/src/public-api'`

Include CoreModule in your imports[], but include CognitoConfig as a provider:

`{ provide: CognitoConfig, useClass: AppAuthConfig }`

You will need to create this AppAuthConfig class, which assigns each property from your environment file. here is an example:

```
import { CognitoConfig } from '../../../uoa-common/projects/uoa-sso/src/public-api';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AppAuthConfig extends CognitoConfig {
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
        this.idTokenUrlFilter = environment.privateUrlKeyWords.whoNeedIdToken;
    }
}
```

Now from your app component you can hook in to the redirects of the library:

```
async ngOnInit() {
    this.platform.ready().then(async () => {
      await this.loginService.loginSuccess();
    });
  }
```

Create a authGuard and hook authentication and login methods from Login Service of library:

```
export class AuthGuard implements CanActivate {

  constructor(private loginService : LoginService) {
  }

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return !!(await this.loginService.doLogin(state.url));
  }

}
```

Add guard to your routes.

## Code scaffolding

Run `ng generate component component-name --project uoa-sso` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module --project uoa-sso`.

> Note: Don't forget to add `--project uoa-sso` or else it will be added to the default project in your `angular.json` file.

## Build

Run `ng build uoa-sso` to build the project. The build artifacts will be stored in the `dist/` directory.

## Publishing

After building your library with `ng build uoa-sso`, go to the dist folder `cd dist/uoa-sso` and run `npm publish`.

## Running unit tests

Run `ng test uoa-sso` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
