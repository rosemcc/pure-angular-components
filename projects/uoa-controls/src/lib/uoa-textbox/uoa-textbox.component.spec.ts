import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UoaTextboxComponent } from './uoa-textbox.component';

describe('UoaControlsComponent', () => {
  let component: UoaTextboxComponent;
  let fixture: ComponentFixture<UoaTextboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UoaTextboxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UoaTextboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
