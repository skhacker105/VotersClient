import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { IUser } from '../../models/user';

@Component({
  selector: 'app-user-icon',
  templateUrl: './user-icon.component.html',
  styleUrls: ['./user-icon.component.scss']
})
export class UserIconComponent implements OnInit, OnDestroy {

  @Input() avatar: string | undefined;
  @Input() user: IUser | undefined;
  @Input() disabled = false;
  @Input() hideName = false;
  @Input() size = 30;

  loadedAvatar: string | undefined;
  isComponentIsActive = new Subject<boolean>();

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    if (!this.avatar && this.user) this.loadAvatar();
    else this.loadedAvatar = this.avatar;
  }

  ngOnDestroy(): void {
    this.isComponentIsActive.next(true);
    this.isComponentIsActive.complete();
  }

  loadAvatar() {
    if (!this.user) return;

    this.userService.loadUserAvatar(this.user._id)
      .pipe(takeUntil(this.isComponentIsActive))
      .subscribe({
        next: avatarRes => {
          this.loadedAvatar = avatarRes.data;
        }
      });
  }

  gotoUserAccount() {
    if (!this.user) return;

    this.router.navigateByUrl(`/account?id=${this.user._id}`);
  }
}
