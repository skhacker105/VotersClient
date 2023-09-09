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
    path: 'home',
    canActivate: [LoginGuard],
    loadChildren: () => import('./modules/home/home.module').then(m => m.HomeModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
