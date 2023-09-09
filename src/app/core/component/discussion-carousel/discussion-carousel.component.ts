import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Discussion } from '../../models/discussion';
import { VotingService } from '../../services/voting.service';
import { UserService } from '../../services/user.service';
import { IVote, IVoteType } from '../../models/vote';
import { MatDialog } from '@angular/material/dialog';
import { InputTextAreaComponent } from '../input-text-area/input-text-area.component';
import { Subject, takeUntil } from 'rxjs';
import { IUser } from '../../models/user';
import { LoggerService } from '../../services/logger.service';
import { DiscussionService } from '../../services/discussion.service';
import { IInputTextAreaData } from '../../models/input-text-area';
import { IConfirmationDialogData } from '../../models/confirmation-dialog.model';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-discussion-carousel',
  templateUrl: './discussion-carousel.component.html',
  styleUrls: ['./discussion-carousel.component.scss']
})
export class DiscussionCarouselComponent implements OnInit, OnDestroy {

  @Input() id: string | undefined;
  @Input() discussion: Discussion | undefined;

  isOwner = false;
  isDeleted = false;
  loginProfile: IUser | undefined;
  isComponentIsActive = new Subject<boolean>();

  constructor(
    private votingService: VotingService,
    private userService: UserService,
    private dialog: MatDialog,
    private loggerService: LoggerService,
    private discussionService: DiscussionService
  ) { }

  ngOnInit(): void {
    this.loginProfile = this.userService.getProfile();
    this.isOwner = this.loginProfile?._id === this.discussion?.createdBy._id;
  }

  ngOnDestroy(): void {
    this.isComponentIsActive.next(true);
    this.isComponentIsActive.complete();
  }

  voteDiscussion(voteType: IVoteType) {
    if (!this.discussion || !this.loginProfile) return;

    const existingvote = this.discussion.existingVoteByType(this.loginProfile);
    const data: IInputTextAreaData = { message: existingvote ? existingvote.message : '' }
    const ref = this.dialog.open(InputTextAreaComponent,
      {
        panelClass: 'input-textarea-popup',
        data: data
      }
    )
    ref.afterClosed()
      .pipe(takeUntil(this.isComponentIsActive))
      .subscribe(res => {
        if (res) this.saveVote(res, voteType);
      })

  }

  saveVote(message: string, voteType: IVoteType) {
    if (!this.discussion || !this.loginProfile) return;

    const existingvote = this.discussion.userHasAlreadyVoted(this.loginProfile);
    const newVote = {
      discussion: this.discussion._id,
      message: message,
      user: this.loginProfile._id,
      voteType: voteType
    };

    (
      existingvote
        ? this.votingService.editVote(existingvote._id, newVote)
        : this.votingService.addVote(newVote)
    )
      .pipe(takeUntil(this.isComponentIsActive))
      .subscribe({
        next: (res) => {
          this.updateDiscussionVote(res.data)
        },
        error: (err: any) => {
          this.loggerService.showError(err.error.message)
        }
      });
  }

  updateDiscussionVote(vote: IVote) {
    if (!this.discussion || !this.loginProfile) return;

    const existingvote = this.discussion.userHasAlreadyVoted(this.loginProfile);
    if (existingvote) {
      if (this.discussion) this.discussion.updateVote(vote);
    } else {
      this.discussionService.vote(this.discussion._id, vote._id)
        .pipe(takeUntil(this.isComponentIsActive))
        .subscribe({
          next: (res) => {
            if (res.data && this.discussion) this.discussion.addVote(vote);
          },
          error: (err: any) => {
            this.loggerService.showError(err.error.message)
          }
        });
    }
  }

  getVoteCategoryCount(votetype?: IVoteType): number {
    if (!this.discussion || !votetype) return 0;

    const existingCategory = this.discussion.voteCategories.find(cat => cat.category.ui_id === votetype.ui_id)
    if (!existingCategory) return 0;

    return existingCategory.votes.length;
  }

  isMyVote(votetype?: IVoteType): boolean {
    if (!this.discussion || !votetype || !this.loginProfile) return false;
    return this.discussion.isMyVote(votetype, this.loginProfile);
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
          this.isDeleted = true;
        },
        error: (err: any) => {
          this.loggerService.showError(err.error.message)
        }
      });
  }

  handleChangeState(newState: string) {
    if (!this.discussion) return;
    this.discussion.confirmForStateChange(newState)
      .then(result => {
        if (result) this.changeState(newState)
      })
      .catch(err => this.loggerService.showError(err))
  }

  changeState(newState: string) {
    if (!this.discussion) return;

    this.discussionService.updateState(this.discussion._id, newState)
      .pipe(takeUntil(this.isComponentIsActive))
      .subscribe({
        next: res => this.discussion?.changeState(newState),
        error: err => this.loggerService.showError(err)
      })
  }
}
