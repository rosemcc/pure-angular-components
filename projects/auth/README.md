# UOA Authentication Library

## Usage

Install library using command

```
npm install @uoa/auth
```

In your app.module.ts import following, eg:

```
import { IonicStorageModule } from '@ionic/storage';
import { AuthModule, CognitoConfigService } from '@uoa/auth';
```

Include `AuthModule, IonicStorageModule.forRoot()` in your imports[], but include CognitoConfig as a provider:

`{ provide: CognitoConfigService, useClass: AppAuthConfigService }`

You will need to create this AppAuthConfigService class, which assigns each property from your environment file. here is an example:

```
import { Injectable } from '@angular/core';

import { CognitoConfigService } from '@uoa/auth';

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
import { Component, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { LoginService } from '@uoa/auth';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private loginService: LoginService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  async ngOnInit() {
    this.platform.ready().then(async () => {
      await this.loginService.loginSuccess();
    });
  }
}
```

Create a authGuard and hook authentication and login methods from Login Service of library:

```
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { LoginService } from '@uoa/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private loginService: LoginService) {}
  async canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return !!(await this.loginService.doLogin(state.url));
  }
}
```

Add guard to your routes.

```
{
    path: 'protected',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/protected/protected.module').then((m) => m.ProtectedPageModule),
  },
```

In order to check if user is authenticated or not, use method:

```
this.loginService.isAuthenticated();
```

It returns Promise<boolean>.

## Install Peer dependencies

Install peer dependencies :

```
npm install crypto-js ngx-take-until-destroy @ionic/storage @uoa/error-pages
```

In your app.module.ts import ErrorPagesModule, eg:

`import { ErrorPagesModule } from '@uoa/error-pages';`

Include ErrorPagesModule in your imports[].

Create an ErrorRoutingModule to define the error page child route

```
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ErrorPagesModule, ErrorPage } from '@uoa/error-pages';

@NgModule({
  imports: [ErrorPagesModule, RouterModule.forChild([{ path: '', component: ErrorPage }])],
  exports: [RouterModule],
})
export class ErrorRoutingModule {}
```

Go to routing module of application and add error route to routes. Here is an example:

```
{
    path: 'error/:errorCode',
    loadChildren: () => import('./error-routing.module').then((m) => m.ErrorRoutingModule),
}
```
