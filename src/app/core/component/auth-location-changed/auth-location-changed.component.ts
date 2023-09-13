import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { IUser } from '../../models/user';
import { Subject, takeUntil } from 'rxjs';
import { LoggerService } from '../../services/logger.service';

interface IAlwasyAllow {
  alwaysAllow: boolean;
  createdOn: Date;
  createdByUserId: string;
}

@Component({
  selector: 'app-auth-location-changed',
  templateUrl: './auth-location-changed.component.html',
  styleUrls: ['./auth-location-changed.component.scss']
})
export class AuthLocationChangedComponent implements OnInit, OnDestroy {


  localStorageKey = 'alwaysAllow';
  isComponentIsActive = new Subject<boolean>();
  alwaysAllowObj: IAlwasyAllow = {
    alwaysAllow: false,
    createdOn: new Date(),
    createdByUserId: ''
  };
  constructor(private userService: UserService, private router: Router, private loggerService: LoggerService) { }

  ngOnInit(): void {
    const loginProfileId = this.userService.getProfile()?._id;
    if (!loginProfileId) this.router.navigateByUrl('/home');
    else {
      this.alwaysAllowObj.createdByUserId = loginProfileId
      this.redirectIfPermissionGivenBefore();
    }
  }

  ngOnDestroy(): void {
    this.isComponentIsActive.next(true);
    this.isComponentIsActive.complete();
  }

  redirectIfPermissionGivenBefore() {
    const obj = this.getAlwaysAllow();
    if (obj && obj.alwaysAllow) this.registerLocationChange();
  }

  logout() {
    this.userService.clearSession();
    this.router.navigateByUrl('/login');
    this.userService.authLocationChanged = false;
  }

  handleAlwaysAllowPermission(e: MatCheckboxChange) {
    this.alwaysAllowObj.alwaysAllow = e.checked;
    this.saveAlwaysAllow();
  }

  saveAlwaysAllow() {
    if (!this.alwaysAllowObj.createdByUserId) return;

    if (this.alwaysAllowObj.alwaysAllow)
      localStorage.setItem(this.localStorageKey, JSON.stringify(this.alwaysAllowObj))
    else
      localStorage.removeItem(this.localStorageKey)
  }

  getAlwaysAllow(): IAlwasyAllow | undefined {
    const obj = localStorage.getItem(this.localStorageKey);
    if (obj) return JSON.parse(obj) as IAlwasyAllow;
    else return undefined;
  }

  registerLocationChange() {
    this.userService.registerLocationChange()
      .pipe(takeUntil(this.isComponentIsActive))
      .subscribe({
        next: res => {
          this.userService.saveSession(res.data)
          this.userService.authLocationChanged = false;
        },
        error: err => this.loggerService.showError('Failed to register new location.')
      });
  }
}
