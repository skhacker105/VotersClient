import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IInputVoteWizard } from '../../models/input-vote-wizars';

@Component({
  selector: 'app-input-vote-wizard',
  templateUrl: './input-vote-wizard.component.html',
  styleUrls: ['./input-vote-wizard.component.scss']
})
export class InputVoteWizardComponent implements OnInit {

  selectedIndex = 0;
  message = new FormControl('', Validators.required)

  constructor(public dialogRef: MatDialogRef<InputVoteWizardComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IInputVoteWizard) { }

  ngOnInit(): void {
    if (this.data.message) this.message.setValue(this.data.message)
  }
}
