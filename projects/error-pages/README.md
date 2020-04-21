# Uoa Error Pages

## Usage

Install library using command

```
npm install @uoa/error-pages --save
```

In your app.module.ts import ErrorPagesModule, eg:

`import { ErrorPagesModule } from '@uoa/error-pages';`

Include ErrorPagesModule in your imports[].

Create an ErrorRoutingModule to define the error page child route

```
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

If you want to handle specific error code for any endpoint inside project. import BypassErrorService to your Service

`import { BypassErrorService } from '@uoa/error-pages';`

and call following method before your api call:

`this._bypass.bypassError('${url}', [409, 401, 504, 404]);`

Library will skip mentioned error statuses for given end point.

Default Error codes are as follow:

```
  clientErrorCodes =  [400, 401, 403, 404, 405, 406, 407, 408, 409, 410, 411, 412, 413, 414, 415, 418, 429, 431];
  serverErrorCodes = [500, 501, 502, 503, 504, 505, 506];
```

Error Template is defined for all the above codes.

## Override Error codes and Error Content

If you want to override default error codes and templates, include UoaErrorsConfig as a provider:

`{ provide: UoaErrorsConfig, useClass: AppErrorsConfig }`

You will need to create this AppErrorsConfig class, where you assign new values to existing objects or add new objects properties. Here is an example:

```
import { UoaErrorsConfig } from '@uoa/error-pages';

export class AppErrorsConfig extends UoaErrorsConfig {
  constructor() {
    super();

    this.serverErrorCodes = [501, 504, 505];

    this.ErrorPageContent['ErrorCode400'] = { title: 'Custom title', content: 'Custom description' };

  }
}

```
