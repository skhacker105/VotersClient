import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginRegisterRoutingModule } from './login-register-routing.module';
import { LoginRegisterComponent } from './login-register/login-register.component';
import { CoreModule } from 'src/app/core/core.module';
import { MaterialModule } from 'src/app/core/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

@NgModule({
  declarations: [
    LoginRegisterComponent,
    LoginComponent,
    RegisterComponent
  ],
  imports: [
    CommonModule,
    LoginRegisterRoutingModule,
    CoreModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class LoginRegisterModule { }
