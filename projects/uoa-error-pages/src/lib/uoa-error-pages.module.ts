import { NgModule } from '@angular/core';
import { UoaErrorPagesComponent } from './uoa-error-pages.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ClientErrorInterceptor, ServerErrorInterceptor } from 'projects/uoa-error-pages/src/lib/core';

@NgModule({
  declarations: [UoaErrorPagesComponent],
  imports: [],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ServerErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ClientErrorInterceptor, multi: true }
  ],
  exports: [UoaErrorPagesComponent]
})
export class UoaErrorPagesModule {}
