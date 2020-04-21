import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { UoaErrorsConfig } from './../../core/services/uoa-errors-config.service';
import { BypassErrorService } from './../../core/services/bypass-error.service';
import { ErrorContentDto } from './../../core/interfaces';

@Component({
  selector: 'lib-error',
  templateUrl: 'error.page.html',
  styleUrls: ['error.page.scss'],
})
export class ErrorPage {
  private _errorCodes: number[] = [...this._errorConfigService.clientErrorCodes, ...this._errorConfigService.serverErrorCodes];
  public errorCode = 'ErrorCodeDefault';
  public errorObject: ErrorContentDto;

  constructor(private _route: ActivatedRoute, private _errorConfigService: UoaErrorsConfig, private _bypass: BypassErrorService) {
    const httpCode = +this._route.snapshot.paramMap.get('errorCode');
    if (this._errorCodes.includes(httpCode)) {
      this.errorCode = 'ErrorCode' + httpCode;
    }
    this.errorObject = this._errorConfigService.ErrorPageContent[this.errorCode];
  }
}
