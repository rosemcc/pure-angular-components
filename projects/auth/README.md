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

Import guards from library and add it to your routes:

```
import { AuthGuard, LoginSuccessGuard } from '@uoa/auth';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },

  {
    path: 'home',
    canActivate: [LoginSuccessGuard],
    loadChildren: () => import('./pages/home/home.module').then((m) => m.HomePageModule),
  },
  {
    path: 'protected',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/protected/protected.module').then((m) => m.ProtectedPageModule),
  },
  {
    path: '**',
    redirectTo: '/home',
  },
];
```

Add `LoginSuccessGuard` to default route if you are not protecting all pages.

If you want to make whole app protected then yours routes will be as follow:

```
import { AuthGuard } from '@uoa/auth';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },

  {
    path: 'home',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/home/home.module').then((m) => m.HomePageModule),
  },
  {
    path: 'protected',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/protected/protected.module').then((m) => m.ProtectedPageModule),
  },
  {
    path: '**',
    redirectTo: '/home',
  },
];
```

In order to get loggedin user details, use method:

```
this.loginService.getUserInfo();
```

In order to check if user is authenticated or not, use method:

```
this.loginService.isAuthenticated();
```

It returns Promise<boolean>.

In order to logout user, use method:

```
this.loginService.logout();
```

## Peer dependencies

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
