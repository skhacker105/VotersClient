import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home/home.component';
import { AddEditDiscussionComponent } from './add-edit-discussion/add-edit-discussion.component';
// import { AddEditVoteTypeComponent } from './add-edit-vote-type/add-edit-vote-type.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from 'src/app/core/core.module';
import { DiscussionDetailComponent } from './discussion-detail/discussion-detail.component';


@NgModule({
  declarations: [
    HomeComponent,
    AddEditDiscussionComponent,
    // AddEditVoteTypeComponent,
    DiscussionDetailComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    CoreModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class HomeModule { }
