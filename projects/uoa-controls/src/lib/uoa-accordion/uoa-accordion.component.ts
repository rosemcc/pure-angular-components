import { Component, ContentChildren, QueryList, AfterContentInit, Input, Output, EventEmitter } from '@angular/core';
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
  @Input() firstPanelStartsOpen: boolean = false;
  @Input() multiSelect: boolean = false;
  @Output() expanded = new EventEmitter<Expandable>();

  ngAfterContentInit() {
    // Open the first panel
    if (this.firstPanelStartsOpen) {
      this.panels.toArray()[0].opened = true;
    }
    // Loop through all panels
    this.panels.toArray().forEach((panel: Expandable) => {
      // subscribe panel toggle event
      panel.toggle.subscribe(() => {
        // Open the panel
        this.openPanel(panel);
        this.expanded.emit(panel);
      });
    });
  }
 
  openPanel(panel: Expandable) {
    // close all panels
    if (!this.multiSelect) {
      this.panels.toArray().forEach(p => p.opened = false);
    }
    // toggle the selected panel
    panel.opened = !panel.opened;
  }
}