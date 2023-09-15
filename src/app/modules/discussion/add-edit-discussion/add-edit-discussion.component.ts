import {
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Observable, Subject, map, startWith, take, takeUntil } from 'rxjs';
import { MATERIAL_ICONS } from 'src/app/core/constants/material-icon';
import { Discussion } from 'src/app/core/models/discussion';
import { IUser } from 'src/app/core/models/user';
import { IVoteType } from 'src/app/core/models/vote';
import { DiscussionService } from 'src/app/core/services/discussion.service';
import { LoggerService } from 'src/app/core/services/logger.service';
import { UserService } from 'src/app/core/services/user.service';
import { VotingService } from 'src/app/core/services/voting.service';
import { HelperService } from 'src/app/core/utilities/helper';
import Quill from 'quill';
import BlotFormatter from 'quill-blot-formatter';
Quill.register('modules/blotFormatter', BlotFormatter);

@Component({
  selector: 'app-add-edit-discussion',
  templateUrl: './add-edit-discussion.component.html',
  styleUrls: ['./add-edit-discussion.component.scss'],
})
export class AddEditDiscussionComponent implements OnInit, OnDestroy {
  id: string | null | undefined;
  ui_id: string | null | undefined;
  isComponentIsActive = new Subject<boolean>();
  loginProfile: IUser | undefined;
  matIcons = MATERIAL_ICONS.sort();
  iconOptions = {
    matIcon: 'matIcon',
    image: 'image',
  };
  loadedDiscussion: Discussion | undefined;
  discussionForm = new FormGroup<any>({
    title: new FormControl<string>('', Validators.required),
    message: new FormControl<string>('', Validators.required),
    startDate: new FormControl<Date | undefined>(undefined),
    endDate: new FormControl<Date | undefined>(undefined),
    voteTypes: new FormControl<IVoteType[]>(
      [],
      [Validators.required, Validators.minLength(2)]
    ),
    isRegistrationAllowed: new FormControl<boolean>(false),
    registrationStartDate: new FormControl<Date | undefined>(undefined),
    registrationEndDate: new FormControl<Date | undefined>(undefined),
  });
  voteTypeForm = new FormGroup<any>({
    _id: new FormControl<string>(''),
    ui_id: new FormControl<string>(''),
    iconOption: new FormControl<string | undefined>(
      undefined,
      Validators.required
    ),
    matIcon: new FormControl<string>(''),
    image: new FormControl<string | undefined>(undefined),
    name: new FormControl<string>('', Validators.required),
    profile: new FormControl<string>(''),
  });
  @ViewChild('newVoteTypeForm', { static: true })
  newVoteTypeForm!: TemplateRef<any>;
  typeFormDialogRef: MatDialogRef<any> | undefined;
  $filteredIcons: Observable<string[]> | undefined;
  quillConfig = {
    blotFormatter: {},
  };

  todayDate: Date = new Date();
  allMaterialIcons = MATERIAL_ICONS;

  constructor(
    private route: ActivatedRoute,
    private discussionService: DiscussionService,
    private loggerService: LoggerService,
    private router: Router,
    private userService: UserService,
    public votingService: VotingService,
    private matDialog: MatDialog
  ) {}

  get VoteTypes(): IVoteType[] {
    return this.discussionForm.controls['voteTypes'].value as IVoteType[];
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.ui_id = this.route.snapshot.queryParamMap.get('ui_id');
    this.loginProfile = this.userService.getProfile();
    this.trackURLForVoteTypeForm();
    this.getDiscussion();
    this.handleChangeInIconOptions();
    this.handleChangeInRegistrationCheck();
    this.handleSearchInMatIcon();
  }

  ngOnDestroy(): void {
    this.isComponentIsActive.next(true);
    this.isComponentIsActive.complete();
  }

  trackURLForVoteTypeForm() {
    this.triggerVoteTypePopupIfURL();
    this.router.events
      .pipe(takeUntil(this.isComponentIsActive))
      .subscribe((event) => {
        if (event instanceof NavigationEnd) this.triggerVoteTypePopupIfURL();
      });
  }

