import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WelcomeRoutingModule } from './welcome-routing.module';
import { WelcomeComponent } from './welcome/welcome.component';
import { CoreModule } from 'src/app/core/core.module';
import { IndustryCardComponent } from './welcome/industry-card/industry-card.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    WelcomeComponent,
    IndustryCardComponent
  ],
  imports: [
    CommonModule,
    WelcomeRoutingModule,
    CoreModule,
    FormsModule
  ]
})
export class WelcomeModule { }
