import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { HeaderModule, FooterModule } from './components';
import { ErrorPage } from './pages/error/error.page';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ClientErrorInterceptor, ServerErrorInterceptor } from './core/interceptors';

@NgModule({
  declarations: [ErrorPage],
  imports: [
    IonicModule,
    CommonModule,
    HeaderModule,
    FooterModule,
    RouterModule.forChild([
      {
        path: '',
        component: ErrorPage
      }
    ])
  ],
  entryComponents: [ErrorPage],
  providers: [
    { provide: HTTP_INTERCEPTORS, multi: true, useClass: ClientErrorInterceptor },
    { provide: HTTP_INTERCEPTORS, multi: true, useClass: ServerErrorInterceptor }
  ],
  exports: []
})
export class ErrorPagesModule {}
