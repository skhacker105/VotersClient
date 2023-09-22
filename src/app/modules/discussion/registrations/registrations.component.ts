import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { REGISTRATION_STATE } from 'src/app/core/constants/registration-state';
import { Discussion } from 'src/app/core/models/discussion';
import { IRegistrationState } from 'src/app/core/models/registration-state';
import { IUser } from 'src/app/core/models/user';
import { IRegisterCategory, IRegisterVoteType } from 'src/app/core/models/vote';
import { DiscussionService } from 'src/app/core/services/discussion.service';
import { LoggerService } from 'src/app/core/services/logger.service';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-registrations',
  templateUrl: './registrations.component.html',
  styleUrls: ['./registrations.component.scss']
})
export class RegistrationsComponent implements OnInit, OnDestroy {

  id: string | undefined | null;
  loginProfile: IUser | undefined;
  discussion: Discussion | undefined;
  isComponentIsActive = new Subject<boolean>();
  registrationStates = REGISTRATION_STATE;
  registrationStateKeys = Object.keys(REGISTRATION_STATE);
  selectedIndex = 0;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private discussionService: DiscussionService,
    private loggerService: LoggerService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.loginProfile = this.userService.getProfile();
    this.loadDiscussionDetail();
  }

  ngOnDestroy(): void {
    this.isComponentIsActive.next(true);
    this.isComponentIsActive.complete();
  }

  loadDiscussionDetail() {
    if (!this.id) return;
    this.discussionService.get(this.id)
      .pipe(takeUntil(this.isComponentIsActive))
      .subscribe({
        next: res => {
          if (!res.data) {
            this.loggerService.showError('Cannot find Discussion');
            this.router.navigateByUrl('/home');
            return;
          }

          this.discussion = res.data;
          this.loadReleventTab();
        },
        error: err => this.loggerService.showError(err.error.message)
      });
  }

  loadReleventTab() {
    const idx = this.registrationStateKeys.findIndex(rs => {
      const catdata = this.getCategoryData(rs);
      if (catdata && catdata.registrations.length > 0) return true;
      return false;
    });
    if (idx >= 0) this.selectedIndex = idx;
  }

  getCategoryData(state: string): IRegisterCategory | undefined {
    return this.discussion?.registrationCategories.find(rc => rc.category === state)
  }

  getLabelText(state: string) {
    let name = this.registrationStates[state].text;
    const cd = this.getCategoryData(state);
    if (cd) name += ' (' + cd.registrations.length + ')'
    return name;
  }

  handleRegistrationStateChange(registration: IRegisterVoteType, newState: IRegistrationState) {
    if (!this.discussion) return;

    this.discussion.confirmRegistrationStateChange(registration, newState)
      .then(result => {
        if (!result) return;
        this.saveNewRegistrationState(registration, newState);
      });
  }

  saveNewRegistrationState(registration: IRegisterVoteType, newState: IRegistrationState) {
    if (!this.discussion || !registration._id) return;

    this.discussionService.updateRegistrationState(this.discussion._id, registration._id, newState.key)
      .pipe(takeUntil(this.isComponentIsActive))
      .subscribe({
        next: () => {
          if (!this.discussion) return;

          this.discussion.changeRegistrationState(registration, newState)
        },
        error: err => this.loggerService.showError(err.error.message)
      });
  }

}
