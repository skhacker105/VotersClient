import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { IVoteType } from '../../models/vote';

@Component({
  selector: 'app-mat-vote-type',
  templateUrl: './mat-vote-type.component.html',
  styleUrls: ['./mat-vote-type.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MatVoteTypeComponent {

  @Input() voteType: IVoteType | undefined;
  @Input() disabled = false;
  @Input() matBadge = 0;
  @Input() matBadgeHidden = true;
  @Output() voteTypeClick = new EventEmitter<IVoteType>();
}
