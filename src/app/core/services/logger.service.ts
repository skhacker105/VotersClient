import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PageMessageComponent } from '../component/page-message/page-message.component';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {

  constructor(private _snackBar: MatSnackBar) { }

  show(msg: string, duration = 5) {
    this._snackBar.openFromComponent(PageMessageComponent, {
      duration: duration * 1000,
      panelClass: 'logger-container',
      data: {
        message: msg
      }
    });
  }

  showSuccess(msg: string, duration = 5) {
    this._snackBar.openFromComponent(PageMessageComponent, {
      duration: duration * 1000,
      panelClass: 'logger-container',
      data: {
        isSuccess: true,
        message: msg
      }
    });
  }

  showError(msg: string, duration = 5) {
    this._snackBar.openFromComponent(PageMessageComponent, {
      duration: duration * 1000,
      panelClass: 'logger-container',
      horizontalPosition: 'center',
      data: {
        isError: true,
        message: msg
      }
    });
  }
}
