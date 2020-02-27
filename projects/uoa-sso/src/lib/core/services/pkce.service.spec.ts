import { TestBed } from '@angular/core/testing';

import { PkceService } from './auth.pkce.service';

describe('Auth.Pkce.ServiceService', () => {
  let service: PkceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PkceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
