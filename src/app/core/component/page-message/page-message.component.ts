import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';

@Component({
  selector: 'app-page-message',
  templateUrl: './page-message.component.html',
  styleUrls: ['./page-message.component.scss']
})
export class PageMessageComponent {
  isError = false;
  isSuccess = false;
  message = true;
  constructor(
    public snackBarRef: MatSnackBarRef<PageMessageComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public data: any
  ) {
      this.isError = data['isError'];
      this.message = data['message'];
      this.isSuccess = data['isSuccess'];
  }
}
