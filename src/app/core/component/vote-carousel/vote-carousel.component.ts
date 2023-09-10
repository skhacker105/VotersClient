import { Component, Input, OnInit } from '@angular/core';
import { IVote } from '../../models/vote';
import { DomSanitizer } from '@angular/platform-browser';
import { HelperService } from '../../utilities/helper';

@Component({
  selector: 'app-vote-carousel',
  templateUrl: './vote-carousel.component.html',
  styleUrls: ['./vote-carousel.component.scss']
})
export class VoteCarouselComponent implements OnInit {

  @Input() vote: IVote | undefined;
  color = '#366f63'
  sanitaizedData: any;
  constructor(private _sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.generateRandomColor();
    if (this.vote)
      this.sanitaizedData = this._sanitizer.bypassSecurityTrustHtml(this.vote.message);
  }

  generateRandomColor() {
    this.color = HelperService.generateRandomCoolColors(this.vote?.user.name)
  }
}
