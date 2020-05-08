import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { ErrorPage } from './pages/error/error.page';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ClientErrorInterceptor } from './core/interceptors/client-error.interceptor';
import { ServerErrorInterceptor } from './core/interceptors/server-error.interceptors';

@NgModule({
  declarations: [ErrorPage, HeaderComponent, FooterComponent],
  imports: [CommonModule, RouterModule.forChild([{ path: '', component: ErrorPage }])],
  entryComponents: [ErrorPage],
  providers: [
    { provide: HTTP_INTERCEPTORS, multi: true, useClass: ClientErrorInterceptor },
    { provide: HTTP_INTERCEPTORS, multi: true, useClass: ServerErrorInterceptor },
  ],
  exports: [RouterModule],
})
export class ErrorPagesModule {}
