import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OwlOptions, SlidesOutputData } from 'ngx-owl-carousel-o';
import { Subject, takeUntil } from 'rxjs';
import { REGISTRATION_STATE } from 'src/app/core/constants/registration-state';
import { Discussion } from 'src/app/core/models/discussion';
import { IRegistrationState } from 'src/app/core/models/registration-state';
import { IUser } from 'src/app/core/models/user';
import { IRegisterVoteType } from 'src/app/core/models/vote';
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
  loginProfile: IUser | undefined;
  discussion: Discussion | undefined;
  existingRegistration: IRegisterVoteType | undefined;
  isComponentIsActive = new Subject<boolean>();
  isEdittingAllowed = true;

  voteTypeForm = new FormGroup<any>({
    ui_id: new FormControl<string>(HelperService.NEWID(16)),
    iconOption: new FormControl<string | undefined>(undefined, Validators.required),
    image: new FormControl<string | undefined>(undefined),
    name: new FormControl<string>('', Validators.required),
    profile: new FormControl<string>('', Validators.required),
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
    private userService: UserService,
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
          if (!res.data) {
            this.loggerService.showError('Cannot find Discussion');
            this.router.navigateByUrl('/home');
            return;
          }
          if (!res.data.isRegistrationEnabled) {
            this.loggerService.showError('Discussion is not open for registration.');
            this.router.navigateByUrl('/home');
            return;
          }

          this.discussion = res.data;
          this.loadExistingRegistration();
          this.checkIfEdittingAllowed();
        },
        error: err => this.loggerService.showError(err.error.message)
      });
  }

  loadExistingRegistration() {
    this.resetVoteTypeForm();
    const registration = this.discussion?.registrations.find(r => r.ui_id === this.loginProfile?._id);
    if (!registration) return;

    this.existingRegistration = registration;
    this.voteTypeForm.patchValue(registration);
  }

  checkIfEdittingAllowed() {
    const isDiscussionOwner = this.discussion?.createdBy._id === this.loginProfile?._id;
    const isProfileOwner = this.existingRegistration?.createdBy._id === this.loginProfile?._id;

    if (isDiscussionOwner) { if (this.existingRegistration && !isProfileOwner) this.isEdittingAllowed = false; }
    else if (isProfileOwner) { if (this.discussion?.isRegistrationEnabled) this.isEdittingAllowed = true; }
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

  handleRegistrationStateChange(newState: IRegistrationState) {
    if (!this.discussion || !this.existingRegistration) return;

    this.discussion.confirmRegistrationStateChange(this.existingRegistration, newState)
      .then(result => {
        if (!result) return;
        this.saveNewRegistrationState(newState);
      });
  }

  saveNewRegistrationState(newState: IRegistrationState) {
    if (!this.discussion || !this.existingRegistration || !this.existingRegistration._id) return;

    this.discussionService.updateRegistrationState(this.discussion._id, this.existingRegistration._id, newState.key)
    .pipe(takeUntil(this.isComponentIsActive))
    .subscribe({
      next: () => {
        if (!this.discussion || !this.existingRegistration) return;

        this.discussion.changeRegistrationState(this.existingRegistration, newState)
      },
      error: err => this.loggerService.showError(err.error.message)
    });
  }

  submitProfile() {
    if (!this.id) return;
    if (this.voteTypeForm.invalid) {
      this.loggerService.showError('Incomplete Profile')
      return;
    }

    let profile = this.voteTypeForm.value;
    profile['state'] = REGISTRATION_STATE['draft'].key;

    (
      this.existingRegistration
        ? this.discussionService.updateProfile(this.id, profile)
        : this.discussionService.registerProfile(this.id, profile)
    )
      .pipe(takeUntil(this.isComponentIsActive))
      .subscribe({
        next: res => {
          if (res.data) {
            this.discussion?.updateRegisteredProfile(res.data);
            this.existingRegistration = res.data;
            this.loggerService.showSuccess('Saved successfully!')
            this.router.navigate(['/discussion/discussionDetail/', this.discussion?._id])
          }
        },
        error: err => this.loggerService.showError(err.error.message)
      });
  }



}
