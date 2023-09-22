import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DiscussionRoutingModule } from './discussion-routing.module';
import { CoreModule } from 'src/app/core/core.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddEditDiscussionComponent } from './add-edit-discussion/add-edit-discussion.component';
import { DiscussionDetailComponent } from './discussion-detail/discussion-detail.component';
import { RegisterWizardComponent } from './register-wizard/register-wizard.component';
import { RegistrationsComponent } from './registrations/registrations.component';
import { RegistrationProfileComponent } from './registration-profile/registration-profile.component';


@NgModule({
  declarations: [
    AddEditDiscussionComponent,
    DiscussionDetailComponent,
    RegisterWizardComponent,
    RegistrationsComponent,
    RegistrationProfileComponent
  ],
  imports: [
    CommonModule,
    DiscussionRoutingModule,
    CoreModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class DiscussionModule { }
