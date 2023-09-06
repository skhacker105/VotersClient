import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';
import { DialogModule } from '@angular/cdk/dialog';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatRippleModule,
    MatTabsModule,
    MatCardModule,
    MatInputModule,
    MatSidenavModule,
    MatDialogModule,
    MatSnackBarModule,
    MatMenuModule,
    DialogModule,
    MatAutocompleteModule,
    CarouselModule,
    MatChipsModule,
    MatBadgeModule
  ],
  exports: [
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatRippleModule,
    MatTabsModule,
    MatCardModule,
    MatInputModule,
    MatSidenavModule,
    MatDialogModule,
    MatSnackBarModule,
    MatMenuModule,
    DialogModule,
    MatAutocompleteModule,
    CarouselModule,
    MatChipsModule,
    MatBadgeModule
  ]
})
export class MaterialModule { }
