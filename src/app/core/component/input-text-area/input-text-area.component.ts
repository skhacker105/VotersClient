import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IInputTextAreaData } from '../../models/input-text-area';

@Component({
  selector: 'app-input-text-area',
  templateUrl: './input-text-area.component.html',
  styleUrls: ['./input-text-area.component.scss']
})
export class InputTextAreaComponent implements OnInit {

  message = new FormControl('', Validators.required)

  constructor(public dialogRef: MatDialogRef<InputTextAreaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IInputTextAreaData) { }

  ngOnInit(): void {
    if (this.data.message) this.message.setValue(this.data.message)
  }
}
