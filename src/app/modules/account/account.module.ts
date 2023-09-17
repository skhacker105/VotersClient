import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountRoutingModule } from './account-routing.module';
import { PersonalInfoComponent } from './personal-info/personal-info.component';
import { CoreModule } from 'src/app/core/core.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    PersonalInfoComponent
  ],
  imports: [
    CommonModule,
    AccountRoutingModule,
    CoreModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AccountModule { }
