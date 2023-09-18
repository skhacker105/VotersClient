import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { OwlOptions, SlidesOutputData } from 'ngx-owl-carousel-o';
import { Subject, takeUntil } from 'rxjs';
import { Discussion } from 'src/app/core/models/discussion';
import { IUser } from 'src/app/core/models/user';
import { DiscussionService } from 'src/app/core/services/discussion.service';
import { LoggerService } from 'src/app/core/services/logger.service';
import { UserService } from 'src/app/core/services/user.service';
import { HelperService } from 'src/app/core/utilities/helper';

@Component({
  selector: 'app-register-wizard',
  templateUrl: './register-wizard.component.html',
  styleUrls: ['./register-wizard.component.scss']
})
export class RegisterWizardComponent implements OnInit, OnDestroy {

  id: string | undefined | null;
  discussion: Discussion | undefined;
  isComponentIsActive = new Subject<boolean>();

  voteTypeForm = new FormGroup<any>({
    ui_id: new FormControl<string>(HelperService.NEWID(16)),
    iconOption: new FormControl<string | undefined>(
      undefined,
      Validators.required
    ),
    image: new FormControl<string | undefined>(undefined),
    name: new FormControl<string>('', Validators.required),
    profile: new FormControl<string>(''),
  });

  customOptions: OwlOptions = {
    loop: false,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    navSpeed: 600,
    navText: [
      '<span class="selected-discussion-nav">Selected Discussion</span>',
      '<span class="my-profile-nav">My Profile</span>'
    ],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 1
      },
      760: {
        items: 1
      },
      1000: {
        items: 2
      }
    },
    nav: true,
  }

  constructor(
    private route: ActivatedRoute,
    private discussionService: DiscussionService,
    private loggerService: LoggerService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.resetVoteTypeForm();
    this.loadDiscussionDetail();
  }

  ngOnDestroy(): void {
    this.isComponentIsActive.next(true);
    this.isComponentIsActive.complete();
  }

  resetVoteTypeForm() {
    this.voteTypeForm.reset();
    this.voteTypeForm.controls['ui_id'].setValue(this.userService.getProfile()?._id);
    this.voteTypeForm.controls['iconOption'].setValue(this.discussionService.iconOptions.image);
    this.voteTypeForm.controls['image'].setValue(this.userService.getAvatar());
    this.voteTypeForm.controls['name'].setValue(this.userService.getProfile()?.name);
    this.voteTypeForm.markAsPristine();
  }

  loadDiscussionDetail() {
    if (!this.id) return;
    this.discussionService.get(this.id)
      .pipe(takeUntil(this.isComponentIsActive))
      .subscribe({
        next: res => {
          this.discussion = res.data;
        },
        error: err => this.loggerService.showError(err.error.message)
      });
  }

  handleSlidedData(slideState: SlidesOutputData) {
    console.log('slideState = ', slideState);
  }

  isLessThanToday(dt: Date): boolean {
    const today = new Date();
    const newDT = new Date(dt);
    newDT.setHours(23, 59, 59, 999);
    return newDT.getTime() < today.getTime()
  }

  isToday(dt: Date): boolean {
    const today = new Date();
    const newDT = new Date(dt);
    return today.getDate() === newDT.getDate() && today.getMonth() === newDT.getMonth() && today.getFullYear() === newDT.getFullYear();
  }

}
