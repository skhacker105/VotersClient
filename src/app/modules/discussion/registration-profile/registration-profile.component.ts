import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Discussion } from 'src/app/core/models/discussion';
import { IRegistrationState } from 'src/app/core/models/registration-state';
import { IUser } from 'src/app/core/models/user';
import { IRegisterVoteType } from 'src/app/core/models/vote';
import { DiscussionService } from 'src/app/core/services/discussion.service';
import { LoggerService } from 'src/app/core/services/logger.service';

@Component({
  selector: 'app-registration-profile',
  templateUrl: './registration-profile.component.html',
  styleUrls: ['./registration-profile.component.scss']
})
export class RegistrationProfileComponent implements OnInit, OnDestroy {

  id: string | undefined | null;
  ui_id: string | undefined | null;
  loginProfile: IUser | undefined;
  discussion: Discussion | undefined;
  selectedRegistration: IRegisterVoteType | undefined;
  isComponentIsActive = new Subject<boolean>();

  constructor(
    private discussionService: DiscussionService,
    private loggerService: LoggerService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.ui_id = this.route.snapshot.paramMap.get('ui_id');
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
          this.findAndLoadRegistration();
        },
        error: err => this.loggerService.showError(err.error.message)
      });
  }

  findAndLoadRegistration() {
    if (!this.discussion || !this.ui_id) return;

    this.selectedRegistration = this.discussion.registrations.find(r => r.ui_id === this.ui_id);
  }

  handleRegistrationStateChange(newState: IRegistrationState) {
    if (!this.discussion || !this.selectedRegistration) return;

    this.discussion.confirmRegistrationStateChange(this.selectedRegistration, newState)
      .then(result => {
        if (!result) return;
        this.saveNewRegistrationState(newState);
      });
  }

  saveNewRegistrationState(newState: IRegistrationState) {
    if (!this.discussion || !this.selectedRegistration || !this.selectedRegistration._id) return;

    this.discussionService.updateRegistrationState(this.discussion._id, this.selectedRegistration._id, newState.key)
    .pipe(takeUntil(this.isComponentIsActive))
    .subscribe({
      next: () => {
        if (!this.discussion || !this.selectedRegistration) return;

        this.discussion.changeRegistrationState(this.selectedRegistration, newState)
      },
      error: err => this.loggerService.showError(err.error.message)
    });
  }
}
