import { Component, ContentChildren, QueryList, AfterContentInit } from '@angular/core';
import { Expandable } from '../interfaces/expandable';
import { UoaExpandablePanelComponent } from '../uoa-expandable-panel/uoa-expandable-panel.component';

@Component({
  selector: 'uoa-accordion',
  template: '<ng-content></ng-content>',
  styleUrls: ['./uoa-accordion.component.scss']
})
export class UoaAccordionComponent  implements AfterContentInit {
  // waiting for this issue to be resolved in order to use more generic types
  // https://github.com/angular/angular/issues/8563
  @ContentChildren(UoaExpandablePanelComponent) panels: QueryList<Expandable>;
 
  ngAfterContentInit() {
    // Open the first panel
    this.panels.toArray()[0].opened = true;
    // Loop through all panels
    this.panels.toArray().forEach((panel: Expandable) => {
      // subscribe panel toggle event
      panel.toggle.subscribe(() => {
        // Open the panel
        this.openPanel(panel);
      });
    });
  }
 
  openPanel(panel: Expandable) {
    // close all panels
    this.panels.toArray().forEach(p => p.opened = false);
    // open the selected panel
    panel.opened = true;
  }
}