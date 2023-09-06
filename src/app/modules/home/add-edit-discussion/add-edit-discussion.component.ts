import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { DiscussionService } from 'src/app/core/services/discussion.service';
import { LoggerService } from 'src/app/core/services/logger.service';

@Component({
  selector: 'app-add-edit-discussion',
  templateUrl: './add-edit-discussion.component.html',
  styleUrls: ['./add-edit-discussion.component.scss']
})
export class AddEditDiscussionComponent implements OnInit, OnDestroy {

  id: string | null | undefined;
  isComponentIsActive = new Subject<boolean>();
  discussionForm = new FormGroup<any>({
    title: new FormControl<string>('', Validators.required),
    message: new FormControl<string>('', Validators.required)
  });

  constructor(
    private route: ActivatedRoute,
    private discussionService: DiscussionService,
    private loggerService: LoggerService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
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
          this.discussionForm.patchValue(res.data)
        },
        error: err => {
          this.loggerService.showError(err.error.message);
        }
      });
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
          this.loggerService.showError(err.error.message);
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
