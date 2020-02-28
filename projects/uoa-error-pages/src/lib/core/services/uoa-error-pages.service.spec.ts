import { TestBed } from '@angular/core/testing';

import { UoaErrorPagesService } from './uoa-error-pages.service';

describe('UoaErrorPagesService', () => {
  let service: UoaErrorPagesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UoaErrorPagesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
