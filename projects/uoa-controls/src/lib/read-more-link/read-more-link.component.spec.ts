import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadMoreLinkComponent } from './read-more-link.component';

describe('ReadMoreLinkComponent', () => {
  let component: ReadMoreLinkComponent;
  let fixture: ComponentFixture<ReadMoreLinkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReadMoreLinkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReadMoreLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
