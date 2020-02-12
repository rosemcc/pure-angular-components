import { trigger, state, style, transition, animate, group, query, stagger, keyframes } from '@angular/animations';

export const SlideUpDownAnimation = [
  trigger('slideUpDown', [
    state('0', style({ 'max-height': '0px', padding: '0px' })),
    state('1', style({ 'max-height': '500px', padding: '14px' })),
    
    transition(':enter', 
    [
      style({ 'max-height': '0px', padding: '0px' })
    ]),
    transition('* => *', 
    [
      animate('250ms ease-in-out')
    ])
  ]),
  trigger('slideLeftThumbTab', [
    state('0', style({ 'width': '3px' })),
    state('1', style({ 'width': '6px' })),
    
    transition(':enter', 
    [
      style({ 'width': '3px' })
    ]),
    transition('* => *', 
    [
      animate('250ms ease-in-out')
    ]),
  ]),
  
];


/*
export const SlideUpDownAnimation = [
  trigger('slideUpDown', [
    state('0', style({ 'max-height': '0px', padding: '0px' })),
    state('1', style({ 'max-height': '500px', padding: '14px' })),
    
    transition(':enter', 
      [
        group([
          query('.panel-thumbtab', [
            style({ 'width': '3px' }),
            animate('250ms ease-in-out')
          ]),
          query('.panel-body', [
            style({ 'max-height': '0px', padding: '0px' }),
            animate('250ms ease-in-out')
          ])
        ])
      ]),
    transition('* => *', 
    [
      group([
        query('.panel-thumbtab', [
          style({ 'width': '6px' }),
          animate('250ms ease-in-out')
        ]),
        query('.panel-body', [
          style({ 'max-height': '500px', padding: '14px' }),
          animate('250ms ease-in-out')
        ])
      ])
    ]),
  ])
];
*/