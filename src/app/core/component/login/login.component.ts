import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, take, takeUntil } from 'rxjs';
import { LoggerService } from 'src/app/core/services/logger.service';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnDestroy {

  @Input() redirectAfterLogin = true;
  @Output() loginSuccessfull = new EventEmitter<void>();

  isComponentIsActive = new Subject<boolean>();
  constructor(private userService: UserService, private router: Router, private loggerService: LoggerService) { }

  loginForm: FormGroup = new FormGroup({
    email: new FormControl<string>('', Validators.required),
    password: new FormControl<string>('', Validators.required)
  });


  ngOnDestroy(): void {
    this.isComponentIsActive.next(true);
    this.isComponentIsActive.complete();
  }

  login() {
    if (this.loginForm.invalid) return;

    this.userService.login(this.loginForm.controls['email'].value, this.loginForm.controls['password'].value)
      .pipe(
        takeUntil(this.isComponentIsActive)
      ).subscribe({
        next: res => {
          if (!res.data) {
            this.loggerService.showError('Login failed');
            return;
          }

          this.userService.saveSession(res.data);
          this.loadUserAvatar(res.data)
          if (this.redirectAfterLogin)
            this.router.navigateByUrl('/home');
          else this.loginSuccessfull.emit();
        },
        error: (err: any) => {
          this.loggerService.showError(err.error.message)
        }
      })
  }

  loadUserAvatar(token: string) {

      const userProfile = this.userService.getProfile(token);
      if (!userProfile) return;

      this.userService.loadUserAvatar(userProfile._id)
        .pipe(take(1))
        .subscribe({
          next: avatarRes => {
            if (avatarRes.data)
            this.userService.saveAvatar(avatarRes.data)
          },
          error: err => {}
        })

  }
}
