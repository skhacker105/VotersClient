import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddEditDiscussionComponent } from './add-edit-discussion/add-edit-discussion.component';
import { DiscussionDetailComponent } from './discussion-detail/discussion-detail.component';
import { LoginGuard } from 'src/app/core/routeGuard/login.guard';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'addDiscussion'
  },
  {
    path: 'addDiscussion',
    canActivate: [LoginGuard],
    component: AddEditDiscussionComponent,
    children: [
      {
        path: 'voteType',
        component: AddEditDiscussionComponent
      }
    ]
  },
  {
    path: 'editDiscussion/:id',
    canActivate: [LoginGuard],
    component: AddEditDiscussionComponent,
    children: [
      {
        path: 'voteType',
        component: AddEditDiscussionComponent
      }
    ]
  },
  {
    path: 'discussionDetail/:id',
    component: DiscussionDetailComponent,
    children: [
      {
        path: 'voteType',
        component: DiscussionDetailComponent
      }
    ]
  },
  {
    path: '*',
    redirectTo: 'addDiscussion',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'addDiscussion',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DiscussionRoutingModule { }
