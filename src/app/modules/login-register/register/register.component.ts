import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  registerForm: FormGroup<any> = new FormGroup({
    email: new FormControl<string>('', Validators.required),
    name: new FormControl<string>('', Validators.required),
    password: new FormControl<string>('', Validators.required),
    cpassword: new FormControl<string>('', Validators.required)
  });isComponentIsActive = new Subject<boolean>();

  constructor(private userService: UserService, private router: Router){}
  

  ngOnDestroy(): void {
    this.isComponentIsActive.next(true);
    this.isComponentIsActive.complete();
  }

  register() {
    if (this.registerForm.invalid) return;

    this.userService.register(this.registerForm.controls['email'].value, this.registerForm.controls['password'].value, this.registerForm.controls['name'].value)
    .pipe(
      takeUntil(this.isComponentIsActive)
    ).subscribe({
      next: res => {
        this.userService.saveSession(res.data);
        this.router.navigateByUrl('/home');
      },
      error: err => {
        console.log('Error: ', err);
      }
    })
  }
}
