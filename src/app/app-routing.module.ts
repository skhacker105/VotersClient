import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotLoginGuard } from './core/routeGuard/not-login.guard';
import { LoginGuard } from './core/routeGuard/login.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'welcome',
    pathMatch: 'full'
  },
  {
    path: 'welcome',
    canActivate: [NotLoginGuard],
    loadChildren: () => import('./modules/welcome/welcome.module').then(m => m.WelcomeModule)
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
  },
  {
    path: '*',
    redirectTo: 'welcome',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'welcome',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
