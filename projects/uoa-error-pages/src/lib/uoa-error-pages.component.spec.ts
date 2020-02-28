import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UoaErrorPagesComponent } from './uoa-error-pages.component';

describe('UoaErrorPagesComponent', () => {
  let component: UoaErrorPagesComponent;
  let fixture: ComponentFixture<UoaErrorPagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UoaErrorPagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UoaErrorPagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
