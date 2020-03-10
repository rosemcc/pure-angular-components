import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Expandable } from '../interfaces/expandable';
import { SlideUpDownAnimation } from '../../theme/animations';

@Component({
  selector: 'uoa-expandable-panel',
  animations: [SlideUpDownAnimation],
  template: `
  <div class="panel panel-info" [ngClass]="{'open': opened==true}">
    <div class="panel-heading" (click)="toggle.emit()">
      {{title}}
      <ion-button size="small" class="ion-float-right" (click)="togglePinned">PIN</ion-button>
    </div>
    <div class="panel-heading-chevron" (click)="toggle.emit()"></div>
    <div class="panel-body" [@slideUpDown]="opened">
      <ng-content></ng-content>
    </div>
    <div class="panel-thumbtab" [@slideLeftThumbTab]="opened"></div>
  <div>
  `,
  styleUrls: ['./uoa-expandable-panel.component.scss']
})
export class UoaExpandablePanelComponent implements Expandable {
  @Input() opened = false;
  @Input() title: string;
  @Output() toggle: EventEmitter<any> = new EventEmitter<any>();
  @Output() pinned: EventEmitter<boolean> = new EventEmitter<boolean>();

  public isPinned: boolean = false;

  togglePinned() {
    this.pinned.emit(this.isPinned);
  }
}