import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Discussion } from '../../models/discussion';
import { IRegistrationState } from '../../models/registration-state';

@Component({
  selector: 'app-discussion-register',
  templateUrl: './discussion-register.component.html',
  styleUrls: ['./discussion-register.component.scss']
})
export class DiscussionRegisterComponent {
  @Input() discussion: Discussion | undefined;
  @Output() changeState = new EventEmitter<IRegistrationState>();
}
