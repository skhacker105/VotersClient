import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AddEditDiscussionComponent } from './add-edit-discussion/add-edit-discussion.component';
import { AddEditVoteTypeComponent } from './add-edit-vote-type/add-edit-vote-type.component';
import { DiscussionDetailComponent } from './discussion-detail/discussion-detail.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'addDiscussion',
    component: AddEditDiscussionComponent
  },
  {
    path: 'editDiscussion/:id',
    component: AddEditDiscussionComponent
  },
  {
    path: 'discussionDetail/:id',
    component: DiscussionDetailComponent
  },
  {
    path: 'addVoteType',
    component: AddEditVoteTypeComponent
  },
  {
    path: '*',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
