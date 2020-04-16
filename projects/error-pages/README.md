# Uoa Error Pages

## Usage

Place library as a peer dependency in the same parent folder of your repo. Alternatively use npm to link to a built dist version of the library.

In your app.module.ts import ErrorPagesModule, eg:

`import { ErrorPagesModule } from 'resources/dist/error-pages';`

Include ErrorPagesModule in your imports[].

Go to routing module of application and add error route to routes. Here is an example:

```
{
    path: 'error/:errorCode',
    loadChildren: () => import('resources/dist/error-pages').then(m => m.ErrorPagesModule)
}
```

If you want to handle specific error code for any endpoint inside project. import BypassErrorService to your Service

`import { BypassErrorService } from 'resources/dist/error-pages';`

and call following method before your api call:

`this._bypass.bypassError('https://localhost:3000/search-by-name/', [409, 401, 504, 404]);`

Library will skip mentioned error statuses for given end point.

Default Error codes are as follow:

```
  clientErrorCodes = [400, 401, 403, 404, 405, 406, 407, 408, 409, 410, 411, 412, 413, 414, 415, 418];
  serverErrorCodes = [500, 501, 502, 503, 504, 505, 506];
```

Error Template is defined for all the above codes.

## Optional Overriding Library Error codes and Error Content

If you want to override default error codes and templates, include UoaErrorsConfig as a provider:

`{ provide: UoaErrorsConfig, useClass: AppErrorsConfig }`

You will need to create this AppErrorsConfig class, where you assign new values to existing objects or add new objects properties. Here is an example:

```
import { UoaErrorsConfig } from 'resources/dist/error-pages';

export class AppErrorsConfig extends UoaErrorsConfig {
  constructor() {
    super();

    this.serverErrorCodes = [501, 504, 505];

    this.ErrorPageContent['ErrorCode400'] = { title: 'Custom title', content: 'Custom description' };

  }
}

```
