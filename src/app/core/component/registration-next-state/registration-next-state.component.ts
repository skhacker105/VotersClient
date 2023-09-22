import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { IRegisterVoteType } from '../../models/vote';
import { IRegistrationState } from '../../models/registration-state';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-registration-next-state',
  templateUrl: './registration-next-state.component.html',
  styleUrls: ['./registration-next-state.component.scss']
})
export class RegistrationNextStateComponent implements OnChanges {

  @Input() registration: IRegisterVoteType | undefined;
  @Input() isDiscussionOwner = false;
  @Input() showControl = true;
  @Output() changeState = new EventEmitter<IRegistrationState>();

  isRegistrationOwner = false;

  constructor(private userService: UserService){}

  ngOnChanges(): void {
    this.isRegistrationOwner = this.userService.getProfile()?._id ===this.registration?.createdBy._id
  }
}
