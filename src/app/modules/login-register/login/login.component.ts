import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ServerResponse } from 'src/app/core/models/serverResponse';
import { LoggerService } from 'src/app/core/services/logger.service';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnDestroy {

  isComponentIsActive = new Subject<boolean>();
  constructor(private userService: UserService, private router: Router, private loggerService: LoggerService){}

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
        this.userService.saveSession(res.data);
        this.router.navigateByUrl('/home');
      },
      error: (err: any) => {
        this.loggerService.showError(err.error.message)
      }
    })
  }
}
