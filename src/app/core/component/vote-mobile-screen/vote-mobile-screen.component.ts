import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IVote } from '../../models/vote';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-vote-mobile-screen',
  templateUrl: './vote-mobile-screen.component.html',
  styleUrls: ['./vote-mobile-screen.component.scss']
})
export class VoteMobileScreenComponent implements OnInit {

  @Input() vote: IVote | undefined;
  @Input() showActionButton = false;
  @Output() onEditClick = new EventEmitter<void>();
  @Output() onDeleteClick = new EventEmitter<void>();
  color = '#366f63'
  sanitaizedData: any;

  constructor(private _sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.generateRandomColor();
    if (this.vote)
      this.sanitaizedData = this._sanitizer.bypassSecurityTrustHtml(this.vote.message);
  }

  generateRandomColor() {
    const randomBetween = (min: number, max: number) => min + Math.floor(Math.random() * (max - min + 1));
    const r = randomBetween(80, 200);
    const g = randomBetween(80, 200);
    const b = randomBetween(80, 200);
    this.color = `rgb(${r},${g},${b})`;
  }
}
