import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { ConfirmationDialogComponent } from 'src/app/core/component/confirmation-dialog/confirmation-dialog.component';
import { MATERIAL_ICONS } from 'src/app/core/constants/material-icon';
import { IConfirmationDialogData } from 'src/app/core/models/confirmation-dialog.model';
import { IVoteType } from 'src/app/core/models/vote';
import { LoggerService } from 'src/app/core/services/logger.service';
import { VotingService } from 'src/app/core/services/voting.service';

@Component({
  selector: 'app-add-edit-vote-type',
  templateUrl: './add-edit-vote-type.component.html',
  styleUrls: ['./add-edit-vote-type.component.scss']
})
export class AddEditVoteTypeComponent implements OnInit, OnDestroy {

  id: string | null | undefined;
  isComponentIsActive = new Subject<boolean>();
  voteTypeForm = new FormGroup<any>({
    name: new FormControl<string>('', Validators.required),
    reportName: new FormControl<string>('', Validators.required),
    icon: new FormControl<string>('', Validators.required)
  });
  matIcons = MATERIAL_ICONS.sort();
  filteredMatIcons: string[] = [];

  constructor(
    public votingService: VotingService,
    private loggerService: LoggerService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadAllVoteTypes();
    this.trackIconSearch();
  }

  ngOnDestroy(): void {
    this.isComponentIsActive.next(true);
    this.isComponentIsActive.complete();
  }

  loadAllVoteTypes() {
    this.votingService.getAll()
      .pipe(takeUntil(this.isComponentIsActive))
      .subscribe({
        next: res => {
          this.votingService.allVoteTypes = res.data;
        },
        error: err => {
          this.loggerService.showError(err.error.message);
        }
      })
  }

  trackIconSearch() {
    this.voteTypeForm.controls['icon'].valueChanges
    .pipe(takeUntil(this.isComponentIsActive))
    .subscribe(qry => {
      this.filteredMatIcons = this.matIcons.filter(icon => icon.includes(qry))
    })

  }

  addType() {
    if (this.voteTypeForm.invalid) {
      this.loggerService.showError('Cannot submit incomplete form');
      return;
    }

    (
      this.id
        ? this.votingService.update(this.id, this.voteTypeForm.value)
        : this.votingService.add(this.voteTypeForm.value)
    )
      .pipe(
        takeUntil(this.isComponentIsActive)
      ).subscribe({
        next: res => {
          this.loggerService.show('Voting type saved');
          this.voteTypeForm.reset();
          this.voteTypeForm.clearValidators();
          this.voteTypeForm.markAsPristine();
          this.loadAllVoteTypes();
        },
        error: err => {
          this.loggerService.showError(err.error.error);
        }
      });
  }
  cancelEdit() {
    this.id = undefined;
    this.voteTypeForm.reset();
  }

  handleEdit(vote: IVoteType) {
    this.id = vote._id;
    this.voteTypeForm.patchValue(vote);
  }

  handleDeleteVote(vote: IVoteType) {
    const config: IConfirmationDialogData = {
      message: `Delete "${vote.name}"?`,
      okDisplay: 'Delete',
      cancelDisplay: 'Cancel',
      color: 'warn'
    };
    const ref = this.dialog.open(ConfirmationDialogComponent, {
      data: config
    })
    ref.afterClosed()
      .pipe(takeUntil(this.isComponentIsActive))
      .subscribe(result => result ? this.deleteVote(vote) : null)
  }

  deleteVote(vote: IVoteType) {
    this.votingService.delete(vote._id)
      .pipe(takeUntil(this.isComponentIsActive))
      .subscribe({
        next: res => {
          this.loadAllVoteTypes();
        },
        error: err => {
          this.loggerService.showError(err.error.error );
        }
      })
  }

}
