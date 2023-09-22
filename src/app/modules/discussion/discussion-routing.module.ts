import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddEditDiscussionComponent } from './add-edit-discussion/add-edit-discussion.component';
import { DiscussionDetailComponent } from './discussion-detail/discussion-detail.component';
import { LoginGuard } from 'src/app/core/routeGuard/login.guard';
import { RegisterWizardComponent } from './register-wizard/register-wizard.component';
import { RegistrationsComponent } from './registrations/registrations.component';
import { RegistrationProfileComponent } from './registration-profile/registration-profile.component';

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
    path: 'register/:id',
    canActivate: [LoginGuard],
    component: RegisterWizardComponent
  },
  {
    path: 'registrations/:id',
    canActivate: [LoginGuard],
    component: RegistrationsComponent
  },
  {
    path: 'profile/:id/:ui_id',
    component: RegistrationProfileComponent
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
