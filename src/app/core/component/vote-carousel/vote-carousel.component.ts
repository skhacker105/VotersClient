import { Component, Input, OnInit } from '@angular/core';
import { IVote } from '../../models/vote';

@Component({
  selector: 'app-vote-carousel',
  templateUrl: './vote-carousel.component.html',
  styleUrls: ['./vote-carousel.component.scss']
})
export class VoteCarouselComponent implements OnInit {

  @Input() vote: IVote | undefined;
  color = '#366f63'

  ngOnInit(): void {
    this.generateRandomColor();
  }

  generateRandomColor() {
    const randomBetween = (min: number, max: number) => min + Math.floor(Math.random() * (max - min + 1));
    const r = randomBetween(80, 200);
    const g = randomBetween(80, 200);
    const b = randomBetween(80, 200);
    this.color = `rgb(${r},${g},${b})`;
  }
}