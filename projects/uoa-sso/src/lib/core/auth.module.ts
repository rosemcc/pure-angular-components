import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor, AuthClientErrorInterceptor } from './interceptors';

@NgModule({
  declarations: [],
  imports: [CommonModule, HttpClientModule],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
    //  { provide: HTTP_INTERCEPTORS, useClass: AuthClientErrorInterceptor, multi: true }
  ]
})
export class AuthModule {}
