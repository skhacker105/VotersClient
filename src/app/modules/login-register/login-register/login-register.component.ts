import { Component } from '@angular/core';

@Component({
  selector: 'app-login-register',
  templateUrl: './login-register.component.html',
  styleUrls: ['./login-register.component.scss']
})
export class LoginRegisterComponent {

  selectedTabIndex = 0;

  handleSwipe(direction: number): void {
    if (direction > 0 && this.selectedTabIndex === 0) {
      this.selectedTabIndex = 1
    } else if (direction < 0 && this.selectedTabIndex === 1) {
      this.selectedTabIndex = 0
    }
  }
}
