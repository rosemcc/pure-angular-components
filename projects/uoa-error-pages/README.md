# Uoa Error Pages

## Usage

Place library as a peer dependency in the same parent folder of your repo. Alternatively use npm to link to a built dist version of the library.

In your app.module.ts import ErrorPagesModule, eg:

`import { ErrorPagesModule } from 'resources/dist/uoa-error-pages';`

Include ErrorPagesModule in your imports[].

Go to routing module of application and add error route to routes. Here is an example:

```
{
    path: 'error/:errorCode',
    loadChildren: () => import('resources/dist/uoa-error-pages').then(m => m.ErrorPagesModule)
}
```

If you want to handle specific error code for any endpoint inside project. import BypassErrorService to your Service

`import { BypassErrorService } from 'resources/dist/uoa-error-pages';`

and call following method before your api call:

`this._bypass.bypassError('https://localhost:3000/search-by-name/', [409, 401, 504, 404]);`

Default Error codes are as follow:

```
  clientErrorCodes = [400, 401, 403, 404, 408, 409];
  serverErrorCodes = [500, 502, 503, 504];
```

Error Templete is defined for all the above codes.

## Optoional Overriding Library Error codes and Error Content

If you want to override default error codes and templates, include UoaErrorsConfig as a provider:

`{ provide: UoaErrorsConfig, useClass: AppErrorsConfig }`

You will need to create this AppErrorsConfig class, where you assign new values to existing objects or add new objects properties. Here is an example:

```
import { UoaErrorsConfig } from 'resources/dist/uoa-error-pages';

export class AppErrorsConfig extends UoaErrorsConfig {
  constructor() {
    super();

    this.clientErrorCodes = [408, 400, 409];
    this.serverErrorCodes = [501, 504, 506];

    this.ErrorPageContent.ErrorCode400 = { title: 'Custom title', content: 'Custom description' };
    this.ErrorPageContent['ErrorCode506'] = {
      title: 'Variant also varies!',
      content: `A variant for the requested entity is itself a negotiable resource.
      <p>Access not possible.</p>`
    };
  }
}

```

## Code scaffolding

Run `ng generate component component-name --project uoa-error-pages` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module --project uoa-error-pages`.

> Note: Don't forget to add `--project uoa-error-pages` or else it will be added to the default project in your `angular.json` file.

## Build

Run `ng build uoa-error-pages` to build the project. The build artifacts will be stored in the `dist/` directory.

## Publishing

After building your library with `ng build uoa-error-pages`, go to the dist folder `cd dist/uoa-error-pages` and run `npm publish`.

## Running unit tests

Run `ng test uoa-error-pages` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
