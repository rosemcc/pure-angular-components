import { TestBed } from '@angular/core/testing';

import { LoginSuccessGuard } from './login-success.guard';

describe('LoginSuccessGuard', () => {
  let guard: LoginSuccessGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(LoginSuccessGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
