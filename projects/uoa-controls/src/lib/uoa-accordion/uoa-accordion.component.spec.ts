import { Component, ViewChild } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { UoaAccordionComponent } from './uoa-accordion.component';
import { UoaExpandablePanelComponent } from '../uoa-expandable-panel/uoa-expandable-panel.component';

@Component({
    selector: 'uoa-accordion-with-mock-data-positive',
    template: `
      <uoa-accordion firstPanelStartsOpen="true" multiSelect="true">
          <uoa-expandable-panel>Mock data</uoa-expandable-panel>
          <uoa-expandable-panel>Different mock data</uoa-expandable-panel>
      </uoa-accordion>
    `
})

class MockUoaAccordionWrapperPositive {
    @ViewChild(UoaAccordionComponent, {static: true}) accordion: UoaAccordionComponent;
}
@Component({
  selector: 'uoa-accordion-with-mock-negative',
  template: `
    <uoa-accordion>
        <uoa-expandable-panel>Mock data</uoa-expandable-panel>
        <uoa-expandable-panel>Different mock data</uoa-expandable-panel>
    </uoa-accordion>
  `
})
class MockUoaAccordionWrapperNegative {
  @ViewChild(UoaAccordionComponent, {static: true}) accordion: UoaAccordionComponent;
}

/*
Positive cases
*/
describe('UoaAccordionComponent: firstPanelStartsOpen, multiSelect', () => {
  let accordion: UoaAccordionComponent;
  let fixture: ComponentFixture<MockUoaAccordionWrapperPositive>;
  
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
            MockUoaAccordionWrapperPositive,
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
    fixture = TestBed.createComponent(MockUoaAccordionWrapperPositive);
    accordion = fixture.componentInstance.accordion;
    fixture.detectChanges();
  });

  it('should exist when created in another component', () => {
    expect(accordion).toBeTruthy();
  });

  it('opens the first panel on init', () => {
    accordion.ngAfterContentInit();
    expect(accordion.panels.toArray()[0].opened).toBeTruthy();
    expect(accordion.panels.toArray()[1].opened).toBeFalsy();
  });
  
  it('toggles both panels when clicked', () => {
    let headers = fixture.debugElement.nativeElement.querySelectorAll('.panel-heading');
    headers[0].click();
    headers[1].click();
    
    expect(accordion.panels.toArray()[0].opened).toBeFalsy(); // remember we also set this one to start open
    expect(accordion.panels.toArray()[1].opened).toBeTruthy();
  });
  
});

/*
Negative cases
*/
describe('UoaAccordionComponent: default', () => {
  let accordion: UoaAccordionComponent;
  let fixture: ComponentFixture<MockUoaAccordionWrapperNegative>;
  
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
            MockUoaAccordionWrapperNegative,
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
    fixture = TestBed.createComponent(MockUoaAccordionWrapperNegative);
    accordion = fixture.componentInstance.accordion;
    fixture.detectChanges();
  });

  it('does not open the first panel on init', () => {
    accordion.ngAfterContentInit();
    expect(accordion.panels.toArray()[0].opened).toBeFalsy();
    expect(accordion.panels.toArray()[1].opened).toBeFalsy();
  });
  
  it('leaves just one panel open after two were clicked', () => {
    let headers = fixture.debugElement.nativeElement.querySelectorAll('.panel-heading');
    headers[0].click();
    headers[1].click();
    expect(accordion.panels.toArray()[0].opened).toBeFalsy();
    expect(accordion.panels.toArray()[1].opened).toBeTruthy();
  });
  
});

