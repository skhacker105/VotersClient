import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Discussion } from 'src/app/core/models/discussion';
import { IUser } from 'src/app/core/models/user';
import { DiscussionService } from 'src/app/core/services/discussion.service';
import { LoggerService } from 'src/app/core/services/logger.service';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-add-edit-discussion',
  templateUrl: './add-edit-discussion.component.html',
  styleUrls: ['./add-edit-discussion.component.scss']
})
export class AddEditDiscussionComponent implements OnInit, OnDestroy {

  id: string | null | undefined;
  isComponentIsActive = new Subject<boolean>();
  loginProfile: IUser | undefined;
  discussionForm = new FormGroup<any>({
    title: new FormControl<string>('', Validators.required),
    message: new FormControl<string>('', Validators.required)
  });

  constructor(
    private route: ActivatedRoute,
    private discussionService: DiscussionService,
    private loggerService: LoggerService,
    private router: Router,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.loginProfile = this.userService.getProfile();
    this.getDiscussion()
  }

  ngOnDestroy(): void {
    this.isComponentIsActive.next(true);
    this.isComponentIsActive.complete();
  }

  getDiscussion() {
    if (!this.id) return;

    this.discussionService.get(this.id)
      .pipe(takeUntil(this.isComponentIsActive))
      .subscribe({
        next: res => {
          if (this.checkIfOwner(res.data))
            this.discussionForm.patchValue(res.data)
          else {
            this.loggerService.showError('Not your discussion to edit.')
            this.router.navigateByUrl('/');
          }
        },
        error: err => {
          this.loggerService.showError(err.error.message);
        }
      });
  }

  checkIfOwner(d: Discussion): boolean {
    if (!this.loginProfile) return false;
    if (d.createdBy._id !== this.loginProfile._id) return false;
    return true;
  }

  saveDiscussion() {
    if (this.discussionForm.invalid) {
      this.loggerService.showError('Cannot submit incomplete form');
      return;
    }

    (
      this.id
        ? this.discussionService.update(this.id, this.discussionForm.value)
        : this.discussionService.add(this.discussionForm.value)
    )
      .pipe(
        takeUntil(this.isComponentIsActive)
      ).subscribe({
        next: res => {
          this.router.navigate(['/home/discussionDetail/', res.data._id])
        },
        error: err => {
          this.loggerService.showError(err.error.error);
        }
      });
  }

  cancelSaveDiscussion() {
    if (this.id) {
      this.router.navigate(['/home/discussionDetail/', this.id]);
    } else {
      this.router.navigateByUrl('/discussionDetail');
    }
  }

}
