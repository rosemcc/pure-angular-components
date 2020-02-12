import { Component, ViewChild } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { UoaAccordionComponent } from './uoa-accordion.component';
import { UoaExpandablePanelComponent } from '../uoa-expandable-panel/uoa-expandable-panel.component';

@Component({
    selector: 'uoa-accordion-with-mock-data',
    template: `
    <uoa-accordion>
        <uoa-expandable-panel>Mock data</uoa-expandable-panel>
        <uoa-expandable-panel>Different mock data</uoa-expandable-panel>
    </uoa-accordion>
    `
})
class MockUoaAccordionWrapper {
    @ViewChild(UoaAccordionComponent, {static: true}) accordion: UoaAccordionComponent;
}

describe('EmbeddedDetailsComponent', () => {
  let component: UoaAccordionComponent;
  let fixture: ComponentFixture<MockUoaAccordionWrapper>;
  
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
            MockUoaAccordionWrapper,
            UoaAccordionComponent,
            UoaExpandablePanelComponent
        ],
        imports: [
            NoopAnimationsModule
        ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MockUoaAccordionWrapper);
    component = fixture.componentInstance.accordion;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('opens the first panel on init', () => {
    component.ngAfterContentInit();
    expect(component.panels.toArray()[0].opened).toBeTruthy();
    expect(component.panels.toArray()[1].opened).toBeFalsy();
  });
  
});
