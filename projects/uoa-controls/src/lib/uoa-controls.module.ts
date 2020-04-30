import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';  
import { UoaTextboxComponent } from './uoa-textbox/uoa-textbox.component';
import { UoaExpandablePanelComponent } from './uoa-expandable-panel/uoa-expandable-panel.component';
import { UoaAccordionComponent } from './uoa-accordion/uoa-accordion.component';
import { ReadMoreLinkComponent } from './read-more-link/read-more-link.component';

@NgModule({
  declarations: [UoaTextboxComponent, UoaExpandablePanelComponent, UoaAccordionComponent, ReadMoreLinkComponent],
  imports: [CommonModule],
  exports: [UoaTextboxComponent, UoaExpandablePanelComponent, UoaAccordionComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class UoaControlsModule { }
