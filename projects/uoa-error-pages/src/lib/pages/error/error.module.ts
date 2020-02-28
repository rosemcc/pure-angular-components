import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { HeaderModule, FooterModule } from 'projects/uoa-error-pages/src/lib/components';
import { ErrorPage } from './error.page';

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
  entryComponents: [ErrorPage]
})
export class ApplicationErrorPageModule {}
