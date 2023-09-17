import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotLoginGuard } from './core/routeGuard/not-login.guard';
import { LoginGuard } from './core/routeGuard/login.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    canActivate: [NotLoginGuard],
    loadChildren: () => import('./modules/login-register/login-register.module').then(m => m.LoginRegisterModule)
  },
  {
    path: 'account',
    canActivate: [LoginGuard],
    loadChildren: () => import('./modules/account/account.module').then(m => m.AccountModule)
  },
  {
    path: 'home',
    canActivate: [LoginGuard],
    loadChildren: () => import('./modules/home/home.module').then(m => m.HomeModule)
  },
  {
    path: 'discussion',
    loadChildren: () => import('./modules/discussion/discussion.module').then(m => m.DiscussionModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
