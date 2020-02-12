import { TestBed } from '@angular/core/testing';

import { UoaControlsService } from './uoa-controls.service';

describe('UoaControlsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UoaControlsService = TestBed.get(UoaControlsService);
    expect(service).toBeTruthy();
  });
});
