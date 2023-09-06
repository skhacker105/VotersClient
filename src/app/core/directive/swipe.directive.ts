import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appSwipe]'
})
export class SwipeDirective {

  swipeCoord: number[] = [];
  swipeTime: number = 0;
  @Output() swipe = new EventEmitter<number>();

  constructor() { }

  @HostListener('touchstart', ['$event'])
  handleTouchStart(e: TouchEvent) {
    const coord: [number, number] = [e.changedTouches[0].clientX, e.changedTouches[0].clientY];
    const time = new Date().getTime();
    this.swipeCoord = coord;
    this.swipeTime = time;
  }

  @HostListener('touchend', ['$event'])
  handleTouchEnd(e: TouchEvent) {
    const coord: [number, number] = [e.changedTouches[0].clientX, e.changedTouches[0].clientY];
    const time = new Date().getTime();
    const direction = [coord[0] - this.swipeCoord[0], coord[1] - this.swipeCoord[1]];
    const duration = time - this.swipeTime;
    if (duration < 1000 //
      && Math.abs(direction[0]) > 30 // Long enough
      && Math.abs(direction[0]) > Math.abs(direction[1] * 3)) { // Horizontal enough
      const swipe = direction[0] < 0 ? 1 : -1;
      this.swipe.emit(swipe);
    }

  }

}
