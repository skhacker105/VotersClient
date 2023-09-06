import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ConfirmationDialogComponent } from 'src/app/core/component/confirmation-dialog/confirmation-dialog.component';
import { InputTextAreaComponent } from 'src/app/core/component/input-text-area/input-text-area.component';
import { IConfirmationDialogData } from 'src/app/core/models/confirmation-dialog.model';
import { Discussion } from 'src/app/core/models/discussion';
import { IInputTextAreaData } from 'src/app/core/models/input-text-area';
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
          this.discussion = res.data;
          this.isOwner = this.loginProfile?._id === this.discussion?.createdBy._id;
        },
        error: err => this.loggerService.showError(err.error.message)
      });
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
    console.log('existingvote = ', existingvote, vote)
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

  isMyVote(votetype?: IVoteType): boolean {
    if (!this.discussion || !votetype || !this.loginProfile) return false;
    return this.discussion.isMyVote(votetype, this.loginProfile);
  }

  getVoteCategoryCount(votetype?: IVoteType): number {
    if (!this.discussion || !votetype) return 0;

    const existingCategory = this.discussion.voteCategories.find(cat => cat.category._id === votetype._id)
    if (!existingCategory) return 0;

    return existingCategory.votes.length;
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
}
