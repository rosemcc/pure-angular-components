import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
// import { Model, NavigationService } from '../../core';

@Component({
  selector: 'uoa-error',
  templateUrl: 'error.page.html'
})
export class ErrorPage {
  errorCode = 'ErrorCodeDefault';

  constructor(private route: ActivatedRoute) {
    // this.model.appId = null;
    const code = this.route.snapshot.paramMap.get('errorCode');
    if (code) {
      this.errorCode = 'ErrorCode' + code;
    }
    //  this.model.pageNotFoundInitialized = true;
  }

  pageReinitialize() {
    // this.model.pageNotFoundInitialized = false;
    //  this.navigationService.gotoApplicantOverview();
    setTimeout(() => {
      window.location.reload();
    }, 100);
  }

  navigateToAgency() {
    // this.model.pageNotFoundInitialized = false;
    // this.navigationService.gotoAgency();
  }
}
