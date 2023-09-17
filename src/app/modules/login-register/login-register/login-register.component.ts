import { Component, EventEmitter, Optional, Output } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-login-register',
  templateUrl: './login-register.component.html',
  styleUrls: ['./login-register.component.scss']
})
export class LoginRegisterComponent {

  selectedTabIndex = 0;
  @Output() successfull = new EventEmitter<void>();

  constructor(@Optional() public dialogRef: MatDialogRef<LoginRegisterComponent>) {
  }

  handleSwipe(direction: number): void {
    if (direction > 0 && this.selectedTabIndex === 0) {
      this.selectedTabIndex = 1
    } else if (direction < 0 && this.selectedTabIndex === 1) {
      this.selectedTabIndex = 0
    }
  }

  emitSuccess() {
    this.successfull.emit();
    this.dialogRef?.close();
  }
}
