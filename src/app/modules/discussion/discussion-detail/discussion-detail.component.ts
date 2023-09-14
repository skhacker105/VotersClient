import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subject, take, takeUntil } from 'rxjs';
import { ConfirmationDialogComponent } from 'src/app/core/component/confirmation-dialog/confirmation-dialog.component';
import { IConfirmationDialogData } from 'src/app/core/models/confirmation-dialog.model';
import { Discussion } from 'src/app/core/models/discussion';
import { IDiscussionState } from 'src/app/core/models/discussion-state';
import { IUser } from 'src/app/core/models/user';
import { IVote, IVoteType } from 'src/app/core/models/vote';
import { DiscussionService } from 'src/app/core/services/discussion.service';
import { LoggerService } from 'src/app/core/services/logger.service';
import { UserService } from 'src/app/core/services/user.service';
import { VotingService } from 'src/app/core/services/voting.service';

@Component({
  selector: 'app-discussion-detail',
  templateUrl: './discussion-detail.component.html',
  styleUrls: ['./discussion-detail.component.scss']
})
export class DiscussionDetailComponent implements OnInit, OnDestroy {

  isOwner = false;
  id: string | null | undefined;
  ui_id: string | null | undefined;
  loginProfile: IUser | undefined;
  discussion: Discussion | undefined;
  isComponentIsActive = new Subject<boolean>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private discussionService: DiscussionService,
    private loggerService: LoggerService,
    private dialog: MatDialog,
    private userService: UserService,
    public votingService: VotingService
  ) { }

  ngOnInit(): void {
    this.loginProfile = this.userService.getProfile();

    this.id = this.route.snapshot.paramMap.get('id');
    this.ui_id = this.route.snapshot.queryParamMap.get('ui_id');
    this.loadDiscussionDetail();
    this.trackURLForVoteType();
  }

  ngOnDestroy(): void {
    this.isComponentIsActive.next(true);
    this.isComponentIsActive.complete();
  }

  trackURLForVoteType() {
    this.router.events.pipe(takeUntil(this.isComponentIsActive))
      .subscribe(event => {
        this.ui_id = this.route.snapshot.queryParamMap.get('ui_id');
        if (event instanceof NavigationEnd && this.discussion) this.checkLoadVoteType()
      })
  }

  loadDiscussionDetail() {
    if (!this.id) return;
    this.discussionService.get(this.id)
      .pipe(takeUntil(this.isComponentIsActive))
      .subscribe({
        next: res => {
          this.discussion = res.data;
          this.isOwner = this.loginProfile?._id === this.discussion?.createdBy._id;
          this.checkLoadVoteType();
        },
        error: err => this.loggerService.showError(err.error.message)
      });
  }

  checkLoadVoteType() {
    if (!this.id || !this.ui_id || !this.discussion) return;

    const voteType = this.discussion.voteTypes.find(vt => vt.ui_id === this.ui_id)
    if (!voteType) {
      this.loggerService.showError('Selected Voting Option no available');
      this.router.navigate(['/discussion/discussionDetail/', this.id]);
    }
    else this.voteDiscussion(voteType);
  }

  redirectToVoteType(voteType: IVoteType) {
    if (!this.id) return;

    this.router.navigateByUrl(`/discussion/discussionDetail/${this.id}/voteType?ui_id=${voteType.ui_id}`);
  }

  handleDeleteDiscussion() {
    if (!this.discussion) return;

    const config: IConfirmationDialogData = {
      message: `Delete "${this.discussion.title}"?`,
      okDisplay: 'Delete',
      cancelDisplay: 'Cancel',
      color: 'warn'
    };
    const ref = this.dialog.open(ConfirmationDialogComponent, {
      data: config
    })
    ref.afterClosed()
      .pipe(takeUntil(this.isComponentIsActive))
      .subscribe(result => {
        result ? this.deleteDiscussion() : null
      })
  }

  deleteDiscussion() {
    if (!this.discussion) return;

    this.discussionService.delete(this.discussion._id)
      .pipe(takeUntil(this.isComponentIsActive))
      .subscribe({
        next: (res) => {
          this.router.navigateByUrl('/');
        },
        error: (err: any) => {
          this.loggerService.showError(err.error.message)
        }
      });
  }

  voteDiscussion(voteType: IVoteType) {
    const afterClosedObs = this.discussion?.voteDiscussion(voteType, this.loginProfile)

    afterClosedObs
    ?.pipe(take(1))
    .subscribe(res => {
      this.router.navigate(['./'], { relativeTo: this.route });
    })
  }

  handleDeleteVote(vote: IVote) {
    if (!this.discussion) return;

    const config: IConfirmationDialogData = {
      message: `Delete "${vote.message}"?`,
      okDisplay: 'Delete',
      cancelDisplay: 'Cancel',
      color: 'warn'
    };
    const ref = this.dialog.open(ConfirmationDialogComponent, {
      data: config
    })
    ref.afterClosed()
      .pipe(takeUntil(this.isComponentIsActive))
      .subscribe(result => {
        result ? this.deleteVote(vote) : null
      })
  }

  deleteVote(vote: IVote) {
    if (!this.discussion) return;

    this.votingService.deleteVote(vote._id)
      .pipe(takeUntil(this.isComponentIsActive))
      .subscribe({
        next: (res) => {
          this.router.navigateByUrl('/');
        },
        error: (err: any) => {
          this.loggerService.showError(err.error.message)
        }
      });
  }

  handleChangeState(newState: IDiscussionState) {
    if (!this.discussion) return;
    this.discussion.confirmForStateChange(newState)
      .then(result => {
        if (result) this.changeState(newState)
      })
      .catch(err => { this.loggerService.showError(err); console.log('error: ', err) })
  }

  changeState(newState: IDiscussionState) {
    if (!this.discussion) return;

    this.discussionService.updateState(this.discussion._id, newState)
      .pipe(takeUntil(this.isComponentIsActive))
      .subscribe({
        next: res => this.discussion?.changeState(newState),
        error: err => this.loggerService.showError(err)
      })
  }

  isLessThanToday(dt: Date): boolean {
    const today = new Date();
    const newDT = new Date(dt);
    newDT.setHours(23,59,59,999);
    return newDT.getTime() < today.getTime()
  }
}
