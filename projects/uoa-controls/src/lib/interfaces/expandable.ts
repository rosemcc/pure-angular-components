import { EventEmitter } from '@angular/core';
 
export interface Expandable {
    opened: boolean;
    title: string;
    toggle: EventEmitter<any>;
}