  triggerVoteTypePopupIfURL() {
    const isVoteTypeURL = (url: string, options: string[]) =>
      options.some((o) => url.indexOf(o) >= 0);

    this.ui_id = this.route.snapshot.queryParamMap.get('ui_id');
    if (
      !this.ui_id &&
      isVoteTypeURL(this.router.url, [
        `addDiscussion/voteType`,
        `editDiscussion/${this.id}/voteType`,
      ])
    )
      this.handleAddEditVoteType();
    else if (this.ui_id && this.loadedDiscussion) {
      const votetype = this.loadedDiscussion.voteTypes.find(
        (v) => v.ui_id === this.ui_id
      );
      this.handleAddEditVoteType(votetype);
    } else if (
      this.ui_id &&
      (this.discussionForm.controls['voteTypes'].value as IVoteType[]).length >
        0
    ) {
      const votetype = (
        this.discussionForm.controls['voteTypes'].value as IVoteType[]
      ).find((v) => v.ui_id === this.ui_id);
      this.handleAddEditVoteType(votetype);
    }
  }

  getDiscussion() {
    if (!this.id) return;

    this.discussionService
      .get(this.id)
      .pipe(takeUntil(this.isComponentIsActive))
      .subscribe({
        next: (res) => {
          this.prepareDiscussionObjectToEdit(res.data);
        },
        error: (err) => {
          this.loggerService.showError(err.error.message);
        },
      });
  }

  prepareDiscussionObjectToEdit(discussion?: Discussion) {
    if (!discussion) return;

    this.loadedDiscussion = discussion;
    this.redirectIfNotAllowed(discussion);
    if (this.checkIfOwner(discussion)) {
      this.discussionForm.patchValue(discussion);
      if (this.ui_id) {
        const voteType = discussion.voteTypes.find(
          (v) => v.ui_id === this.ui_id
        );
        this.handleAddEditVoteType(voteType);
      }
    } else {
      this.loggerService.showError('Not your discussion to edit.');
      this.router.navigateByUrl('/');
    }
  }

  redirectIfNotAllowed(discussion: Discussion) {
    if (discussion.isVotingEnabled || discussion.isBlocked) {
      this.loggerService.showError('Editting not allowed.');
      this.router.navigate(['/discussion/discussionDetail', discussion._id]);
    }
  }

  checkIfOwner(d: Discussion): boolean {
    if (!this.loginProfile) return false;

    if (d.createdBy._id !== this.loginProfile._id) return false;

    return true;
  }

  handleChangeInIconOptions() {
    this.voteTypeForm.controls['iconOption'].valueChanges
      .pipe(takeUntil(this.isComponentIsActive))
      .subscribe({
        next: (iconOption) => {
          this.disableAllIconOptions();
          this.voteTypeForm.markAsTouched();
          switch (iconOption) {
            case this.iconOptions.matIcon:
              this.voteTypeForm.controls['matIcon'].enable();
              this.voteTypeForm.controls['matIcon'].addValidators(
                Validators.required
              );
              break;
            case this.iconOptions.image:
              this.voteTypeForm.controls['image'].enable();
              this.voteTypeForm.controls['image'].addValidators(
                Validators.required
              );
              break;
          }
        },
        error: (err) =>
          this.loggerService.showError('Unable to track Icon Option Change'),
      });
  }

  handleChangeInRegistrationCheck() {
    this.discussionForm.controls['isRegistrationAllowed'].valueChanges
      .pipe(takeUntil(this.isComponentIsActive))
      .subscribe((isRegistrationAllowed) => {
        if (!isRegistrationAllowed) {
          this.discussionForm.controls['registrationStartDate'].disable();
          this.discussionForm.controls['registrationEndDate'].disable();
        } else {
          this.discussionForm.controls['registrationStartDate'].enable();
          this.discussionForm.controls['registrationEndDate'].enable();
        }
      });
  }

