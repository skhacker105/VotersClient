import { Component, Input } from '@angular/core';
import { Discussion } from '../../models/discussion';

@Component({
  selector: 'app-discussion-register',
  templateUrl: './discussion-register.component.html',
  styleUrls: ['./discussion-register.component.scss']
})
export class DiscussionRegisterComponent {
  @Input() discussion: Discussion | undefined;
}
