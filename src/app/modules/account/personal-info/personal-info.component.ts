import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ExpandCollapseAnimation } from 'src/app/core/animations/expand-collapse.animation';
import { ConfirmationDialogComponent } from 'src/app/core/component/confirmation-dialog/confirmation-dialog.component';
import { IConfirmationDialogData } from 'src/app/core/models/confirmation-dialog.model';
import { IUser } from 'src/app/core/models/user';
import { LoggerService } from 'src/app/core/services/logger.service';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-personal-info',
  templateUrl: './personal-info.component.html',
  styleUrls: ['./personal-info.component.scss'],
  animations: [ExpandCollapseAnimation]
})
export class PersonalInfoComponent implements OnInit, OnDestroy {

  id: string | undefined | null;
  isEditting = false;
  isMyProfile = false;
  isComponentIsActive = new Subject<boolean>();
  loginProfile: IUser | undefined;
  loadedUser: IUser | undefined;
  personalInfoForm = new FormGroup({
    avatar: new FormControl<string | undefined>(undefined),
    name: new FormControl<string | undefined>(undefined)
  });

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private loggerService: LoggerService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loginProfile = this.userService.getProfile();
    this.trackQueryParamsChange();
  }

  ngOnDestroy(): void {
    this.isComponentIsActive.next(true);
    this.isComponentIsActive.complete();
  }

  trackQueryParamsChange() {
    this.route.queryParamMap
      .pipe(takeUntil(this.isComponentIsActive))
      .subscribe((queryParam: any) => {
        this.id = queryParam?.params?.id ? queryParam.params.id : this.loginProfile?._id;
        this.isMyProfile = this.id === this.loginProfile?._id;
        this.loadUserInfo();
      });
  }

  loadUserInfo() {
    if (!this.id) return;

    this.userService.getUserById(this.id)
      .pipe(takeUntil(this.isComponentIsActive))
      .subscribe({
        next: userRes => {
          this.loadedUser = userRes.data;
          this.personalInfoForm.patchValue({ avatar: userRes.data.avatar, name: userRes.data.name })
        },
        error: err => this.loggerService.showError('Error while fetching user info.')
      });
  }

  handleFileInput(e: any) {
    try {
      const reader = new FileReader();
      reader.onload = () => {
        this.userService.resizeImage(reader.result).then((imageURL) => {
          this.personalInfoForm.controls['avatar'].patchValue(imageURL);
          this.saveChanges();
        });
      };
      reader.readAsDataURL(e.target.files[0]);
    } catch (e) {
      console.log('Error in image read: ', e);
    }
  }

  saveChanges() {
    if (!this.id) return;
    this.isEditting = false
    if (this.personalInfoForm.invalid) {
      this.loggerService.showError('Invalid or Incomplete data');
      return;
    }

    this.userService.updateUserPersoanlInfoById(this.personalInfoForm.value)
      .pipe(takeUntil(this.isComponentIsActive))
      .subscribe({
        next: res => {
          this.userService.saveSession(res.data);
          const newAvatar = this.personalInfoForm.controls['avatar'].value;
          if (newAvatar) this.userService.saveAvatar(newAvatar)
        },
        error: err => this.loggerService.showError('Error while updating user information')
      });
  }

  cancelNameChange() {
    this.isEditting = false;
    if (!this.loadedUser) return;
    this.personalInfoForm.patchValue({ avatar: this.loadedUser.avatar, name: this.loadedUser.name })
  }

  handleDeleteAvatar() {
    const config: IConfirmationDialogData = {
      message: `Are you sure you want to remove your profile picture?`,
      okDisplay: "Delete",
      cancelDisplay: "Cancel",
      color: "warn",
    };
    const ref = this.dialog.open(ConfirmationDialogComponent, {
      data: config,
    });
    ref.afterClosed()
      .pipe(takeUntil(this.isComponentIsActive))
      .subscribe((result) => {
        result ? this.deleteAvatar() : null;
      });
  }

  deleteAvatar() {
    this.personalInfoForm.controls['avatar'].setValue(undefined);
    this.userService.saveAvatar('');
    this.saveChanges();
  }

}