  handleSearchInMatIcon() {
    this.$filteredIcons = this.voteTypeForm.controls[
      'matIcon'
    ].valueChanges.pipe(
      takeUntil(this.isComponentIsActive),
      startWith(''),
      map((value) => this._filter(value || ''))
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.matIcons.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }

  disableAllIconOptions() {
    this.voteTypeForm.controls['matIcon'].disable();
    this.voteTypeForm.controls['image'].disable();
    this.voteTypeForm.controls['matIcon'].removeValidators(Validators.required);
    this.voteTypeForm.controls['image'].removeValidators(Validators.required);
  }

  onIconSelect(icon: string) {
    this.voteTypeForm.controls['matIcon'].setValue(icon);
    this.voteTypeForm.controls['matIcon'].markAllAsTouched();
  }

  handleFileInput(e: any) {
    try {
      const reader = new FileReader();
      reader.onload = () => {
        this.resizeImage(reader.result).then((imageURL) => {
          this.voteTypeForm.controls['image'].patchValue(imageURL);
        });
      };
      reader.readAsDataURL(e.target.files[0]);
    } catch (e) {
      console.log('Error in image read: ', e);
    }
  }

  resizeImage(imageURL: any): Promise<any> {
    const standardIconHeight = this.userService.standardIconHeight;
    const standardIconWidth = this.userService.standardIconWidth;
    return new Promise((resolve) => {
      const image = new Image();
      image.onload = function () {
        const canvas = document.createElement('canvas');
        canvas.width = standardIconHeight;
        canvas.height = standardIconWidth;
        const ctx = canvas.getContext('2d');
        if (ctx != null) {
          ctx.drawImage(image, 0, 0, standardIconHeight, standardIconWidth);
        }
        var data = canvas.toDataURL('image/jpeg', 1);
        resolve(data);
      };
      image.src = imageURL;
    });
  }

  navigateToVoteType(voteType: IVoteType) {
    if (this.id)
      this.router.navigateByUrl(
        `/discussion/editDiscussion/${this.id}/voteType?ui_id=${voteType.ui_id}`
      );
    else
      this.router.navigateByUrl(
        `/discussion/addDiscussion/voteType?ui_id=${voteType.ui_id}`
      );
  }

  saveDiscussion() {
    if (this.discussionForm.invalid) {
      this.loggerService.showError('Cannot submit incomplete form');
      return;
    }

    (this.id
      ? this.discussionService.update(this.id, this.discussionForm.value)
      : this.discussionService.add(this.discussionForm.value)
    )
      .pipe(takeUntil(this.isComponentIsActive))
      .subscribe({
        next: (res) => {
          this.router.navigate(['/discussion/discussionDetail/', res.data._id]);
        },
        error: (err) => {
          this.loggerService.showError(err.error.message);
        },
      });
  }

  cancelSaveDiscussion() {
    if (this.id) {
      this.router.navigate(['/discussion/discussionDetail/', this.id]);
    } else {
      this.router.navigateByUrl('/discussionDetail');
    }
  }

  handleAddEditVoteType(voteType?: IVoteType) {
    this.voteTypeForm.reset();
    this.disableAllIconOptions();
    if (voteType) this.voteTypeForm.patchValue(voteType);

    this.typeFormDialogRef = this.matDialog.open(this.newVoteTypeForm, {
      width: '100vw',
      maxWidth: 'none',
    });

    this.typeFormDialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe(() => {
        this.router.navigate(['./'], { relativeTo: this.route });
      });
  }

  handleVoteTypeSubmit() {
    // Mark as touched
    Object.keys(this.voteTypeForm.controls).forEach((field) => {
      const control = this.voteTypeForm.get(field) as FormControl;
      control.markAsTouched({ onlySelf: true });
      control.updateValueAndValidity();
    });

    // Validation check
    if (this.voteTypeForm.invalid) {
      this.loggerService.showError('Cannot submit incomplete form');
      return;
    }
    this.typeFormDialogRef?.close();

    // Add or Update in Discussion Form
    const newVoteType: IVoteType = this.voteTypeForm.value;
    if (!newVoteType.ui_id) this.addNewVoteType(newVoteType);
    else this.updatewVoteType(newVoteType);

    this.discussionForm.markAllAsTouched();
    this.discussionForm.updateValueAndValidity();
  }

  addNewVoteType(newVoteType: IVoteType) {
    let voteTypes = this.discussionForm.controls['voteTypes']
      .value as IVoteType[];
    voteTypes = voteTypes ? voteTypes : [];
    newVoteType.ui_id = HelperService.NEWID(16);
    voteTypes.push(newVoteType);
    this.discussionForm.controls['voteTypes'].setValue(voteTypes);
  }

  updatewVoteType(existingVoteType: IVoteType) {
    let voteTypes = this.discussionForm.controls['voteTypes']
      .value as IVoteType[];
    if (!voteTypes) return;

    let existing = voteTypes.find((vt) => vt.ui_id === existingVoteType.ui_id);
    if (!existing) return;

    existing.iconOption = existingVoteType.iconOption;
    existing.image = existingVoteType.image;
    existing.matIcon = existingVoteType.matIcon;
    existing.name = existingVoteType.name;
    existing.profile = existingVoteType.profile;
    this.discussionForm.controls['voteTypes'].setValue(
      JSON.parse(JSON.stringify(voteTypes))
    );
  }
}
