import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Discussion } from '../../models/discussion';
import { IDiscussionState } from '../../models/discussion-state';

@Component({
  selector: 'app-discussion-next-state',
  templateUrl: './discussion-next-state.component.html',
  styleUrls: ['./discussion-next-state.component.scss']
})
export class DiscussionNextStateComponent {

  @Input() discussion: Discussion | undefined;
  @Input() showControl = true;
  @Output() changeState = new EventEmitter<IDiscussionState>()
}
