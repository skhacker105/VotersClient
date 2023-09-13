import { animate, AUTO_STYLE, style, transition, trigger } from "@angular/animations";


const DEFAULT_DURATION = '200';

export const ExpandCollapseAnimation = trigger('expandCollapseAnimation', [
  transition(
    ':enter',
    [
      style({ height: 0, opacity: 0 }),
      animate(DEFAULT_DURATION + 'ms ease-out',
        style({ height: AUTO_STYLE, opacity: 1 }))
    ]
  ),
  transition(
    ':leave',
    [
      style({ height: AUTO_STYLE, opacity: 1 }),
      animate(DEFAULT_DURATION + 'ms ease-in',
        style({ height: 0, opacity: 0 }))
    ]
  )
]);